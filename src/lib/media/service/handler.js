import {
  readMedia, createMediaItem, updateMediaItem, deleteMediaItem,
} from "../../db/media.js"
import {
  CreateMediaInputSchema, UpdateMediaInputSchema,
  ListMediaInputSchema, LookupMediaInputSchema,
  MediaErrorCode,
} from "./spec.js"
import { createFailure, safeCatch } from "../../contract/base.js"

export class MediaHandler {
  async list(input) {
    try {
      const filters = ListMediaInputSchema.parse(input || {})
      const { data, meta } = await readMedia(filters)
      return { success: true, data: { items: data, meta } }
    } catch (error) {
      return safeCatch(error, "Failed to list media")
    }
  }

  async get(input) {
    try {
      const { id } = LookupMediaInputSchema.parse(input || {})
      if (!id) return createFailure(MediaErrorCode.INVALID_INPUT, "id is required", false)
      const { data } = await readMedia({ search: id })
      const item = data.find((m) => m.id === id)
      if (!item) return createFailure(MediaErrorCode.NOT_FOUND, `Media not found: ${id}`, false)
      return { success: true, data: item }
    } catch (error) {
      return safeCatch(error, "Failed to get media")
    }
  }

  async create(input) {
    try {
      const data = CreateMediaInputSchema.parse(input || {})
      const item = await createMediaItem(data)
      return { success: true, data: item }
    } catch (error) {
      return safeCatch(error, "Failed to create media")
    }
  }

  async update(input) {
    try {
      const { id, ...data } = UpdateMediaInputSchema.parse(input || {})
      if (!id) return createFailure(MediaErrorCode.INVALID_INPUT, "id is required", false)
      const item = await updateMediaItem(id, data)
      if (!item) return createFailure(MediaErrorCode.NOT_FOUND, `Media not found: ${id}`, false)
      return { success: true, data: item }
    } catch (error) {
      return safeCatch(error, "Failed to update media")
    }
  }

  async remove(input) {
    try {
      const { id } = LookupMediaInputSchema.parse(input || {})
      if (!id) return createFailure(MediaErrorCode.INVALID_INPUT, "id is required", false)
      const deleted = await deleteMediaItem(id)
      if (!deleted) return createFailure(MediaErrorCode.NOT_FOUND, `Media not found: ${id}`, false)
      return { success: true, data: { deleted: true } }
    } catch (error) {
      return safeCatch(error, "Failed to delete media")
    }
  }
}
