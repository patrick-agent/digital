import { revalidatePath } from "next/cache"
import { siteMetadata } from "@/lib/seo"
import { publishGoogleIndexingNotification } from "@/lib/google-indexing"
import { submitSitemap } from "@/lib/search-console/service"

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || siteMetadata.siteUrl
}

export function getBlogPostIndexingPath(post) {
  if (!post?.slug) return ""
  return `/blog/${post.slug}`
}

export function getBlogPostIndexingUrl(post) {
  const path = getBlogPostIndexingPath(post)
  if (!path) return ""
  return new URL(path, siteUrl()).toString()
}

export function revalidateBlogPost(post) {
  revalidatePath("/blog")
  revalidatePath("/sitemap.xml")

  const slugPath = getBlogPostIndexingPath(post)
  if (slugPath) revalidatePath(slugPath)
  if (post?.category) revalidatePath(`/blog/${post.category}`)
}

export async function notifyPublishedBlogPost(post) {
  if (!post || post.status !== "published") {
    return { success: false, skipped: true, reason: "not-published" }
  }

  revalidateBlogPost(post)

  const url = getBlogPostIndexingUrl(post)
  const results = []

  const indexingResult = await publishGoogleIndexingNotification(url)
  results.push({ layer: "indexing-api", ...indexingResult })

  if (!indexingResult.success && !indexingResult.skipped) {
    console.error("Google Indexing API failed:", indexingResult.error)
  }

  const sitemapUrl = `${siteUrl()}/sitemap.xml`
  const sitemapResult = await submitSitemap({ sitemapUrl })
  results.push({ layer: "search-console", ...sitemapResult })

  const overallSuccess = results.some((r) => r.success)
  const allSkipped = results.every((r) => r.skipped)

  return {
    success: overallSuccess,
    skipped: allSkipped,
    url,
    results,
  }
}
