import { z } from "zod"
import {
  optionalTrimmedString,
  createListInputSchema,
  createSingleSuccessSchema,
  createListSuccessSchema,
  createDeleteSuccessSchema,
} from "../../contract/base.js"

const EVENT_STATUS_VALUES = ["upcoming", "past", "cancelled"]

const optionalEventStatus = optionalTrimmedString
  .transform((value) => value?.toLowerCase())
  .refine(
    (value) => value === undefined || EVENT_STATUS_VALUES.includes(value),
    "Invalid event status"
  )

export const EventSchema = z.object({
  id: z.string(),
  eventName: z.string(),
  slug: z.string(),
  venue: z.string().default(""),
  city: z.string().default(""),
  country: z.string().default(""),
  date: z.string().nullable().default(null),
  ticketUrl: z.string().default(""),
  posterImage: z.string().default(""),
  status: z.enum(EVENT_STATUS_VALUES).default("upcoming"),
  createdAt: z.string().default(""),
  updatedAt: z.string().default(""),
}).strip()

export const CreateEventInputSchema = z.object({
  eventName: z.string().trim().min(1, "eventName is required"),
  slug: optionalTrimmedString,
  venue: optionalTrimmedString,
  city: optionalTrimmedString,
  country: optionalTrimmedString,
  date: optionalTrimmedString,
  ticketUrl: optionalTrimmedString,
  posterImage: optionalTrimmedString,
  status: optionalEventStatus,
}).strip()

export const UpdateEventInputSchema = z.object({
  id: z.string().trim().min(1, "id is required"),
  eventName: optionalTrimmedString,
  slug: optionalTrimmedString,
  venue: optionalTrimmedString,
  city: optionalTrimmedString,
  country: optionalTrimmedString,
  date: optionalTrimmedString,
  ticketUrl: optionalTrimmedString,
  posterImage: optionalTrimmedString,
  status: optionalEventStatus,
}).strip()

export const ListEventInputSchema = createListInputSchema({
  status: optionalEventStatus,
})

export const LookupEventInputSchema = z.object({
  id: z.string().trim().min(1, "id is required"),
}).strip()

export const EventErrorCode = {
  NOT_FOUND: "EVENT_NOT_FOUND",
  INVALID_INPUT: "INVALID_INPUT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const EventErrorCodeSchema = z.enum([
  EventErrorCode.NOT_FOUND,
  EventErrorCode.INVALID_INPUT,
  EventErrorCode.UNKNOWN_ERROR,
])

export const EventListSuccessSchema = createListSuccessSchema(EventSchema)
export const EventSingleSuccessSchema = createSingleSuccessSchema(EventSchema)
export const EventDeleteSuccessSchema = createDeleteSuccessSchema()
export const EventFailureSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: EventErrorCodeSchema,
    message: z.string(),
    recoverable: z.boolean(),
  }),
})

export function createEventFailure(code, message, recoverable = true) {
  return EventFailureSchema.parse({
    success: false,
    error: { code, message, recoverable },
  })
}

export const EventResultSchema = z.union([
  EventListSuccessSchema,
  EventSingleSuccessSchema,
  EventDeleteSuccessSchema,
  EventFailureSchema,
])

export const EventListResultSchema = z.union([EventListSuccessSchema, EventFailureSchema])
export const EventSingleResultSchema = z.union([EventSingleSuccessSchema, EventFailureSchema])
export const EventDeleteResultSchema = z.union([EventDeleteSuccessSchema, EventFailureSchema])

/**
 * @typedef {Object} EventSpec
 * @property {(input?: unknown) => Promise<z.infer<typeof EventListResultSchema>>} list
 * @property {(input?: unknown) => Promise<z.infer<typeof EventSingleResultSchema>>} get
 * @property {(input?: unknown) => Promise<z.infer<typeof EventSingleResultSchema>>} create
 * @property {(input?: unknown) => Promise<z.infer<typeof EventSingleResultSchema>>} update
 * @property {(input?: unknown) => Promise<z.infer<typeof EventDeleteResultSchema>>} remove
 */
