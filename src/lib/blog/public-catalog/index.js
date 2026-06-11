import { PublicBlogHandler } from "./handler.js"

const blogHandler = new PublicBlogHandler()

export function listPublishedPosts(input) {
  return blogHandler.list(input)
}

export function getPublishedPost(input) {
  return blogHandler.get(input)
}

export function getRelatedPublishedPosts(input) {
  return blogHandler.related(input)
}

export function getBlogCategories() {
  return blogHandler.categories()
}

export function getFeaturedPublishedPost() {
  return blogHandler.featured()
}

export function getAllPublishedSlugs() {
  return blogHandler.allSlugs()
}

export function getAllBlogTags() {
  return blogHandler.allTags()
}

export function estimateReadTime(content) {
  return blogHandler.estimateReadTime(content)
}
