import { z } from "zod"
import { BaseFailureSchema, createFailure } from "../../contract/base.js"

export const SitemapSubmitInputSchema = z.object({
  sitemapUrl: z.string().url(),
}).strip()

export const SubmitResultSuccessSchema = z.object({
  success: z.literal(true),
  data: z.object({
    submitted: z.literal(true),
    method: z.string(),
  }),
})

export const SubmitResultFailureSchema = BaseFailureSchema

export const SubmitResultSchema = z.union([
  SubmitResultSuccessSchema,
  SubmitResultFailureSchema,
])

export const SearchConsoleErrorCode = {
  MISSING_CREDENTIALS: "MISSING_CREDENTIALS",
  NOT_OWNER: "NOT_OWNER",
  API_ERROR: "API_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
}

export function createSearchConsoleFailure(code, message, recoverable = true) {
  return SubmitResultFailureSchema.parse(
    createFailure(code, message, recoverable)
  )
}
