import { z } from "zod"

export const optionalTrimmedString = z.string().optional().transform((value) => {
  const trimmed = value?.trim()
  return trimmed || undefined
})

export const optionalPositiveInteger = z.union([z.string(), z.number()]).optional().transform((value) => {
  if (value === undefined || value === null || value === "") return undefined
  const numericValue = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(numericValue) || numericValue < 1) return undefined
  return Math.min(Math.trunc(numericValue), 1000)
})

export const stringField = (defaultValue = "") => z.string().default(defaultValue)
export const numberField = (defaultValue = 0) => z.coerce.number().default(defaultValue)
export const booleanField = (defaultValue = false) => z.boolean().default(defaultValue)

export function createListInputSchema(extraFields = {}) {
  return z.object({
    status: optionalTrimmedString,
    search: optionalTrimmedString,
    page: optionalPositiveInteger,
    limit: optionalPositiveInteger,
    ...extraFields,
  }).strip()
}

export const BaseFailureSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    recoverable: z.boolean(),
  }),
})

export function createFailure(code, message, recoverable = true) {
  return BaseFailureSchema.parse({
    success: false,
    error: { code, message, recoverable },
  })
}

export function createSingleSuccessSchema(dataSchema) {
  return z.object({
    success: z.literal(true),
    data: dataSchema,
  })
}

export function createListSuccessSchema(itemSchema) {
  return z.object({
    success: z.literal(true),
    data: z.object({
      items: z.array(itemSchema),
      meta: z.object({
        page: z.number().int().nonnegative(),
        limit: z.number().int().nonnegative(),
        total: z.number().int().nonnegative(),
      }),
    }),
  })
}

export function createDeleteSuccessSchema() {
  return z.object({
    success: z.literal(true),
    data: z.object({
      deleted: z.literal(true),
    }),
  })
}

export const LookupInputSchema = z.object({
  id: optionalTrimmedString,
}).strip()

export function safeCatch(error, defaultMessage) {
  if (error instanceof z.ZodError) {
    return createFailure("INVALID_INPUT", error.errors.map(e => e.message).join("; "), false)
  }
  return createFailure(
    "UNKNOWN_ERROR",
    error instanceof Error ? error.message : defaultMessage,
    true
  )
}
