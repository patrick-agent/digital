import {
  readSEOMetadata, updateSEOMetadata, getAllRoutes,
} from "../../db/seo.js"
import {
  UpdateSEOInputSchema,
  SEOErrorCode,
} from "./spec.js"
import { createFailure, safeCatch } from "../../contract/base.js"

export class SEOHandler {
  async list() {
    try {
      const items = await getAllRoutes()
      return { success: true, data: { items, meta: { page: 0, limit: 0, total: items.length } } }
    } catch (error) {
      return safeCatch(error, "Failed to list SEO routes")
    }
  }

  async get() {
    try {
      const data = await readSEOMetadata()
      return { success: true, data }
    } catch (error) {
      return safeCatch(error, "Failed to get SEO metadata")
    }
  }

  async update(input) {
    try {
      const { route, data } = UpdateSEOInputSchema.parse(input || {})
      if (!route) return createFailure(SEOErrorCode.INVALID_INPUT, "route is required", false)
      const result = await updateSEOMetadata(route, data)
      return { success: true, data: result }
    } catch (error) {
      return safeCatch(error, "Failed to update SEO metadata")
    }
  }

  async routes() {
    try {
      const items = await getAllRoutes()
      return { success: true, data: { items, meta: { page: 0, limit: 0, total: items.length } } }
    } catch (error) {
      return safeCatch(error, "Failed to list SEO routes")
    }
  }
}
