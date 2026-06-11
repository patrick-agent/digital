import { NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-auth"
import { createBlogPost, updateBlogPost, listBlogPosts } from "@/lib/blog/service"
import { notifyPublishedBlogPost } from "@/lib/blog-indexing"

const SHEET_STATUS_PUBLIC = "public"
const BLOG_PERSONA = "artist"

function parseTags(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)
  return String(value).split(",").map((t) => t.trim()).filter(Boolean)
}

function mapRowToPost(row) {
  console.log('--- mapRowToPost ---')
  console.log('Incoming row keys:', Object.keys(row))
  console.log('row.content length:', row.content?.length)
  console.log('row.content preview:', row.content?.slice(0, 300))
  console.log('Incoming row:', JSON.stringify(row, null, 2))

  const status = String(row.status || "").toLowerCase() === SHEET_STATUS_PUBLIC ? "published" : "draft"

  const title = String(row.title || "").trim() || "Untitled"
  const content = row.content || row.html || row.body || ""
  const excerpt = String(row.excerpt || row.description || "").trim()
  const coverImage = row.coverImage || row.featured_image_url || row.cover_image || ""
  const tags = parseTags(row.tags)
  const category = String(row.category || "").trim()
  const slug = row.slug ? String(row.slug).trim() : undefined
  const seoTitle = String(row.seoTitle || row.seo_title || title).trim()
  const seoDescription = String(row.seoDescription || row.seo_description || row.excerpt || "").trim()
  const seoKeywords = parseTags(row.seoKeywords || row.seo_keywords)

  console.log('Mapped content:', JSON.stringify(content?.slice(0, 200)))
  console.log('Mapped image:', coverImage)

  const post = {
    title,
    content,
    excerpt,
    coverImage,
    tags,
    category,
    status,
    persona: BLOG_PERSONA,
    seoTitle,
    seoDescription,
    seoKeywords,
  }

  if (slug) post.slug = slug
  if (status === "published") post.publishedAt = new Date().toISOString()

  return post
}

export async function POST(request) {
  const authError = validateApiKey(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const rows = body.rows

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing or empty 'rows' array in request body" },
        { status: 400 }
      )
    }

    const results = { created: 0, updated: 0, skipped: 0, indexed: 0, indexSkipped: 0, indexErrors: 0, errors: [] }
    const existingResult = await listBlogPosts({ persona: BLOG_PERSONA, limit: 9999 })
    const existingPosts = existingResult.success ? existingResult.data.items : []

    for (const row of rows) {
      try {
        const postData = mapRowToPost(row)

        if (postData.status !== "published") {
          results.skipped++
          continue
        }

        const slug = postData.slug || postData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
        const existing = existingPosts.find(
          (p) => p.slug === slug || p.title === postData.title
        )

        if (existing) {
          console.log('Final post content length:', postData.content?.length, '| slug:', slug)
          const result = await updateBlogPost({ id: existing.id, ...postData, slug: existing.slug })
          if (!result.success) throw new Error(result.error.message)
          const post = result.data
          const indexing = await notifyPublishedBlogPost(post)
          if (indexing.success) results.indexed++
          else if (indexing.skipped) results.indexSkipped++
          else results.indexErrors++
          results.updated++
        } else {
          const result = await createBlogPost(postData)
          if (!result.success) throw new Error(result.error.message)
          const post = result.data
          const indexing = await notifyPublishedBlogPost(post)
          if (indexing.success) results.indexed++
          else if (indexing.skipped) results.indexSkipped++
          else results.indexErrors++
          results.created++
        }
      } catch (err) {
        const title = row.title || "(unknown)"
        results.errors.push({ row: title, error: err.message })
      }
    }

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process webhook" },
      { status: 500 }
    )
  }
}
