import { connection } from "next/server"
import { getAllPublishedSlugs } from "@/lib/blog"
import { getAllRoutes } from "@/lib/db"
import { siteMetadata } from "@/lib/seo"
import { canonicalUrl } from "@/lib/post-utils"
import { readMusic } from "@/lib/db"
import { readProducts } from "@/lib/db"
import { getAllPosts } from "@/components/another-me/digital-blog/blog-posts"

const DOMAIN = siteMetadata.siteUrl

const staticPages = [
  { route: "/", priority: 1.0, frequency: "monthly" },
  { route: "/about", priority: 0.8, frequency: "monthly" },
  { route: "/contact", priority: 0.6, frequency: "yearly" },
  { route: "/privacy", priority: 0.3, frequency: "yearly" },
  { route: "/terms", priority: 0.3, frequency: "yearly" },
  { route: "/blog", priority: 0.9, frequency: "daily" },
  { route: "/bio-music", priority: 0.8, frequency: "weekly" },
  { route: "/shop", priority: 0.7, frequency: "weekly" },
  { route: "/digital", priority: 0.7, frequency: "weekly" },
  { route: "/digital/blog", priority: 0.6, frequency: "weekly" },
]

export default async function sitemap() {
  // Metadata routes are cached by default in Next 16, so force request-time
  // generation to keep sitemap.xml aligned with the current Blob-backed DB.
  await connection()

  const slugs = await getAllPublishedSlugs()

  const postUrls = slugs.map((p) => {
    return {
      url: `${DOMAIN}${canonicalUrl(p)}`,
      lastModified: p.updatedAt || p.publishedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }
  })

  let musicUrls = []
  try {
    const music = (await readMusic()).data || []
    musicUrls = music
      .filter((m) => m.status === "published" || !m.status)
      .map((m) => ({
        url: `${DOMAIN}/bio-music/${m.slug}`,
        lastModified: m.updatedAt || m.publishedAt || new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      }))
  } catch {}

  let productUrls = []
  try {
    const products = (await readProducts()).data || []
    productUrls = products
      .filter((p) => p.status === "published" || !p.status)
      .map((p) => ({
        url: `${DOMAIN}/shop/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      }))
  } catch {}

  const digitalPosts = getAllPosts().map((p) => ({
    url: `${DOMAIN}/digital/blog/${p.slug}`,
    lastModified: new Date(p.date).toISOString(),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  const routes = await getAllRoutes()

  const routeUrls = routes
    .filter((r) => {
      if (r.route === "/" || r.route === "/blog") return false
      if (r.route.startsWith("/digital/")) return false
      if (r.route.startsWith("/admin")) return false
      return true
    })
    .map((r) => ({
      url: `${DOMAIN}${r.route}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    }))

  const staticUrls = staticPages.map((p) => ({
    url: `${DOMAIN}${p.route}`,
    lastModified: new Date(),
    changeFrequency: p.frequency,
    priority: p.priority,
  }))

  const all = [
    ...staticUrls,
    ...routeUrls,
    ...postUrls,
    ...musicUrls,
    ...productUrls,
    ...digitalPosts,
  ]

  const seen = new Set()
  return all.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
