import { google } from "googleapis"
import path from "path"
import { existsSync } from "fs"
import { readFile, writeFile } from "fs/promises"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ENV_PATH = path.join(__dirname, "..", ".env")
const INDEXING_SCOPE = "https://www.googleapis.com/auth/indexing"
const DEFAULT_REDIRECT_URI = "http://localhost"

const argv = process.argv.slice(2)

function getArgValue(name) {
  const flag = `--${name}`
  const arg = argv.find((value) => value.startsWith(`${flag}=`))
  if (arg) return arg.slice(flag.length + 1)

  const index = argv.indexOf(flag)
  if (index !== -1) return argv[index + 1] || ""

  return ""
}

async function loadEnvText() {
  if (!existsSync(ENV_PATH)) return ""
  return readFile(ENV_PATH, "utf-8")
}

function parseEnv(text) {
  const env = {}

  for (const line of text.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const eq = trimmed.indexOf("=")
    if (eq === -1) continue

    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    env[key] = value
  }

  return env
}

function setEnvValue(text, name, value) {
  const line = `${name}=${JSON.stringify(value)}`
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const re = new RegExp(`^${escaped}=.*$`, "m")

  if (re.test(text)) return text.replace(re, line)
  return `${text}${text.endsWith("\n") || text.length === 0 ? "" : "\n"}${line}\n`
}

async function loadClientJson(clientJsonPath) {
  if (!clientJsonPath) return null

  const parsed = JSON.parse(await readFile(clientJsonPath, "utf-8"))
  const client = parsed.installed || parsed.web
  if (!client?.client_id || !client?.client_secret) {
    throw new Error("OAuth client JSON must contain installed.client_id/client_secret or web.client_id/client_secret")
  }

  return {
    clientId: client.client_id,
    clientSecret: client.client_secret,
    redirectUri: client.redirect_uris?.[0] || DEFAULT_REDIRECT_URI,
  }
}

function getClient(env) {
  const clientId = process.env.GOOGLE_INDEXING_OAUTH_CLIENT_ID || env.GOOGLE_INDEXING_OAUTH_CLIENT_ID || ""
  const clientSecret = process.env.GOOGLE_INDEXING_OAUTH_CLIENT_SECRET || env.GOOGLE_INDEXING_OAUTH_CLIENT_SECRET || ""
  const redirectUri = process.env.GOOGLE_INDEXING_OAUTH_REDIRECT_URI || env.GOOGLE_INDEXING_OAUTH_REDIRECT_URI || DEFAULT_REDIRECT_URI

  if (!clientId || !clientSecret) {
    throw new Error("Missing GOOGLE_INDEXING_OAUTH_CLIENT_ID and GOOGLE_INDEXING_OAUTH_CLIENT_SECRET. Pass --client-json=/path/to/oauth-client.json first.")
  }

  return { clientId, clientSecret, redirectUri }
}

async function main() {
  let envText = await loadEnvText()
  let env = parseEnv(envText)

  const clientJsonPath = getArgValue("client-json")
  const clientFromJson = await loadClientJson(clientJsonPath)

  if (clientFromJson) {
    envText = setEnvValue(envText, "GOOGLE_INDEXING_OAUTH_CLIENT_ID", clientFromJson.clientId)
    envText = setEnvValue(envText, "GOOGLE_INDEXING_OAUTH_CLIENT_SECRET", clientFromJson.clientSecret)
    envText = setEnvValue(envText, "GOOGLE_INDEXING_OAUTH_REDIRECT_URI", clientFromJson.redirectUri)
    await writeFile(ENV_PATH, envText)
    env = parseEnv(envText)
    console.log("Saved OAuth client settings to .env")
  }

  const { clientId, clientSecret, redirectUri } = getClient(env)
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
  const code = getArgValue("code")

  if (!code) {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [INDEXING_SCOPE],
    })

    console.log("Open this URL with the Google account that owns the Search Console property:")
    console.log(authUrl)
    console.log("\nAfter Google redirects to localhost, copy the code= value from the URL and run:")
    console.log("node scripts/google-indexing-oauth.mjs --code=PASTE_CODE_HERE")
    return
  }

  const { tokens } = await oauth2Client.getToken(code)
  if (!tokens.refresh_token) {
    throw new Error("Google did not return a refresh token. Re-run without --code and make sure prompt=consent is used.")
  }

  envText = await loadEnvText()
  envText = setEnvValue(envText, "GOOGLE_INDEXING_OAUTH_REFRESH_TOKEN", tokens.refresh_token)
  await writeFile(ENV_PATH, envText)

  console.log("Saved GOOGLE_INDEXING_OAUTH_REFRESH_TOKEN to .env")
}

main().catch((err) => {
  console.error("Fatal error:", err.message || err)
  process.exit(1)
})
