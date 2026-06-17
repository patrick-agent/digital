import {
  readMusic as listMusicInStore,
  readMusicItem as getMusicInStore,
  createMusic as createMusicInStore,
  updateMusic as updateMusicInStore,
  deleteMusic as deleteMusicInStore,
} from "../../db/music.js"
import {
  CreateMusicInputSchema,
  UpdateMusicInputSchema,
  ListMusicInputSchema,
  LookupMusicInputSchema,
  MusicErrorCode,
  MusicListResultSchema,
  MusicSingleResultSchema,
  MusicDeleteResultSchema,
  createMusicFailure,
} from "./spec.js"

const defaultMusicStore = {
  list: (filters) => listMusicInStore(filters),
  get: (id) => getMusicInStore(id),
  create: (data) => createMusicInStore(data),
  update: (id, data) => updateMusicInStore(id, data),
  remove: (id) => deleteMusicInStore(id),
}

function inputFailure(resultSchema, error, fallbackMessage) {
  const message = error?.issues?.map((issue) => issue.message).join("; ") || fallbackMessage
  return resultSchema.parse(
    createMusicFailure(MusicErrorCode.INVALID_INPUT, message, false)
  )
}

function unknownFailure(resultSchema, error, fallbackMessage) {
  return resultSchema.parse(
    createMusicFailure(
      MusicErrorCode.UNKNOWN_ERROR,
      error instanceof Error ? error.message : fallbackMessage,
      true
    )
  )
}

function notFoundFailure(resultSchema, id) {
  return resultSchema.parse(
    createMusicFailure(MusicErrorCode.NOT_FOUND, `Music not found: ${id}`, false)
  )
}

export class MusicHandler {
  constructor(store = defaultMusicStore) {
    this.store = store
  }

  async list(input) {
    const parsedInput = ListMusicInputSchema.safeParse(input || {})
    if (!parsedInput.success) {
      return inputFailure(MusicListResultSchema, parsedInput.error, "Invalid music filters.")
    }

    try {
      const { data, meta } = await this.store.list(parsedInput.data)
      return MusicListResultSchema.parse({ success: true, data: { items: data, meta } })
    } catch (error) {
      return unknownFailure(MusicListResultSchema, error, "Failed to list music")
    }
  }

  async get(input) {
    const parsedInput = LookupMusicInputSchema.safeParse(input || {})
    if (!parsedInput.success) {
      return inputFailure(MusicSingleResultSchema, parsedInput.error, "Invalid music id.")
    }

    try {
      const { id } = parsedInput.data
      const item = await this.store.get(id)
      if (!item) return notFoundFailure(MusicSingleResultSchema, id)
      return MusicSingleResultSchema.parse({ success: true, data: item })
    } catch (error) {
      return unknownFailure(MusicSingleResultSchema, error, "Failed to get music item")
    }
  }

  async create(input) {
    const parsedInput = CreateMusicInputSchema.safeParse(input || {})
    if (!parsedInput.success) {
      return inputFailure(MusicSingleResultSchema, parsedInput.error, "Invalid music payload.")
    }

    try {
      const item = await this.store.create(parsedInput.data)
      return MusicSingleResultSchema.parse({ success: true, data: item })
    } catch (error) {
      return unknownFailure(MusicSingleResultSchema, error, "Failed to create music item")
    }
  }

  async update(input) {
    const parsedInput = UpdateMusicInputSchema.safeParse(input || {})
    if (!parsedInput.success) {
      return inputFailure(MusicSingleResultSchema, parsedInput.error, "Invalid music payload.")
    }

    try {
      const { id, ...data } = parsedInput.data
      const item = await this.store.update(id, data)
      if (!item) return notFoundFailure(MusicSingleResultSchema, id)
      return MusicSingleResultSchema.parse({ success: true, data: item })
    } catch (error) {
      return unknownFailure(MusicSingleResultSchema, error, "Failed to update music item")
    }
  }

  async remove(input) {
    const parsedInput = LookupMusicInputSchema.safeParse(input || {})
    if (!parsedInput.success) {
      return inputFailure(MusicDeleteResultSchema, parsedInput.error, "Invalid music id.")
    }

    try {
      const { id } = parsedInput.data
      const deleted = await this.store.remove(id)
      if (!deleted) return notFoundFailure(MusicDeleteResultSchema, id)
      return MusicDeleteResultSchema.parse({ success: true, data: { deleted: true } })
    } catch (error) {
      return unknownFailure(MusicDeleteResultSchema, error, "Failed to delete music item")
    }
  }
}
