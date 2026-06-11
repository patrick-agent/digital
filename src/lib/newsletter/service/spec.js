import { z } from "zod"
import {
  optionalTrimmedString, optionalPositiveInteger,
  createListInputSchema, createSingleSuccessSchema,
  createListSuccessSchema, createDeleteSuccessSchema,
  BaseFailureSchema, LookupInputSchema,
} from "../../contract/base.js"

export const NewsletterSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  personaInterest: z.array(z.string()),
  subscribedAt: z.string(),
  status: z.string(),
  unsubscribedAt: z.string().nullable().optional(),
})

export const AddSubscriberInputSchema = z.object({
  email: z.string().min(1, "Email is required"),
  firstName: optionalTrimmedString,
  personaInterest: z.array(z.string()).optional(),
}).strip()

export const UnsubscribeInputSchema = z.object({
  id: z.string(),
}).strip()

export const ListSubscriberInputSchema = createListInputSchema({
  persona: optionalTrimmedString,
})

export const LookupSubscriberInputSchema = LookupInputSchema

export const NewsletterErrorCode = {
  NOT_FOUND: "SUBSCRIBER_NOT_FOUND",
  DUPLICATE: "SUBSCRIBER_DUPLICATE",
  INVALID_INPUT: "INVALID_INPUT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const NewsletterListSuccessSchema = createListSuccessSchema(NewsletterSchema)
export const NewsletterSingleSuccessSchema = createSingleSuccessSchema(NewsletterSchema)
export const NewsletterDeleteSuccessSchema = createDeleteSuccessSchema()
export const NewsletterFailureSchema = BaseFailureSchema

export const NewsletterResultSchema = z.union([
  NewsletterListSuccessSchema,
  NewsletterSingleSuccessSchema,
  NewsletterDeleteSuccessSchema,
  NewsletterFailureSchema,
])

export const NewsletterListResultSchema = z.union([NewsletterListSuccessSchema, NewsletterFailureSchema])
export const NewsletterSingleResultSchema = z.union([NewsletterSingleSuccessSchema, NewsletterFailureSchema])
export const NewsletterDeleteResultSchema = z.union([NewsletterDeleteSuccessSchema, NewsletterFailureSchema])
