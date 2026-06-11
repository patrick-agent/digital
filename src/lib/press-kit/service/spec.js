import { z } from "zod"
import {
  optionalTrimmedString,
  createSingleSuccessSchema,
  BaseFailureSchema,
} from "../../contract/base.js"

export const PressReleaseSchema = z.object({
  title: z.string(),
  date: z.string(),
  url: z.string(),
})

export const PressKitSchema = z.object({
  bioShort: z.string(),
  bioLong: z.string(),
  headshots: z.array(z.string()),
  logos: z.array(z.string()),
  pressReleases: z.array(PressReleaseSchema),
  contactBookingEmail: z.string(),
  riderPdf: z.string(),
  techSpecPdf: z.string(),
})

export const UpdatePressKitInputSchema = z.object({
  bioShort: optionalTrimmedString,
  bioLong: optionalTrimmedString,
  headshots: z.array(z.string()).optional(),
  logos: z.array(z.string()).optional(),
  pressReleases: z.array(z.object({
    title: optionalTrimmedString,
    date: optionalTrimmedString,
    url: optionalTrimmedString,
  })).optional(),
  contactBookingEmail: optionalTrimmedString,
  riderPdf: optionalTrimmedString,
  techSpecPdf: optionalTrimmedString,
}).strip()

export const PressKitErrorCode = {
  INVALID_INPUT: "INVALID_INPUT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const PressKitSingleSuccessSchema = createSingleSuccessSchema(PressKitSchema)
export const PressKitFailureSchema = BaseFailureSchema

export const PressKitResultSchema = z.union([
  PressKitSingleSuccessSchema,
  PressKitFailureSchema,
])

export const PressKitSingleResultSchema = z.union([PressKitSingleSuccessSchema, PressKitFailureSchema])
