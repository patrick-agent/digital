import { readPosts, readPost } from "@/lib/db"

const POSTS_PER_PAGE = 9

export async function getAllPublishedPosts(options = {}) {
  const { page = 1, limit = POSTS_PER_PAGE, category, tag } = options

  const result = await readPosts({ status: "published", page: 1, limit: 9999 })
  let posts = result.data

  if (category) {
    posts = posts.filter((p) => p.category === category)
  }

  if (tag) {
    posts = posts.filter((p) => p.tags?.includes(tag))
  }

  posts.sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))

  const total = posts.length
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const data = posts.slice(offset, offset + limit)

  return { posts: data, meta: { page, limit, total, totalPages } }
}

export function getPostBySlug(category, slug) {
  return readPost(slug).then((post) => {
    if (!post || post.status !== "published") return null
    if (category && post.category !== category) return null
    return post
  })
}

export function getPostBySlugOnly(slug) {
  return readPost(slug).then((post) => {
    if (!post || post.status !== "published") return null
    return post
  })
}



export async function getRelatedPosts(post, limit = 3) {
  const result = await readPosts({ status: "published", page: 1, limit: 9999 })
  const candidates = result.data.filter((p) => p.id !== post.id)

  const sameCategory = candidates.filter((p) => p.category === post.category)
  const sharedTag = candidates.filter(
    (p) => p.tags?.some((t) => post.tags?.includes(t))
  )

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

  return combined.slice(0, limit)
}

export async function getAllCategories() {
  const result = await readPosts({ status: "published", page: 1, limit: 9999 })
  const cats = [...new Set(result.data.map((p) => p.category).filter(Boolean))]
  return cats.sort()
}

export async function getAllTags() {
  const result = await readPosts({ status: "published", page: 1, limit: 9999 })
  const tags = [...new Set(result.data.flatMap((p) => p.tags || []))].filter(Boolean)
  return tags.sort()
}

export async function getFeaturedPost() {
  const result = await readPosts({ status: "published", page: 1, limit: 9999 })
  const featured = result.data
    .filter((p) => p.tags?.includes("featured"))
    .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))
  return featured[0] || null
}

export async function getAllPublishedSlugs() {
  const result = await readPosts({ status: "published", page: 1, limit: 9999 })
  return result.data.map((p) => ({
    category: p.category,
    slug: p.slug,
    updatedAt: p.updatedAt || p.publishedAt || new Date().toISOString(),
    publishedAt: p.publishedAt || p.createdAt,
  }))
}

export function estimateReadTime(content) {
  if (!content) return 1
  const text = content.replace(/<[^>]*>/g, "")
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}
