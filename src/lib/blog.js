import {
  listPublishedPosts,
  getPublishedPost,
  getRelatedPublishedPosts,
  getBlogCategories,
  getAllPublishedSlugs as getPublicAllSlugs,
  getAllBlogTags,
  getFeaturedPublishedPost,
  estimateReadTime,
} from "@/lib/blog/public-catalog"

export async function getAllPublishedPosts(options = {}) {
  const { page = 1, limit = 9, category, tag } = options
  const result = await listPublishedPosts({ category, tag, page, limit })
  if (!result.success) return { posts: [], meta: { page, limit, total: 0, totalPages: 0 } }
  return {
    posts: result.data.posts,
    meta: { ...result.data.meta, totalPages: Math.ceil(result.data.meta.total / limit) },
  }
}

export function getPostBySlug(category, slug) {
  return getPublishedPost({ slug, category }).then((result) => {
    if (!result.success) return null
    return result.data.post
  })
}

export function getPostBySlugOnly(slug) {
  return getPublishedPost({ slug }).then((result) => {
    if (!result.success) return null
    return result.data.post
  })
}

export async function getRelatedPosts(post, limit = 3) {
  const result = await getRelatedPublishedPosts({
    postId: post.id,
    category: post.category,
    tags: post.tags || [],
    limit,
  })
  if (!result.success) return []
  return result.data.posts
}

export async function getAllCategories() {
  return getBlogCategories()
}

export async function getAllTags() {
  return getAllBlogTags()
}

export async function getFeaturedPost() {
  return getFeaturedPublishedPost()
}

export async function getAllPublishedSlugs() {
  return getPublicAllSlugs()
}

export { estimateReadTime }
