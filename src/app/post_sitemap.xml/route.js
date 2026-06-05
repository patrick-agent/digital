import { getAllPublishedSlugs } from "@/lib/blog"
import { siteMetadata } from "@/lib/seo"

export const revalidate = 300

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const slugs = await getAllPublishedSlugs()

  const urls = slugs.map((post) => {
    const path = post.category
      ? `/blog/${post.category}/${post.slug}`
      : `/blog/${post.slug}`

    const lastModified = post.updatedAt || post.publishedAt || new Date().toISOString()

    return `  <url>\n    <loc>${escapeXml(`${siteMetadata.siteUrl}${path}`)}</loc>\n    <lastmod>${escapeXml(new Date(lastModified).toISOString())}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  })
}
