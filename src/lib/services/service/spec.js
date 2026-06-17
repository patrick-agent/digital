import { z } from "zod"
import {
  optionalTrimmedString,
  createListInputSchema,
  createSingleSuccessSchema,
  createListSuccessSchema,
  createDeleteSuccessSchema,
} from "../../contract/base.js"

const SERVICE_STATUS_VALUES = ["active", "hidden"]

const optionalServiceStatus = optionalTrimmedString.refine(
  (value) => value === undefined || SERVICE_STATUS_VALUES.includes(value),
  "Invalid service status"
)

const optionalDisplayOrder = z.union([z.string(), z.number()]).optional().transform((value) => {
  if (value === undefined || value === null || value === "") return undefined

  const numericValue = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(numericValue) || numericValue < 0) return undefined

  return Math.min(Math.trunc(numericValue), 1000)
})

const optionalFeatureList = z.array(z.string()).optional().transform((features) => {
  if (!features) return undefined
  return features.map((feature) => feature.trim()).filter(Boolean)
})

export const ServiceSchema = z.object({
  id: z.string(),
  serviceName: z.string(),
  slug: z.string(),
  headline: z.string().default(""),
  description: z.string().default(""),
  features: z.array(z.string()).default([]),
  priceRange: z.string().default(""),
  ctaLabel: z.string().default("Contact"),
  ctaUrl: z.string().default(""),
  icon: z.string().default(""),
  status: z.enum(SERVICE_STATUS_VALUES).default("active"),
  displayOrder: z.number().int().nonnegative().default(0),
  createdAt: z.string().default(""),
  updatedAt: z.string().default(""),
}).strip()

export const CreateServiceInputSchema = z.object({
  serviceName: z.string().trim().min(1, "serviceName is required"),
  slug: optionalTrimmedString,
  headline: optionalTrimmedString,
  description: optionalTrimmedString,
  features: optionalFeatureList,
  priceRange: optionalTrimmedString,
  ctaLabel: optionalTrimmedString,
  ctaUrl: optionalTrimmedString,
  icon: optionalTrimmedString,
  status: optionalServiceStatus,
  displayOrder: optionalDisplayOrder,
}).strip()

export const UpdateServiceInputSchema = z.object({
  id: z.string().trim().min(1, "id is required"),
  serviceName: optionalTrimmedString,
  slug: optionalTrimmedString,
  headline: optionalTrimmedString,
  description: optionalTrimmedString,
  features: optionalFeatureList,
  priceRange: optionalTrimmedString,
  ctaLabel: optionalTrimmedString,
  ctaUrl: optionalTrimmedString,
  icon: optionalTrimmedString,
  status: optionalServiceStatus,
  displayOrder: optionalDisplayOrder,
}).strip()

export const ListServiceInputSchema = createListInputSchema({
  status: optionalServiceStatus,
})

export const LookupServiceInputSchema = z.object({
  id: z.string().trim().min(1, "id is required"),
}).strip()

export const ServiceErrorCode = {
  NOT_FOUND: "SERVICE_NOT_FOUND",
  INVALID_INPUT: "INVALID_INPUT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const ServiceErrorCodeSchema = z.enum([
  ServiceErrorCode.NOT_FOUND,
  ServiceErrorCode.INVALID_INPUT,
  ServiceErrorCode.UNKNOWN_ERROR,
])

export const ServiceListSuccessSchema = createListSuccessSchema(ServiceSchema)
export const ServiceSingleSuccessSchema = createSingleSuccessSchema(ServiceSchema)
export const ServiceDeleteSuccessSchema = createDeleteSuccessSchema()
export const ServiceFailureSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: ServiceErrorCodeSchema,
    message: z.string(),
    recoverable: z.boolean(),
  }),
})

export function createServiceFailure(code, message, recoverable = true) {
  return ServiceFailureSchema.parse({
    success: false,
    error: { code, message, recoverable },
  })
}

export const ServiceResultSchema = z.union([
  ServiceListSuccessSchema,
  ServiceSingleSuccessSchema,
  ServiceDeleteSuccessSchema,
  ServiceFailureSchema,
])

export const ServiceListResultSchema = z.union([ServiceListSuccessSchema, ServiceFailureSchema])
export const ServiceSingleResultSchema = z.union([ServiceSingleSuccessSchema, ServiceFailureSchema])
export const ServiceDeleteResultSchema = z.union([ServiceDeleteSuccessSchema, ServiceFailureSchema])

/**
 * @typedef {Object} ServiceSpec
 * @property {(input?: unknown) => Promise<z.infer<typeof ServiceListResultSchema>>} list
 * @property {(input?: unknown) => Promise<z.infer<typeof ServiceSingleResultSchema>>} get
 * @property {(input?: unknown) => Promise<z.infer<typeof ServiceSingleResultSchema>>} create
 * @property {(input?: unknown) => Promise<z.infer<typeof ServiceSingleResultSchema>>} update
 * @property {(input?: unknown) => Promise<z.infer<typeof ServiceDeleteResultSchema>>} remove
 */
