import {
  readGallery, readGalleryItem, createGalleryItem,
  bulkCreateGalleryItems, updateGalleryItem, deleteGalleryItem,
} from "../../db/gallery.js"
import {
  CreateGalleryInputSchema, UpdateGalleryInputSchema,
  BulkCreateGalleryInputSchema, ListGalleryInputSchema,
  LookupGalleryInputSchema, GalleryErrorCode,
} from "./spec.js"
import { createFailure, safeCatch } from "../../contract/base.js"

export class GalleryHandler {
  async list(input) {
    try {
      const filters = ListGalleryInputSchema.parse(input || {})
      const { data, meta } = await readGallery(filters)
      return { success: true, data: { items: data, meta } }
    } catch (error) {
      return safeCatch(error, "Failed to list gallery items")
    }
  }

  async get(input) {
    try {
      const { id } = LookupGalleryInputSchema.parse(input || {})
      if (!id) return createFailure(GalleryErrorCode.INVALID_INPUT, "id is required", false)
      const item = await readGalleryItem(id)
      if (!item) return createFailure(GalleryErrorCode.NOT_FOUND, `Gallery item not found: ${id}`, false)
      return { success: true, data: item }
    } catch (error) {
      return safeCatch(error, "Failed to get gallery item")
    }
  }

  async create(input) {
    try {
      const data = CreateGalleryInputSchema.parse(input || {})
      const item = await createGalleryItem(data)
      return { success: true, data: item }
    } catch (error) {
      return safeCatch(error, "Failed to create gallery item")
    }
  }

  async bulkCreate(input) {
    try {
      const itemsData = BulkCreateGalleryInputSchema.parse(input || [])
      if (!itemsData.length) {
        return createFailure(GalleryErrorCode.INVALID_INPUT, "items array is required", false)
      }
      const items = await bulkCreateGalleryItems(itemsData)
      return { success: true, data: { items } }
    } catch (error) {
      return safeCatch(error, "Failed to bulk create gallery items")
    }
  }

  async update(input) {
    try {
      const { id, ...data } = UpdateGalleryInputSchema.parse(input || {})
      if (!id) return createFailure(GalleryErrorCode.INVALID_INPUT, "id is required", false)
      const item = await updateGalleryItem(id, data)
      if (!item) return createFailure(GalleryErrorCode.NOT_FOUND, `Gallery item not found: ${id}`, false)
      return { success: true, data: item }
    } catch (error) {
      return safeCatch(error, "Failed to update gallery item")
    }
  }

  async remove(input) {
    try {
      const { id } = LookupGalleryInputSchema.parse(input || {})
      if (!id) return createFailure(GalleryErrorCode.INVALID_INPUT, "id is required", false)
      const deleted = await deleteGalleryItem(id)
      if (!deleted) return createFailure(GalleryErrorCode.NOT_FOUND, `Gallery item not found: ${id}`, false)
      return { success: true, data: { deleted: true } }
    } catch (error) {
      return safeCatch(error, "Failed to delete gallery item")
    }
  }
}
