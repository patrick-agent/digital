/**
 * Type definition for a blog post used throughout the studio‑3d project.
 * Fields mirror the JSON schema stored in db/blog.json.
 */
export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  coverImage: string
  tags: string[]
  category: string
  status: string
  publishedAt: string | null
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  createdAt: string
  updatedAt: string
}
