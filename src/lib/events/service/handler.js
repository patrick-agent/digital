import {
  readEvents as listEventsInStore,
  readEvent as getEventInStore,
  createEvent as createEventInStore,
  updateEvent as updateEventInStore,
  deleteEvent as deleteEventInStore,
} from "../../db/events.js"
import {
  CreateEventInputSchema,
  UpdateEventInputSchema,
  ListEventInputSchema,
  LookupEventInputSchema,
  EventErrorCode,
  EventListResultSchema,
  EventSingleResultSchema,
  EventDeleteResultSchema,
  createEventFailure,
} from "./spec.js"

const defaultEventStore = {
  list: (filters) => listEventsInStore(filters),
  get: (id) => getEventInStore(id),
  create: (data) => createEventInStore(data),
  update: (id, data) => updateEventInStore(id, data),
  remove: (id) => deleteEventInStore(id),
}

function inputFailure(resultSchema, error, fallbackMessage) {
  const message = error?.issues?.map((issue) => issue.message).join("; ") || fallbackMessage
  return resultSchema.parse(
    createEventFailure(EventErrorCode.INVALID_INPUT, message, false)
  )
}

function unknownFailure(resultSchema, error, fallbackMessage) {
  return resultSchema.parse(
    createEventFailure(
      EventErrorCode.UNKNOWN_ERROR,
      error instanceof Error ? error.message : fallbackMessage,
      true
    )
  )
}

function notFoundFailure(resultSchema, id) {
  return resultSchema.parse(
    createEventFailure(EventErrorCode.NOT_FOUND, `Event not found: ${id}`, false)
  )
}

export class EventHandler {
  constructor(store = defaultEventStore) {
    this.store = store
  }

  async list(input) {
    const parsedInput = ListEventInputSchema.safeParse(input || {})
    if (!parsedInput.success) {
      return inputFailure(EventListResultSchema, parsedInput.error, "Invalid event filters.")
    }

    try {
      const { data, meta } = await this.store.list(parsedInput.data)
      return EventListResultSchema.parse({ success: true, data: { items: data, meta } })
    } catch (error) {
      return unknownFailure(EventListResultSchema, error, "Failed to list events")
    }
  }

  async get(input) {
    const parsedInput = LookupEventInputSchema.safeParse(input || {})
    if (!parsedInput.success) {
      return inputFailure(EventSingleResultSchema, parsedInput.error, "Invalid event id.")
    }

    try {
      const { id } = parsedInput.data
      const event = await this.store.get(id)
      if (!event) return notFoundFailure(EventSingleResultSchema, id)
      return EventSingleResultSchema.parse({ success: true, data: event })
    } catch (error) {
      return unknownFailure(EventSingleResultSchema, error, "Failed to get event")
    }
  }

  async create(input) {
    const parsedInput = CreateEventInputSchema.safeParse(input || {})
    if (!parsedInput.success) {
      return inputFailure(EventSingleResultSchema, parsedInput.error, "Invalid event payload.")
    }

    try {
      const event = await this.store.create(parsedInput.data)
      return EventSingleResultSchema.parse({ success: true, data: event })
    } catch (error) {
      return unknownFailure(EventSingleResultSchema, error, "Failed to create event")
    }
  }

  async update(input) {
    const parsedInput = UpdateEventInputSchema.safeParse(input || {})
    if (!parsedInput.success) {
      return inputFailure(EventSingleResultSchema, parsedInput.error, "Invalid event payload.")
    }

    try {
      const { id, ...data } = parsedInput.data
      const event = await this.store.update(id, data)
      if (!event) return notFoundFailure(EventSingleResultSchema, id)
      return EventSingleResultSchema.parse({ success: true, data: event })
    } catch (error) {
      return unknownFailure(EventSingleResultSchema, error, "Failed to update event")
    }
  }

  async remove(input) {
    const parsedInput = LookupEventInputSchema.safeParse(input || {})
    if (!parsedInput.success) {
      return inputFailure(EventDeleteResultSchema, parsedInput.error, "Invalid event id.")
    }

    try {
      const { id } = parsedInput.data
      const deleted = await this.store.remove(id)
      if (!deleted) return notFoundFailure(EventDeleteResultSchema, id)
      return EventDeleteResultSchema.parse({ success: true, data: { deleted: true } })
    } catch (error) {
      return unknownFailure(EventDeleteResultSchema, error, "Failed to delete event")
    }
  }
}
