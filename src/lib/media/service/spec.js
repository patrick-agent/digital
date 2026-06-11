import { z } from "zod"
import {
  optionalTrimmedString,
  createListInputSchema, createSingleSuccessSchema,
  createListSuccessSchema, createDeleteSuccessSchema,
  BaseFailureSchema, LookupInputSchema,
} from "../../contract/base.js"

export const MediaSchema = z.object({
  id: z.string(),
  url: z.string(),
  filename: z.string(),
  folder: z.string(),
  type: z.string(),
  mimeType: z.string(),
  size: z.number(),
  alt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateMediaInputSchema = z.object({
  url: optionalTrimmedString,
  filename: optionalTrimmedString,
  folder: optionalTrimmedString,
  type: optionalTrimmedString,
  mimeType: optionalTrimmedString,
  size: z.number().optional(),
  alt: optionalTrimmedString,
}).strip()

export const UpdateMediaInputSchema = z.object({
  id: z.string(),
  url: optionalTrimmedString,
  filename: optionalTrimmedString,
  folder: optionalTrimmedString,
  type: optionalTrimmedString,
  mimeType: optionalTrimmedString,
  size: z.number().optional(),
  alt: optionalTrimmedString,
}).strip()

export const ListMediaInputSchema = createListInputSchema({
  type: optionalTrimmedString,
})

export const LookupMediaInputSchema = LookupInputSchema

export const MediaErrorCode = {
  NOT_FOUND: "MEDIA_NOT_FOUND",
  INVALID_INPUT: "INVALID_INPUT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const MediaListSuccessSchema = createListSuccessSchema(MediaSchema)
export const MediaSingleSuccessSchema = createSingleSuccessSchema(MediaSchema)
export const MediaDeleteSuccessSchema = createDeleteSuccessSchema()
export const MediaFailureSchema = BaseFailureSchema

export const MediaResultSchema = z.union([
  MediaListSuccessSchema,
  MediaSingleSuccessSchema,
  MediaDeleteSuccessSchema,
  MediaFailureSchema,
])

export const MediaListResultSchema = z.union([MediaListSuccessSchema, MediaFailureSchema])
export const MediaSingleResultSchema = z.union([MediaSingleSuccessSchema, MediaFailureSchema])
export const MediaDeleteResultSchema = z.union([MediaDeleteSuccessSchema, MediaFailureSchema])
