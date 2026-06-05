import { siteMetadata } from "@/lib/seo"

export const revalidate = 300

const aiAndSearchBots = [
  "Googlebot",
  "Google-Extended",
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "CCBot",
  "PerplexityBot",
  "Bytespider",
  "meta-externalagent",
  "Amazonbot",
  "Applebot",
  "Applebot-Extended",
]

export async function GET() {
  const lines = [
    "User-agent: *",
    "Content-Signal: search=yes,ai-input=yes,ai-train=no",
    "Allow: /",
    "",
    ...aiAndSearchBots.flatMap((bot) => [
      `User-agent: ${bot}`,
      "Allow: /",
      "",
    ]),
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
