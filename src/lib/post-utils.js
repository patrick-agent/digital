export function postUrl(post) {
  if (post?.category) return `/blog/${post.category}/${post.slug}`
  return `/blog/${post.slug}`
}

export function canonicalUrl(post) {
  if (post?.category) return `/blog/${post.category}/${post.slug}`
  return `/blog/${post.slug}`
}
