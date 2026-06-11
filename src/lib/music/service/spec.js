import { z } from "zod"
import {
  optionalTrimmedString, optionalPositiveInteger,
  createListInputSchema, createSingleSuccessSchema,
  createListSuccessSchema, createDeleteSuccessSchema,
  BaseFailureSchema, LookupInputSchema,
} from "../../contract/base.js"

export const MusicSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  type: z.string(),
  releaseDate: z.string().nullable(),
  coverArt: z.string(),
  streamingLinks: z.record(z.string()),
  spotifyEmbed: z.string(),
  tracklist: z.array(z.string()),
  description: z.string(),
  featured: z.boolean(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateMusicInputSchema = z.object({
  title: optionalTrimmedString,
  slug: optionalTrimmedString,
  type: optionalTrimmedString,
  releaseDate: optionalTrimmedString,
  coverArt: optionalTrimmedString,
  streamingLinks: z.record(z.string()).optional(),
  spotifyEmbed: optionalTrimmedString,
  tracklist: z.array(z.string()).optional(),
  description: optionalTrimmedString,
  featured: z.coerce.boolean().optional(),
  status: optionalTrimmedString,
}).strip()

export const UpdateMusicInputSchema = z.object({
  id: z.string(),
  title: optionalTrimmedString,
  slug: optionalTrimmedString,
  type: optionalTrimmedString,
  releaseDate: optionalTrimmedString,
  coverArt: optionalTrimmedString,
  streamingLinks: z.record(z.string()).optional(),
  spotifyEmbed: optionalTrimmedString,
  tracklist: z.array(z.string()).optional(),
  description: optionalTrimmedString,
  featured: z.coerce.boolean().optional(),
  status: optionalTrimmedString,
}).strip()

export const ListMusicInputSchema = createListInputSchema({
  type: optionalTrimmedString,
  featured: z.coerce.boolean().optional(),
})

export const LookupMusicInputSchema = LookupInputSchema

export const MusicErrorCode = {
  NOT_FOUND: "MUSIC_NOT_FOUND",
  INVALID_INPUT: "INVALID_INPUT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const MusicListSuccessSchema = createListSuccessSchema(MusicSchema)
export const MusicSingleSuccessSchema = createSingleSuccessSchema(MusicSchema)
export const MusicDeleteSuccessSchema = createDeleteSuccessSchema()
export const MusicFailureSchema = BaseFailureSchema

export const MusicResultSchema = z.union([
  MusicListSuccessSchema,
  MusicSingleSuccessSchema,
  MusicDeleteSuccessSchema,
  MusicFailureSchema,
])

export const MusicListResultSchema = z.union([MusicListSuccessSchema, MusicFailureSchema])
export const MusicSingleResultSchema = z.union([MusicSingleSuccessSchema, MusicFailureSchema])
export const MusicDeleteResultSchema = z.union([MusicDeleteSuccessSchema, MusicFailureSchema])
