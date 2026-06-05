import { siteMetadata } from "@/lib/seo"

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: [
      `${siteMetadata.siteUrl}/sitemap.xml`,
      `${siteMetadata.siteUrl}/post_sitemap.xml`,
    ],
  }
}
