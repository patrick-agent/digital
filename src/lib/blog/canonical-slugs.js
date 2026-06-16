export const BLOG_SLUG_REDIRECTS = {
  "top-10-vst-plugin-mien-phi-2026": "top-vst-mien-phi-tot-nhat",
  "top-vst-mien-phi-tot-nhat-cho-producer-phan-1": "top-vst-mien-phi-tot-nhat",
  "top-vst-mien-phi-tot-nhat-cho-producer-phan-2": "top-vst-mien-phi-tot-nhat",
  "top-vst-mien-phi-chat-luong-thay-the-vst-tra-phi": "top-vst-mien-phi-tot-nhat",
  "vst-mien-phi-thay-the-vst-noi-tieng": "top-vst-mien-phi-tot-nhat",
}

export function getRedirectedBlogSlug(slug) {
  if (!slug) return null
  return BLOG_SLUG_REDIRECTS[slug] || null
}

export function isRedirectedBlogSlug(slug) {
  return Boolean(getRedirectedBlogSlug(slug))
}

export function filterCanonicalBlogPosts(posts) {
  return posts.filter((post) => !isRedirectedBlogSlug(post.slug))
}
