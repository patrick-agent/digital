import { existsSync } from "fs"
import { copyFile, mkdir, readFile, writeFile } from "fs/promises"
import path from "path"

const DB_FILES = [
  "blog.json",
  "music.json",
  "events.json",
  "press-kit.json",
  "settings.json",
  "seo.json",
  "gallery.json",
  "case-studies.json",
  "services.json",
  "shop.json",
  "newsletter.json",
  "media.json",
]

const rootDir = process.cwd()
const dbDir = path.join(rootDir, "db")

function parseArgs() {
  const args = process.argv.slice(2)
  const fileArgs = args
    .filter((arg) => arg.startsWith("--file="))
    .map((arg) => arg.slice("--file=".length).trim())
    .filter(Boolean)

  const intervalArg = args.find((arg) => arg.startsWith("--interval="))
  const intervalSeconds = intervalArg ? Number(intervalArg.slice("--interval=".length)) : 60

  return {
    dryRun: args.includes("--dry-run"),
    watch: args.includes("--watch"),
    silentIfMissingToken: args.includes("--silent-if-missing-token"),
    noBackup: args.includes("--no-backup"),
    files: fileArgs.length > 0 ? fileArgs : DB_FILES,
    intervalMs: Math.max(10, Number.isFinite(intervalSeconds) ? intervalSeconds : 60) * 1000,
  }
}

async function loadEnv() {
  const envPath = path.join(rootDir, ".env")
  if (!existsSync(envPath)) return

  const text = await readFile(envPath, "utf-8")
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
    if (process.env[key] === undefined) process.env[key] = value
  }
}

function blobStoreId(token) {
  const parts = String(token || "").split("_")
  if (parts.length >= 4 && parts[0] === "vercel" && parts[1] === "blob" && parts[2] === "rw") {
    return parts[3].toLowerCase()
  }
  return null
}

function normalizeJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-")
}

async function readLocalJson(filePath) {
  if (!existsSync(filePath)) return { exists: false, normalized: null }

  const raw = await readFile(filePath, "utf-8")
  try {
    return { exists: true, raw, normalized: normalizeJson(JSON.parse(raw)) }
  } catch {
    return { exists: true, raw, normalized: raw }
  }
}

async function fetchRemoteJson(filename, token, storeId) {
  const url = `https://${storeId}.private.blob.vercel-storage.com/db/${filename}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })

  if (res.status === 404) return { missing: true }
  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`${filename}: Vercel Blob returned ${res.status}${body ? ` - ${body}` : ""}`)
  }

  const text = await res.text()
  if (!text.trim()) return { missing: true }

  try {
    return { missing: false, normalized: normalizeJson(JSON.parse(text)) }
  } catch (error) {
    throw new Error(`${filename}: remote file is not valid JSON (${error.message})`)
  }
}

async function syncOnce(options) {
  await loadEnv()

  const token = process.env.BLOB_READ_WRITE_TOKEN || ""
  const storeId = blobStoreId(token)

  if (!token || !storeId) {
    const message = "Missing or invalid BLOB_READ_WRITE_TOKEN. Cannot pull production DB from Vercel Blob."
    if (options.silentIfMissingToken) {
      console.log(`[sync:data:pull] ${message} Skipped.`)
      return { changed: 0, skipped: options.files.length }
    }
    throw new Error(message)
  }

  let changed = 0
  let skipped = 0
  let backupDir = null

  if (!options.dryRun) await mkdir(dbDir, { recursive: true })

  for (const filename of options.files) {
    const remote = await fetchRemoteJson(filename, token, storeId)
    if (remote.missing) {
      console.log(`[skip] ${filename}: not found in production Blob`)
      skipped += 1
      continue
    }

    const filePath = path.join(dbDir, filename)
    const local = await readLocalJson(filePath)

    if (local.normalized === remote.normalized) {
      console.log(`[ok] ${filename}: already in sync`)
      continue
    }

    changed += 1
    if (options.dryRun) {
      console.log(`[dry-run] ${filename}: would update local db file`)
      continue
    }

    if (local.exists && !options.noBackup) {
      backupDir ||= path.join(rootDir, ".db-backups", `vercel-pull-${timestamp()}`)
      await mkdir(backupDir, { recursive: true })
      await copyFile(filePath, path.join(backupDir, filename))
    }

    await writeFile(filePath, remote.normalized, "utf-8")
    console.log(`[pull] ${filename}: updated from production Blob`)
  }

  console.log(`[sync:data:pull] changed=${changed} skipped=${skipped} dryRun=${options.dryRun}`)
  if (backupDir) console.log(`[sync:data:pull] backup=${backupDir}`)
  return { changed, skipped }
}

async function main() {
  const options = parseArgs()
  await syncOnce(options)

  if (!options.watch) return

  console.log(`[sync:data:watch] watching every ${options.intervalMs / 1000}s`)
  setInterval(() => {
    syncOnce(options).catch((error) => {
      console.error(`[sync:data:watch] ${error.message}`)
    })
  }, options.intervalMs)
}

main().catch((error) => {
  console.error(`[sync:data:pull] ${error.message}`)
  process.exit(1)
})
