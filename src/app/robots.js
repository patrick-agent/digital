import { siteMetadata } from "@/lib/seo"

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

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...aiAndSearchBots.map((bot) => ({ userAgent: bot, allow: "/" })),
    ],
    sitemap: [
      `${siteMetadata.siteUrl}/sitemap.xml`,
      `${siteMetadata.siteUrl}/post_sitemap.xml`,
    ],
  }
}
