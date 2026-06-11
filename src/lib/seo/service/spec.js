import { z } from "zod"
import {
  optionalTrimmedString,
  createListSuccessSchema, createSingleSuccessSchema,
  BaseFailureSchema,
} from "../../contract/base.js"

export const SEOEntrySchema = z.object({
  title: z.string(),
  description: z.string(),
  ogTitle: z.string(),
  ogDescription: z.string(),
  ogImage: z.string(),
  canonical: z.string(),
  noindex: z.boolean(),
  updatedAt: z.string(),
})

export const RouteSchema = z.object({
  route: z.string(),
  label: z.string(),
})

export const SEOSchema = z.object({
  pages: z.record(SEOEntrySchema),
})

export const UpdateSEOInputSchema = z.object({
  route: z.string(),
  data: z.object({
    title: optionalTrimmedString,
    description: optionalTrimmedString,
    ogTitle: optionalTrimmedString,
    ogDescription: optionalTrimmedString,
    ogImage: optionalTrimmedString,
    canonical: optionalTrimmedString,
    noindex: z.boolean().optional(),
  }).strip(),
}).strip()

export const SEOErrorCode = {
  NOT_FOUND: "SEO_NOT_FOUND",
  INVALID_INPUT: "INVALID_INPUT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const SEOListSuccessSchema = createListSuccessSchema(RouteSchema)
export const SEOSingleSuccessSchema = createSingleSuccessSchema(SEOSchema)
export const SEOEntrySuccessSchema = createSingleSuccessSchema(SEOEntrySchema)
export const SEOFailureSchema = BaseFailureSchema

export const SEOResultSchema = z.union([
  SEOListSuccessSchema,
  SEOSingleSuccessSchema,
  SEOEntrySuccessSchema,
  SEOFailureSchema,
])

export const SEOListResultSchema = z.union([SEOListSuccessSchema, SEOFailureSchema])
export const SEOSingleResultSchema = z.union([SEOSingleSuccessSchema, SEOFailureSchema])
export const SEOEntryResultSchema = z.union([SEOEntrySuccessSchema, SEOFailureSchema])
