import {
  readPosts, readPost, createPost, updatePost, deletePost, duplicatePost,
} from "../../db/blog.js"
import {
  CreateBlogInputSchema, UpdateBlogInputSchema,
  ListBlogInputSchema, LookupBlogInputSchema,
  BlogErrorCode,
} from "./spec.js"
import { createFailure, safeCatch } from "../../contract/base.js"

export class BlogHandler {
  async list(input) {
    try {
      const filters = ListBlogInputSchema.parse(input || {})
      const { data, meta } = await readPosts(filters)
      return { success: true, data: { items: data, meta } }
    } catch (error) {
      return safeCatch(error, "Failed to list posts")
    }
  }

  async get(input) {
    try {
      const { id } = LookupBlogInputSchema.parse(input || {})
      if (!id) return createFailure(BlogErrorCode.INVALID_INPUT, "id is required", false)
      const post = await readPost(id)
      if (!post) return createFailure(BlogErrorCode.NOT_FOUND, `Post not found: ${id}`, false)
      return { success: true, data: post }
    } catch (error) {
      return safeCatch(error, "Failed to get post")
    }
  }

  async create(input) {
    try {
      const data = CreateBlogInputSchema.parse(input || {})
      const post = await createPost(data)
      return { success: true, data: post }
    } catch (error) {
      return safeCatch(error, "Failed to create post")
    }
  }

  async update(input) {
    try {
      const { id, ...data } = UpdateBlogInputSchema.parse(input || {})
      if (!id) return createFailure(BlogErrorCode.INVALID_INPUT, "id is required", false)
      const post = await updatePost(id, data)
      if (!post) return createFailure(BlogErrorCode.NOT_FOUND, `Post not found: ${id}`, false)
      return { success: true, data: post }
    } catch (error) {
      return safeCatch(error, "Failed to update post")
    }
  }

  async remove(input) {
    try {
      const { id } = LookupBlogInputSchema.parse(input || {})
      if (!id) return createFailure(BlogErrorCode.INVALID_INPUT, "id is required", false)
      const deleted = await deletePost(id)
      if (!deleted) return createFailure(BlogErrorCode.NOT_FOUND, `Post not found: ${id}`, false)
      return { success: true, data: { deleted: true } }
    } catch (error) {
      return safeCatch(error, "Failed to delete post")
    }
  }

  async duplicate(input) {
    try {
      const { id } = LookupBlogInputSchema.parse(input || {})
      if (!id) return createFailure(BlogErrorCode.INVALID_INPUT, "id is required", false)
      const post = await duplicatePost(id)
      if (!post) return createFailure(BlogErrorCode.NOT_FOUND, `Post not found: ${id}`, false)
      return { success: true, data: post }
    } catch (error) {
      return safeCatch(error, "Failed to duplicate post")
    }
  }
}
