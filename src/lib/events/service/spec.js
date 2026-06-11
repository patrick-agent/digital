import { z } from "zod"
import {
  optionalTrimmedString, optionalPositiveInteger,
  createListInputSchema, createSingleSuccessSchema,
  createListSuccessSchema, createDeleteSuccessSchema,
  BaseFailureSchema, LookupInputSchema,
} from "../../contract/base.js"

export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  eventDate: z.string().nullable(),
  location: z.string(),
  venue: z.string(),
  type: z.string(),
  ticketUrl: z.string(),
  image: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateEventInputSchema = z.object({
  title: optionalTrimmedString,
  slug: optionalTrimmedString,
  description: optionalTrimmedString,
  eventDate: optionalTrimmedString,
  location: optionalTrimmedString,
  venue: optionalTrimmedString,
  type: optionalTrimmedString,
  ticketUrl: optionalTrimmedString,
  image: optionalTrimmedString,
  status: optionalTrimmedString,
}).strip()

export const UpdateEventInputSchema = z.object({
  id: z.string(),
  title: optionalTrimmedString,
  slug: optionalTrimmedString,
  description: optionalTrimmedString,
  eventDate: optionalTrimmedString,
  location: optionalTrimmedString,
  venue: optionalTrimmedString,
  type: optionalTrimmedString,
  ticketUrl: optionalTrimmedString,
  image: optionalTrimmedString,
  status: optionalTrimmedString,
}).strip()

export const ListEventInputSchema = createListInputSchema({
  type: optionalTrimmedString,
})

export const LookupEventInputSchema = LookupInputSchema

export const EventErrorCode = {
  NOT_FOUND: "EVENT_NOT_FOUND",
  INVALID_INPUT: "INVALID_INPUT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const EventListSuccessSchema = createListSuccessSchema(EventSchema)
export const EventSingleSuccessSchema = createSingleSuccessSchema(EventSchema)
export const EventDeleteSuccessSchema = createDeleteSuccessSchema()
export const EventFailureSchema = BaseFailureSchema

export const EventResultSchema = z.union([
  EventListSuccessSchema,
  EventSingleSuccessSchema,
  EventDeleteSuccessSchema,
  EventFailureSchema,
])

export const EventListResultSchema = z.union([EventListSuccessSchema, EventFailureSchema])
export const EventSingleResultSchema = z.union([EventSingleSuccessSchema, EventFailureSchema])
export const EventDeleteResultSchema = z.union([EventDeleteSuccessSchema, EventFailureSchema])
