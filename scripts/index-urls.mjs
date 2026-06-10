const SITEMAP_URL = "https://tachy.io.vn/sitemap.xml"
const PING_URL = `https://www.google.com/ping?sitemap=${SITEMAP_URL}`
const DRY_RUN = process.argv.includes("--dry-run")

async function main() {
  if (DRY_RUN) {
    console.log(`[DRY-RUN] Would ping: ${PING_URL}`)
    return
  }

  console.log(`Pinging Google...`)
  console.log(`  URL: ${PING_URL}`)

  const res = await fetch(PING_URL)
  const body = await res.text().catch(() => "")
  console.log(`  Status: ${res.status} ${res.statusText}`)

  if (res.ok) {
    console.log(`\n✓ Google notified. Sitemap crawl will be scheduled.`)
  } else if (res.status === 404 && /deprecated/i.test(body || res.statusText)) {
    console.log(`\n• Google sitemap ping is deprecated. Rely on sitemap discovery and Search Console instead.`)
  } else {
    console.error(`\n✗ Failed to ping Google.`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
