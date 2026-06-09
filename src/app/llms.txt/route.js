import { siteMetadata } from "@/lib/seo"

export const revalidate = 300

export async function GET() {
  const lines = [
    `# ${siteMetadata.title}`,
    "",
    `> ${siteMetadata.description}`,
    "",
    "Canonical site: https://tachy.io.vn",
    "Primary language: Vietnamese and English",
    "",
    "## Main sections",
    "- https://tachy.io.vn/blog",
    "- https://tachy.io.vn/bio-music",
    "- https://tachy.io.vn/shop",
    "- https://tachy.io.vn/digital",
    "- https://tachy.io.vn/digital/blog",
    "- https://tachy.io.vn/contact",
    "",
    "## Content focus",
    "- Independent artist profile and music releases",
    "- Music production, home studio, recording, and gear blog content",
    "- SEO, digital marketing, and creator tutorials",
    "- Product and equipment recommendation pages",
    "",
    "## Discovery",
    "- Sitemap: https://tachy.io.vn/sitemap.xml",
    "- Post sitemap: https://tachy.io.vn/post_sitemap.xml",
    "",
    "## Usage policy",
    "- Search indexing: allowed",
    "- AI retrieval / grounding / answer generation: allowed",
    "- AI training / fine-tuning: not allowed",
  ]

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  })
}
