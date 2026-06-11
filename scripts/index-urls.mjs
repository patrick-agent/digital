import { google } from "googleapis"
import { URL } from "url"

const SITEMAP_URL = "https://tachy.io.vn/sitemap.xml"
const PING_URL = `https://www.google.com/ping?sitemap=${SITEMAP_URL}`
const DRY_RUN = process.argv.includes("--dry-run")

function getAuth() {
  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL || ""
  const privateKey = (process.env.GOOGLE_INDEXING_PRIVATE_KEY || "").replace(/\\n/g, "\n")
  if (!clientEmail || !privateKey) return null
  return new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/webmasters"],
  })
}

async function submitViaSearchConsole() {
  const auth = getAuth()
  if (!auth) {
    console.log("  No service account credentials. Skipping Search Console API.")
    return false
  }

  try {
    const webmasters = google.webmasters({ version: "v3", auth })
    const parsedUrl = new URL(SITEMAP_URL)
    const site = `${parsedUrl.protocol}//${parsedUrl.hostname}`
    const feedpath = parsedUrl.pathname + parsedUrl.search

    await webmasters.sitemaps.submit({
      siteUrl: site,
      feedpath: feedpath,
    })

    console.log(`  ✓ Search Console: sitemap submitted for ${site}`)
    return true
  } catch (err) {
    const message = err?.response?.data?.error?.message || err.message || "Unknown error"
    console.log(`  ✗ Search Console failed: ${message}`)
    return false
  }
}

async function pingGoogle() {
  console.log(`Pinging Google...`)
  console.log(`  URL: ${PING_URL}`)

  const res = await fetch(PING_URL)
  const body = await res.text().catch(() => "")
  console.log(`  Ping status: ${res.status} ${res.statusText}`)

  if (res.ok) {
    console.log(`\n✓ Google notified via ping.`)
    return true
  }
  if (res.status === 404 && /deprecated/i.test(body || res.statusText)) {
    console.log(`\n• Google sitemap ping is deprecated.`)
    return true
  }
  return false
}

async function main() {
  if (DRY_RUN) {
    console.log(`[DRY-RUN] Would ping: ${PING_URL}`)
    console.log(`[DRY-RUN] Would submit sitemap via Search Console API`)
    return
  }

  console.log(`=== Index URLs ===`)
  console.log(`Sitemap: ${SITEMAP_URL}`)

  const scOk = await submitViaSearchConsole()
  const pingOk = await pingGoogle()

  if (!scOk && !pingOk) {
    console.error(`\n✗ All indexing methods failed.`)
    process.exit(1)
  }

  if (scOk || pingOk) {
    console.log(`\n✓ Indexing complete.`)
  }
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
