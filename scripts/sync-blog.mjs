import { google } from "googleapis"
import path from "path"
import { fileURLToPath, pathToFileURL } from "url"
import { existsSync } from "fs"
import { readFile } from "fs/promises"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DB_URL = pathToFileURL(path.join(__dirname, "..", "src", "lib", "db.js")).href

const { createPost, updatePost, readPost, readPosts } = await import(DB_URL)

const SHEET_STATUS_PUBLIC = "public"
const BLOG_PERSONA = "artist"

const DEFAULT_COLUMN_MAP = {
  title: "title",
  slug: "slug",
  content: "content",
  excerpt: "excerpt",
  coverImage: "coverImage",
  tags: "tags",
  category: "category",
  status: "status",
  seoTitle: "seoTitle",
  seoDescription: "seoDescription",
  seoKeywords: "seoKeywords",
}

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env")
  if (!existsSync(envPath)) return {}
  const content = readFile(envPath, "utf-8")
  return content.then((text) => {
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
  })
}

function parseTags(value) {
  if (!value) return []
  return value.split(",").map((t) => t.trim()).filter(Boolean)
}

function mapRowToPost(row, columnMap) {
  const raw = {}
  for (const [field, col] of Object.entries(columnMap)) {
    raw[field] = row[col] !== undefined ? String(row[col]).trim() : ""
  }

  const status = raw.status?.toLowerCase() === SHEET_STATUS_PUBLIC ? "published" : "draft"

  const post = {
    title: raw.title || "Untitled",
    content: raw.content || "",
    excerpt: raw.excerpt || "",
    coverImage: raw.coverImage || "",
    tags: parseTags(raw.tags),
    category: raw.category || "",
    status,
    persona: BLOG_PERSONA,
    seoTitle: raw.seoTitle || raw.title || "",
    seoDescription: raw.seoDescription || raw.excerpt || "",
    seoKeywords: parseTags(raw.seoKeywords),
  }

  if (raw.slug) post.slug = raw.slug
  if (status === "published") post.publishedAt = new Date().toISOString()

  return post
}

async function getSheetData({ spreadsheetId, range, credentials }) {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  })

  const sheets = google.sheets({ version: "v4", auth })
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })

  const rows = res.data.values
  if (!rows || rows.length < 2) {
    return []
  }

  const headers = rows[0]
  return rows.slice(1).map((row) => {
    const obj = {}
    headers.forEach((header, i) => {
      obj[header] = row[i] || ""
    })
    return obj
  })
}

async function getSheetDataFromRows(rows) {
  return rows
}

async function syncToBlog(sheetRows, columnMap, dryRun = false) {
  const results = { created: 0, updated: 0, skipped: 0, errors: [] }

  for (const row of sheetRows) {
    try {
      const postData = mapRowToPost(row, columnMap)

      if (postData.status !== "published") {
        results.skipped++
        continue
      }

      const existingPosts = (await readPosts({ persona: BLOG_PERSONA })).data
      const slug = postData.slug || postData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
      const existing = existingPosts.find(
        (p) => p.slug === slug || p.title === postData.title
      )

      if (existing) {
        if (dryRun) {
          console.log(`[DRY-RUN] Would update: "${postData.title}" (${existing.id})`)
        } else {
          await updatePost(existing.id, { ...postData, slug: existing.slug })
          console.log(`[UPDATE] "${postData.title}" (${existing.id})`)
          results.updated++
        }
      } else {
        if (dryRun) {
          console.log(`[DRY-RUN] Would create: "${postData.title}"`)
        } else {
          const created = await createPost(postData)
          console.log(`[CREATE] "${created.title}" (${created.id})`)
          results.created++
        }
      }
    } catch (err) {
      const title = row.title || "(unknown)"
      console.error(`[ERROR] Failed to sync row "${title}":`, err.message)
      results.errors.push({ row: title, error: err.message })
    }
  }

  return results
}

async function main() {
  const env = await loadEnv()

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || env.GOOGLE_SHEETS_SPREADSHEET_ID
  const range = process.env.GOOGLE_SHEETS_RANGE || env.GOOGLE_SHEETS_RANGE || "Blog!A:Z"
  const privateKey = (process.env.GOOGLE_SHEETS_PRIVATE_KEY || env.GOOGLE_SHEETS_PRIVATE_KEY || "").replace(/\\n/g, "\n")
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL || env.GOOGLE_SHEETS_CLIENT_EMAIL
  const dryRun = process.argv.includes("--dry-run")

  if (!spreadsheetId || !privateKey || !clientEmail) {
    console.error("Missing required environment variables:")
    console.error("  GOOGLE_SHEETS_SPREADSHEET_ID")
    console.error("  GOOGLE_SHEETS_PRIVATE_KEY")
    console.error("  GOOGLE_SHEETS_CLIENT_EMAIL")
    console.error("  GOOGLE_SHEETS_RANGE (optional, default: 'Blog!A:Z')")
    console.error("\nSet them in .env or pass as environment variables.")
    process.exit(1)
  }

  const credentials = {
    type: "service_account",
    private_key: privateKey,
    client_email: clientEmail,
  }

  console.log("Reading Google Sheet...")
  const sheetRows = await getSheetData({ spreadsheetId, range, credentials })
  console.log(`Found ${sheetRows.length} rows (excluding header)`)

  if (sheetRows.length === 0) {
    console.log("No data rows found. Exiting.")
    return
  }

  console.log("\nSyncing to blog...")
  const results = await syncToBlog(sheetRows, DEFAULT_COLUMN_MAP, dryRun)

  console.log("\n=== Sync Results ===")
  console.log(`  Created:  ${results.created}`)
  console.log(`  Updated:  ${results.updated}`)
  console.log(`  Skipped:  ${results.skipped}`)
  console.log(`  Errors:   ${results.errors.length}`)
  if (results.errors.length > 0) {
    console.log("\nErrors:")
    results.errors.forEach((e) => console.log(`  - ${e.row}: ${e.error}`))
  }
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
