import { siteMetadata } from "@/lib/seo"

export const revalidate = 300

export async function GET() {
  const lines = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${siteMetadata.siteUrl}/sitemap.xml`,
  ]

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  })
}
