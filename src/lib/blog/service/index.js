import { BlogHandler } from "./handler.js"

const handler = new BlogHandler()

export const listBlogPosts = (input) => handler.list(input)
export const getBlogPost = (input) => handler.get(input)
export const createBlogPost = (input) => handler.create(input)
export const updateBlogPost = (input) => handler.update(input)
export const deleteBlogPost = (input) => handler.remove(input)
export const duplicateBlogPost = (input) => handler.duplicate(input)

export { BlogHandler } from "./handler.js"
export * from "./spec.js"
