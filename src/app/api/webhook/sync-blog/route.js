import { NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-auth"
import { createPost, updatePost, readPosts } from "@/lib/db"

const SHEET_STATUS_PUBLIC = "public"
const BLOG_PERSONA = "artist"

const COLUMN_MAP = {
  title: "title",
  slug: "slug",
  content: "content",
  excerpt: "excerpt",
  coverImage: "coverImage",
  tags: "tags",
  category: "category",
  status: "status",
  seoTitle: "seoTitle",
  seoDescription: "seoDescription",
  seoKeywords: "seoKeywords",
}

function parseTags(value) {
  if (!value) return []
  return value.split(",").map((t) => t.trim()).filter(Boolean)
}

function mapRowToPost(row) {
  const raw = {}
  for (const [field, col] of Object.entries(COLUMN_MAP)) {
    raw[field] = row[col] !== undefined ? String(row[col]).trim() : ""
  }

  const status = raw.status?.toLowerCase() === SHEET_STATUS_PUBLIC ? "published" : "draft"

  const post = {
    title: raw.title || "Untitled",
    content: raw.content || "",
    excerpt: raw.excerpt || "",
    coverImage: raw.coverImage || "",
    tags: parseTags(raw.tags),
    category: raw.category || "",
    status,
    persona: BLOG_PERSONA,
    seoTitle: raw.seoTitle || raw.title || "",
    seoDescription: raw.seoDescription || raw.excerpt || "",
    seoKeywords: parseTags(raw.seoKeywords),
  }

  if (raw.slug) post.slug = raw.slug
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

    const results = { created: 0, updated: 0, skipped: 0, errors: [] }
    const existingPosts = (await readPosts({ persona: BLOG_PERSONA })).data

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
          await updatePost(existing.id, { ...postData, slug: existing.slug })
          results.updated++
        } else {
          await createPost(postData)
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
