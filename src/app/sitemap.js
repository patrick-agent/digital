import { getAllPublishedSlugs, getAllCategories } from "@/lib/blog"
import { siteMetadata } from "@/lib/seo"

const DOMAIN = siteMetadata.siteUrl

export default async function sitemap() {
  const slugs = await getAllPublishedSlugs()
  const categories = await getAllCategories()

  const postUrls = slugs.map((p) => ({
    url: `${DOMAIN}/blog/${p.category}/${p.slug}`,
    lastModified: p.updatedAt || p.publishedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const categoryUrls = categories.map((cat) => ({
    url: `${DOMAIN}/blog/${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.6,
  }))

  return [
    {
      url: DOMAIN,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${DOMAIN}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categoryUrls,
    ...postUrls,
  ]
}
