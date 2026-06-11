import {
  readMusic, readMusicItem, createMusic, updateMusic, deleteMusic,
} from "../../db/music.js"
import {
  CreateMusicInputSchema, UpdateMusicInputSchema,
  ListMusicInputSchema, LookupMusicInputSchema,
  MusicErrorCode,
} from "./spec.js"
import { createFailure, safeCatch } from "../../contract/base.js"

export class MusicHandler {
  async list(input) {
    try {
      const filters = ListMusicInputSchema.parse(input || {})
      const { data, meta } = await readMusic(filters)
      return { success: true, data: { items: data, meta } }
    } catch (error) {
      return safeCatch(error, "Failed to list music")
    }
  }

  async get(input) {
    try {
      const { id } = LookupMusicInputSchema.parse(input || {})
      if (!id) return createFailure(MusicErrorCode.INVALID_INPUT, "id is required", false)
      const item = await readMusicItem(id)
      if (!item) return createFailure(MusicErrorCode.NOT_FOUND, `Music not found: ${id}`, false)
      return { success: true, data: item }
    } catch (error) {
      return safeCatch(error, "Failed to get music item")
    }
  }

  async create(input) {
    try {
      const data = CreateMusicInputSchema.parse(input || {})
      const item = await createMusic(data)
      return { success: true, data: item }
    } catch (error) {
      return safeCatch(error, "Failed to create music item")
    }
  }

  async update(input) {
    try {
      const { id, ...data } = UpdateMusicInputSchema.parse(input || {})
      if (!id) return createFailure(MusicErrorCode.INVALID_INPUT, "id is required", false)
      const item = await updateMusic(id, data)
      if (!item) return createFailure(MusicErrorCode.NOT_FOUND, `Music not found: ${id}`, false)
      return { success: true, data: item }
    } catch (error) {
      return safeCatch(error, "Failed to update music item")
    }
  }

  async remove(input) {
    try {
      const { id } = LookupMusicInputSchema.parse(input || {})
      if (!id) return createFailure(MusicErrorCode.INVALID_INPUT, "id is required", false)
      const deleted = await deleteMusic(id)
      if (!deleted) return createFailure(MusicErrorCode.NOT_FOUND, `Music not found: ${id}`, false)
      return { success: true, data: { deleted: true } }
    } catch (error) {
      return safeCatch(error, "Failed to delete music item")
    }
  }
}
