import { google } from "googleapis"
import path from "path"
import { existsSync } from "fs"
import { readFile } from "fs/promises"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DEFAULT_SITEMAP_URL = "https://tachy.io.vn/sitemap.xml"
const INDEXING_SCOPE = "https://www.googleapis.com/auth/indexing"
const VALID_TYPES = new Set(["URL_UPDATED", "URL_DELETED"])

const argv = process.argv.slice(2)
const DRY_RUN = argv.includes("--dry-run")
const SKIP_IF_MISSING_CONFIG = argv.includes("--skip-if-missing-config")
const CONTINUE_ON_ERROR = argv.includes("--continue-on-error")

function getArgValue(name) {
  const flag = `--${name}`
  const arg = argv.find((value) => value.startsWith(`${flag}=`))
  if (arg) return arg.slice(flag.length + 1)

  const index = argv.indexOf(flag)
  if (index !== -1) return argv[index + 1] || ""

  return ""
}

async function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env")
  if (!existsSync(envPath)) return {}

  const text = await readFile(envPath, "utf-8")
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

function decodeXml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

async function fetchSitemapUrls(sitemapUrl, seenSitemaps = new Set()) {
  if (seenSitemaps.has(sitemapUrl)) return []
  seenSitemaps.add(sitemapUrl)

  const res = await fetch(sitemapUrl)
  if (!res.ok) {
    throw new Error(`Failed to fetch sitemap ${sitemapUrl}: ${res.status} ${res.statusText}`)
  }

  const xml = await res.text()
  const locs = unique(
    [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((match) => decodeXml(match[1].trim()))
  )

  if (/<sitemapindex[\s>]/i.test(xml)) {
    const nestedUrls = await Promise.all(locs.map((loc) => fetchSitemapUrls(loc, seenSitemaps)))
    return unique(nestedUrls.flat())
  }

  return locs
}

function getExplicitUrls() {
  const singleUrl = getArgValue("url")
  const urlsArg = getArgValue("urls")
  const urls = urlsArg ? urlsArg.split(",").map((url) => url.trim()) : []
  return unique([singleUrl, ...urls])
}

function assertAbsoluteUrls(urls) {
  for (const url of urls) {
    try {
      const parsed = new URL(url)
      if (!parsed.protocol.startsWith("http")) throw new Error("URL must use http or https")
    } catch {
      throw new Error(`Invalid URL: ${url}`)
    }
  }
}

function getServiceAccountCredentials(env) {
  const clientEmail =
    process.env.GOOGLE_INDEXING_CLIENT_EMAIL ||
    env.GOOGLE_INDEXING_CLIENT_EMAIL ||
    ""

  const privateKey = (
    process.env.GOOGLE_INDEXING_PRIVATE_KEY ||
    env.GOOGLE_INDEXING_PRIVATE_KEY ||
    ""
  ).replace(/\\n/g, "\n")

  return { clientEmail, privateKey }
}

function getOAuthCredentials(env) {
  return {
    clientId: process.env.GOOGLE_INDEXING_OAUTH_CLIENT_ID || env.GOOGLE_INDEXING_OAUTH_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_INDEXING_OAUTH_CLIENT_SECRET || env.GOOGLE_INDEXING_OAUTH_CLIENT_SECRET || "",
    refreshToken: process.env.GOOGLE_INDEXING_OAUTH_REFRESH_TOKEN || env.GOOGLE_INDEXING_OAUTH_REFRESH_TOKEN || "",
  }
}

function getAuth(env) {
  const serviceAccount = getServiceAccountCredentials(env)
  if (serviceAccount.clientEmail && serviceAccount.privateKey) {
    return {
      auth: new google.auth.GoogleAuth({
        credentials: {
          type: "service_account",
          client_email: serviceAccount.clientEmail,
          private_key: serviceAccount.privateKey,
        },
        scopes: [INDEXING_SCOPE],
      }),
      method: "service account",
    }
  }

  const oauth = getOAuthCredentials(env)
  if (oauth.clientId && oauth.clientSecret && oauth.refreshToken) {
    const auth = new google.auth.OAuth2(oauth.clientId, oauth.clientSecret)
    auth.setCredentials({ refresh_token: oauth.refreshToken })
    return { auth, method: "OAuth owner account" }
  }

  return { auth: null, method: "" }
}

async function notifyUrls({ urls, type, auth, delayMs }) {
  const indexing = google.indexing({ version: "v3", auth })
  const results = { sent: 0, errors: [] }

  for (const [index, url] of urls.entries()) {
    const position = `${index + 1}/${urls.length}`

    try {
      await indexing.urlNotifications.publish({
        requestBody: { url, type },
      })
      results.sent++
      console.log(`[${position}] ${type}: ${url}`)
    } catch (err) {
      const message = err?.response?.data?.error?.message || err.message
      results.errors.push({ url, message })
      console.error(`[${position}] ERROR: ${url}`)
      console.error(`  ${message}`)
    }

    if (delayMs > 0 && index < urls.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  return results
}

async function main() {
  const env = await loadEnv()
  const sitemapUrl = getArgValue("sitemap") || env.GOOGLE_INDEXING_SITEMAP_URL || DEFAULT_SITEMAP_URL
  const type = getArgValue("type") || "URL_UPDATED"
  const limit = Number(getArgValue("limit") || 0)
  const delayMs = Number(getArgValue("delay") || env.GOOGLE_INDEXING_DELAY_MS || 250)

  if (!VALID_TYPES.has(type)) {
    console.error(`Invalid --type value: ${type}`)
    console.error("Allowed values: URL_UPDATED, URL_DELETED")
    process.exit(1)
  }

  let urls = getExplicitUrls()
  if (urls.length === 0) {
    console.log(`Reading sitemap: ${sitemapUrl}`)
    urls = await fetchSitemapUrls(sitemapUrl)
  }

  urls = unique(urls)
  if (limit > 0) urls = urls.slice(0, limit)

  if (urls.length === 0) {
    console.log("No URLs found. Exiting.")
    return
  }

  assertAbsoluteUrls(urls)

  console.log(`Found ${urls.length} URL(s).`)

  if (DRY_RUN) {
    for (const url of urls) {
      console.log(`[DRY-RUN] ${type}: ${url}`)
    }
    return
  }

  const { auth, method } = getAuth(env)
  if (!auth) {
    const message = [
      "Missing Google Indexing API credentials.",
      "Recommended: run node scripts/google-indexing-oauth.mjs to authorize with the Search Console owner account.",
      "Fallback: set GOOGLE_INDEXING_CLIENT_EMAIL and GOOGLE_INDEXING_PRIVATE_KEY if the service account is a verified owner.",
    ].join("\n")

    if (SKIP_IF_MISSING_CONFIG) {
      console.log(message)
      console.log("Skipping because --skip-if-missing-config was provided.")
      return
    }

    console.error(message)
    process.exit(1)
  }

  console.log(`Using auth: ${method}`)

  const results = await notifyUrls({ urls, type, auth, delayMs })

  console.log("\n=== Indexing API Results ===")
  console.log(`  Sent:   ${results.sent}`)
  console.log(`  Errors: ${results.errors.length}`)

  if (results.errors.length > 0 && !CONTINUE_ON_ERROR) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
