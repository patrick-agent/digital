import { revalidatePath } from "next/cache"
import { siteMetadata } from "@/lib/seo"
import { publishGoogleIndexingNotification } from "@/lib/google-indexing"

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
  const result = await publishGoogleIndexingNotification(url)

  if (!result.success && !result.skipped) {
    console.error("Google Indexing API failed:", result.error)
  }

  return result
}
