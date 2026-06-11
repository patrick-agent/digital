import { z } from "zod"
import {
  optionalTrimmedString, optionalPositiveInteger,
  createListInputSchema, createSingleSuccessSchema,
  createListSuccessSchema, createDeleteSuccessSchema,
  BaseFailureSchema, LookupInputSchema,
} from "../../contract/base.js"

export const ServiceSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  icon: z.string(),
  price: z.number(),
  currency: z.string(),
  features: z.array(z.string()),
  active: z.boolean(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateServiceInputSchema = z.object({
  title: optionalTrimmedString,
  slug: optionalTrimmedString,
  description: optionalTrimmedString,
  icon: optionalTrimmedString,
  price: z.number().optional(),
  currency: optionalTrimmedString,
  features: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  status: optionalTrimmedString,
}).strip()

export const UpdateServiceInputSchema = z.object({
  id: z.string(),
  title: optionalTrimmedString,
  slug: optionalTrimmedString,
  description: optionalTrimmedString,
  icon: optionalTrimmedString,
  price: z.number().optional(),
  currency: optionalTrimmedString,
  features: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  status: optionalTrimmedString,
}).strip()

export const ListServiceInputSchema = createListInputSchema({
  active: z.boolean().optional(),
})

export const LookupServiceInputSchema = LookupInputSchema

export const ServiceErrorCode = {
  NOT_FOUND: "SERVICE_NOT_FOUND",
  INVALID_INPUT: "INVALID_INPUT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const ServiceListSuccessSchema = createListSuccessSchema(ServiceSchema)
export const ServiceSingleSuccessSchema = createSingleSuccessSchema(ServiceSchema)
export const ServiceDeleteSuccessSchema = createDeleteSuccessSchema()
export const ServiceFailureSchema = BaseFailureSchema

export const ServiceResultSchema = z.union([
  ServiceListSuccessSchema,
  ServiceSingleSuccessSchema,
  ServiceDeleteSuccessSchema,
  ServiceFailureSchema,
])

export const ServiceListResultSchema = z.union([ServiceListSuccessSchema, ServiceFailureSchema])
export const ServiceSingleResultSchema = z.union([ServiceSingleSuccessSchema, ServiceFailureSchema])
export const ServiceDeleteResultSchema = z.union([ServiceDeleteSuccessSchema, ServiceFailureSchema])
