import { z } from "zod"
import {
  optionalTrimmedString, optionalPositiveInteger,
  createListInputSchema, createSingleSuccessSchema,
  createListSuccessSchema, createDeleteSuccessSchema,
  BaseFailureSchema, LookupInputSchema,
} from "../../contract/base.js"

export const GallerySchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  image: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  mediaType: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateGalleryInputSchema = z.object({
  title: optionalTrimmedString,
  slug: optionalTrimmedString,
  description: optionalTrimmedString,
  image: optionalTrimmedString,
  category: optionalTrimmedString,
  tags: z.array(z.string()).optional(),
  mediaType: optionalTrimmedString,
  status: optionalTrimmedString,
}).strip()

export const BulkCreateGalleryInputSchema = z.array(CreateGalleryInputSchema)

export const UpdateGalleryInputSchema = z.object({
  id: z.string(),
  title: optionalTrimmedString,
  slug: optionalTrimmedString,
  description: optionalTrimmedString,
  image: optionalTrimmedString,
  category: optionalTrimmedString,
  tags: z.array(z.string()).optional(),
  mediaType: optionalTrimmedString,
  status: optionalTrimmedString,
}).strip()

export const ListGalleryInputSchema = createListInputSchema({
  category: optionalTrimmedString,
  mediaType: optionalTrimmedString,
})

export const LookupGalleryInputSchema = LookupInputSchema

export const GalleryErrorCode = {
  NOT_FOUND: "GALLERY_NOT_FOUND",
  INVALID_INPUT: "INVALID_INPUT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const GalleryListSuccessSchema = createListSuccessSchema(GallerySchema)
export const GallerySingleSuccessSchema = createSingleSuccessSchema(GallerySchema)
export const GalleryDeleteSuccessSchema = createDeleteSuccessSchema()
export const GalleryFailureSchema = BaseFailureSchema

export const GalleryResultSchema = z.union([
  GalleryListSuccessSchema,
  GallerySingleSuccessSchema,
  GalleryDeleteSuccessSchema,
  GalleryFailureSchema,
])

export const GalleryListResultSchema = z.union([GalleryListSuccessSchema, GalleryFailureSchema])
export const GallerySingleResultSchema = z.union([GallerySingleSuccessSchema, GalleryFailureSchema])
export const GalleryDeleteResultSchema = z.union([GalleryDeleteSuccessSchema, GalleryFailureSchema])
