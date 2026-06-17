import { z } from "zod"
import {
  optionalTrimmedString,
  createListInputSchema,
  createSingleSuccessSchema,
  createListSuccessSchema,
  createDeleteSuccessSchema,
} from "../../contract/base.js"

const MUSIC_TYPE_VALUES = ["album", "single", "ep", "collab"]
const MUSIC_STATUS_VALUES = ["draft", "published"]

const optionalMusicType = optionalTrimmedString
  .transform((value) => value?.toLowerCase())
  .refine(
    (value) => value === undefined || MUSIC_TYPE_VALUES.includes(value),
    "Invalid music type"
  )

const optionalMusicStatus = optionalTrimmedString
  .transform((value) => value?.toLowerCase())
  .refine(
    (value) => value === undefined || MUSIC_STATUS_VALUES.includes(value),
    "Invalid music status"
  )

const optionalTracklist = z.array(z.string()).optional().transform((tracklist) => {
  if (!tracklist) return undefined
  return tracklist.map((track) => track.trim()).filter(Boolean)
})

const optionalStreamingLinks = z.record(z.string()).optional().transform((streamingLinks) => {
  if (!streamingLinks) return undefined

  return Object.fromEntries(
    Object.entries(streamingLinks)
      .map(([key, value]) => [key, value.trim()])
      .filter(([, value]) => value)
  )
})

const optionalBoolean = z.union([z.boolean(), z.string()]).optional().transform((value) => {
  if (value === undefined || value === null || value === "") return undefined
  if (typeof value === "boolean") return value

  const normalizedValue = value.trim().toLowerCase()
  if (["true", "1", "yes", "on"].includes(normalizedValue)) return true
  if (["false", "0", "no", "off"].includes(normalizedValue)) return false

  return undefined
})

export const MusicSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  type: z.enum(MUSIC_TYPE_VALUES).default("single"),
  releaseDate: z.string().nullable().default(null),
  coverArt: z.string().default(""),
  streamingLinks: z.record(z.string()).default({}),
  spotifyEmbed: z.string().default(""),
  tracklist: z.array(z.string()).default([]),
  description: z.string().default(""),
  featured: z.boolean().default(false),
  status: z.enum(MUSIC_STATUS_VALUES).default("draft"),
  createdAt: z.string().default(""),
  updatedAt: z.string().default(""),
}).strip()

export const CreateMusicInputSchema = z.object({
  title: z.string().trim().min(1, "title is required"),
  slug: optionalTrimmedString,
  type: optionalMusicType,
  releaseDate: optionalTrimmedString,
  coverArt: optionalTrimmedString,
  streamingLinks: optionalStreamingLinks,
  spotifyEmbed: optionalTrimmedString,
  tracklist: optionalTracklist,
  description: optionalTrimmedString,
  featured: optionalBoolean,
  status: optionalMusicStatus,
}).strip()

export const UpdateMusicInputSchema = z.object({
  id: z.string().trim().min(1, "id is required"),
  title: optionalTrimmedString,
  slug: optionalTrimmedString,
  type: optionalMusicType,
  releaseDate: optionalTrimmedString,
  coverArt: optionalTrimmedString,
  streamingLinks: optionalStreamingLinks,
  spotifyEmbed: optionalTrimmedString,
  tracklist: optionalTracklist,
  description: optionalTrimmedString,
  featured: optionalBoolean,
  status: optionalMusicStatus,
}).strip()

export const ListMusicInputSchema = createListInputSchema({
  status: optionalMusicStatus,
  type: optionalMusicType,
  featured: optionalBoolean,
})

export const LookupMusicInputSchema = z.object({
  id: z.string().trim().min(1, "id is required"),
}).strip()

export const MusicErrorCode = {
  NOT_FOUND: "MUSIC_NOT_FOUND",
  INVALID_INPUT: "INVALID_INPUT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const MusicErrorCodeSchema = z.enum([
  MusicErrorCode.NOT_FOUND,
  MusicErrorCode.INVALID_INPUT,
  MusicErrorCode.UNKNOWN_ERROR,
])

export const MusicListSuccessSchema = createListSuccessSchema(MusicSchema)
export const MusicSingleSuccessSchema = createSingleSuccessSchema(MusicSchema)
export const MusicDeleteSuccessSchema = createDeleteSuccessSchema()
export const MusicFailureSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: MusicErrorCodeSchema,
    message: z.string(),
    recoverable: z.boolean(),
  }),
})

export function createMusicFailure(code, message, recoverable = true) {
  return MusicFailureSchema.parse({
    success: false,
    error: { code, message, recoverable },
  })
}

export const MusicResultSchema = z.union([
  MusicListSuccessSchema,
  MusicSingleSuccessSchema,
  MusicDeleteSuccessSchema,
  MusicFailureSchema,
])

export const MusicListResultSchema = z.union([MusicListSuccessSchema, MusicFailureSchema])
export const MusicSingleResultSchema = z.union([MusicSingleSuccessSchema, MusicFailureSchema])
export const MusicDeleteResultSchema = z.union([MusicDeleteSuccessSchema, MusicFailureSchema])

/**
 * @typedef {Object} MusicSpec
 * @property {(input?: unknown) => Promise<z.infer<typeof MusicListResultSchema>>} list
 * @property {(input?: unknown) => Promise<z.infer<typeof MusicSingleResultSchema>>} get
 * @property {(input?: unknown) => Promise<z.infer<typeof MusicSingleResultSchema>>} create
 * @property {(input?: unknown) => Promise<z.infer<typeof MusicSingleResultSchema>>} update
 * @property {(input?: unknown) => Promise<z.infer<typeof MusicDeleteResultSchema>>} remove
 */
