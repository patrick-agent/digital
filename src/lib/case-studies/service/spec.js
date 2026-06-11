import { z } from "zod"
import {
  optionalTrimmedString, optionalPositiveInteger,
  createListInputSchema, createSingleSuccessSchema,
  createListSuccessSchema, createDeleteSuccessSchema,
  BaseFailureSchema, LookupInputSchema,
} from "../../contract/base.js"

export const CaseStudySchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  client: z.string(),
  description: z.string(),
  content: z.string(),
  thumbnail: z.string(),
  tags: z.array(z.string()),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateCaseStudyInputSchema = z.object({
  title: optionalTrimmedString,
  slug: optionalTrimmedString,
  client: optionalTrimmedString,
  description: optionalTrimmedString,
  content: optionalTrimmedString,
  thumbnail: optionalTrimmedString,
  tags: z.array(z.string()).optional(),
  status: optionalTrimmedString,
}).strip()

export const UpdateCaseStudyInputSchema = z.object({
  id: z.string(),
  title: optionalTrimmedString,
  slug: optionalTrimmedString,
  client: optionalTrimmedString,
  description: optionalTrimmedString,
  content: optionalTrimmedString,
  thumbnail: optionalTrimmedString,
  tags: z.array(z.string()).optional(),
  status: optionalTrimmedString,
}).strip()

export const ListCaseStudyInputSchema = createListInputSchema({})

export const LookupCaseStudyInputSchema = LookupInputSchema

export const CaseStudyErrorCode = {
  NOT_FOUND: "CASE_STUDY_NOT_FOUND",
  INVALID_INPUT: "INVALID_INPUT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const CaseStudyListSuccessSchema = createListSuccessSchema(CaseStudySchema)
export const CaseStudySingleSuccessSchema = createSingleSuccessSchema(CaseStudySchema)
export const CaseStudyDeleteSuccessSchema = createDeleteSuccessSchema()
export const CaseStudyFailureSchema = BaseFailureSchema

export const CaseStudyResultSchema = z.union([
  CaseStudyListSuccessSchema,
  CaseStudySingleSuccessSchema,
  CaseStudyDeleteSuccessSchema,
  CaseStudyFailureSchema,
])

export const CaseStudyListResultSchema = z.union([CaseStudyListSuccessSchema, CaseStudyFailureSchema])
export const CaseStudySingleResultSchema = z.union([CaseStudySingleSuccessSchema, CaseStudyFailureSchema])
export const CaseStudyDeleteResultSchema = z.union([CaseStudyDeleteSuccessSchema, CaseStudyFailureSchema])
