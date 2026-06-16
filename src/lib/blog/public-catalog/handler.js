import { readPost, readPosts } from "../../db.js"
import {
  PublicBlogListInputSchema,
  PublicBlogListResultSchema,
  PublicBlogListSuccessSchema,
  PublicBlogPostLookupInputSchema,
  PublicBlogPostResultSchema,
  PublicBlogPostSuccessSchema,
  PublicBlogRelatedInputSchema,
  PublicBlogRelatedResultSchema,
  PublicBlogRelatedSuccessSchema,
  PublicBlogPostSchema,
  createPublicBlogFailure,
} from "./spec.js"
import { filterCanonicalBlogPosts } from "../canonical-slugs.js"

const POSTS_PER_PAGE = 9

function normalizeSearchValue(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function getCategories(posts) {
  return [...new Set(posts.map((p) => p.category).filter(Boolean))].sort((a, b) => a.localeCompare(b, "vi"))
}

function matchesSearch(post, query) {
  if (!query) return true
  const haystack = normalizeSearchValue([
    post.title,
    post.excerpt,
    post.category,
    ...(post.tags || []),
  ].filter(Boolean).join(" "))
  return haystack.includes(query)
}

export class PublicBlogHandler {
  async list(input = {}) {
    const parsed = PublicBlogListInputSchema.safeParse(input)
    if (!parsed.success) {
      return PublicBlogListResultSchema.parse(
        createPublicBlogFailure("INVALID_INPUT", "Bộ lọc blog không hợp lệ.")
      )
    }

    try {
      const { category, tag, q, page = 1, limit = POSTS_PER_PAGE } = parsed.data
      const result = await readPosts({ status: "published", page: 1, limit: 9999 })
      const canonicalPosts = filterCanonicalBlogPosts(result.data)
      let posts = canonicalPosts

      if (category) {
        posts = posts.filter((p) => p.category === category)
      }

      if (tag) {
        posts = posts.filter((p) => p.tags?.includes(tag))
      }

      if (q) {
        const normalizedQuery = normalizeSearchValue(q)
        posts = posts.filter((p) => matchesSearch(p, normalizedQuery))
      }

      posts.sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))

      const total = posts.length
      const totalPages = Math.ceil(total / limit)
      const offset = (page - 1) * limit
      const data = posts.slice(offset, offset + limit)

      const categories = getCategories(canonicalPosts)

      return PublicBlogListResultSchema.parse(
        PublicBlogListSuccessSchema.parse({
          success: true,
          data: {
            posts: data,
            categories,
            meta: { page, limit, total, totalPages },
          },
        })
      )
    } catch (error) {
      return PublicBlogListResultSchema.parse(
        createPublicBlogFailure(
          "BLOG_READ_FAILED",
          error instanceof Error ? error.message : "Không thể tải bài viết.",
          true
        )
      )
    }
  }

  async get(input = {}) {
    const parsed = PublicBlogPostLookupInputSchema.safeParse(input)
    if (!parsed.success || !parsed.data.slug) {
      return PublicBlogPostResultSchema.parse(
        createPublicBlogFailure("INVALID_INPUT", "Thiếu slug bài viết.", false)
      )
    }

    try {
      const post = await readPost(parsed.data.slug)
      if (!post || post.status !== "published") {
        return PublicBlogPostResultSchema.parse(
          createPublicBlogFailure("POST_NOT_FOUND", "Không tìm thấy bài viết này.", false)
        )
      }

      if (parsed.data.category && post.category !== parsed.data.category) {
        return PublicBlogPostResultSchema.parse(
          createPublicBlogFailure("POST_NOT_FOUND", "Không tìm thấy bài viết này.", false)
        )
      }

      return PublicBlogPostResultSchema.parse(
        PublicBlogPostSuccessSchema.parse({
          success: true,
          data: { post: PublicBlogPostSchema.parse(post) },
        })
      )
    } catch (error) {
      return PublicBlogPostResultSchema.parse(
        createPublicBlogFailure(
          "BLOG_READ_FAILED",
          error instanceof Error ? error.message : "Không thể tải dữ liệu bài viết.",
          true
        )
      )
    }
  }

  async related(input = {}) {
    const parsed = PublicBlogRelatedInputSchema.safeParse(input)
    if (!parsed.success) {
      return PublicBlogRelatedResultSchema.parse(
        createPublicBlogFailure("INVALID_INPUT", "Dữ liệu bài viết liên quan không hợp lệ.")
      )
    }

    const { postId, category, tags, limit = 3 } = parsed.data

    if (!postId) {
      return PublicBlogRelatedResultSchema.parse(
        PublicBlogRelatedSuccessSchema.parse({
          success: true,
          data: { posts: [] },
        })
      )
    }

    try {
      const result = await readPosts({ status: "published", page: 1, limit: 9999 })
      const canonicalPosts = filterCanonicalBlogPosts(result.data)
      const candidates = canonicalPosts.filter((p) => p.id !== postId)

      const sameCategory = category
        ? candidates.filter((p) => p.category === category)
        : []

      const sharedTag = tags.length > 0
        ? candidates.filter((p) => Array.isArray(p.tags) && p.tags.some((t) => tags.includes(t)))
        : []

      const combined = [...sameCategory]
      for (const p of sharedTag) {
        if (!combined.find((c) => c.id === p.id)) {
          combined.push(p)
        }
        if (combined.length >= limit) break
      }

      for (const p of candidates) {
        if (!combined.find((c) => c.id === p.id)) {
          combined.push(p)
        }
        if (combined.length >= limit) break
      }

      return PublicBlogRelatedResultSchema.parse(
        PublicBlogRelatedSuccessSchema.parse({
          success: true,
          data: { posts: combined.slice(0, limit) },
        })
      )
    } catch (error) {
      return PublicBlogRelatedResultSchema.parse(
        createPublicBlogFailure(
          "BLOG_READ_FAILED",
          error instanceof Error ? error.message : "Không thể tải bài viết liên quan.",
          true
        )
      )
    }
  }

  async categories() {
    try {
      const result = await readPosts({ status: "published", page: 1, limit: 9999 })
      return getCategories(filterCanonicalBlogPosts(result.data))
    } catch {
      return []
    }
  }

  async featured() {
    try {
      const result = await readPosts({ status: "published", page: 1, limit: 9999 })
      const sorted = [...filterCanonicalBlogPosts(result.data)].sort(
        (a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
      )
      return sorted[0] || null
    } catch {
      return null
    }
  }

  async allSlugs() {
    try {
      const result = await readPosts({ status: "published", page: 1, limit: 9999 })
      return filterCanonicalBlogPosts(result.data).map((p) => ({
        category: p.category,
        slug: p.slug,
        updatedAt: p.updatedAt || p.publishedAt || new Date().toISOString(),
        publishedAt: p.publishedAt || p.createdAt,
      }))
    } catch {
      return []
    }
  }

  async allTags() {
    try {
      const result = await readPosts({ status: "published", page: 1, limit: 9999 })
      const tags = [...new Set(filterCanonicalBlogPosts(result.data).flatMap((p) => p.tags || []))].filter(Boolean)
      return tags.sort()
    } catch {
      return []
    }
  }

  estimateReadTime(content) {
    if (!content) return 1
    const text = content.replace(/<[^>]*>/g, "")
    const words = text.split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / 200))
  }
}
