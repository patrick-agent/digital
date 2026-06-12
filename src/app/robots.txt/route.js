import { siteMetadata } from "@/lib/seo"

export const revalidate = 300

export async function GET() {
  const lines = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /api/",
    "",
    `Host: ${siteMetadata.siteUrl}`,
    `Sitemap: ${siteMetadata.siteUrl}/sitemap.xml`,
    `Sitemap: ${siteMetadata.siteUrl}/post_sitemap.xml`,
  ]

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  })
}
