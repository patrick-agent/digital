import { readEvents, readEvent, createEvent, updateEvent, deleteEvent } from "../../db/events.js"
import {
  CreateEventInputSchema, UpdateEventInputSchema,
  ListEventInputSchema, LookupEventInputSchema,
  EventErrorCode,
} from "./spec.js"
import { createFailure, safeCatch } from "../../contract/base.js"

export class EventHandler {
  async list(input) {
    try {
      const filters = ListEventInputSchema.parse(input || {})
      const { data, meta } = await readEvents(filters)
      return { success: true, data: { items: data, meta } }
    } catch (error) {
      return safeCatch(error, "Failed to list events")
    }
  }

  async get(input) {
    try {
      const { id } = LookupEventInputSchema.parse(input || {})
      if (!id) return createFailure(EventErrorCode.INVALID_INPUT, "id is required", false)
      const event = await readEvent(id)
      if (!event) return createFailure(EventErrorCode.NOT_FOUND, `Event not found: ${id}`, false)
      return { success: true, data: event }
    } catch (error) {
      return safeCatch(error, "Failed to get event")
    }
  }

  async create(input) {
    try {
      const data = CreateEventInputSchema.parse(input || {})
      const event = await createEvent(data)
      return { success: true, data: event }
    } catch (error) {
      return safeCatch(error, "Failed to create event")
    }
  }

  async update(input) {
    try {
      const { id, ...data } = UpdateEventInputSchema.parse(input || {})
      if (!id) return createFailure(EventErrorCode.INVALID_INPUT, "id is required", false)
      const event = await updateEvent(id, data)
      if (!event) return createFailure(EventErrorCode.NOT_FOUND, `Event not found: ${id}`, false)
      return { success: true, data: event }
    } catch (error) {
      return safeCatch(error, "Failed to update event")
    }
  }

  async remove(input) {
    try {
      const { id } = LookupEventInputSchema.parse(input || {})
      if (!id) return createFailure(EventErrorCode.INVALID_INPUT, "id is required", false)
      const deleted = await deleteEvent(id)
      if (!deleted) return createFailure(EventErrorCode.NOT_FOUND, `Event not found: ${id}`, false)
      return { success: true, data: { deleted: true } }
    } catch (error) {
      return safeCatch(error, "Failed to delete event")
    }
  }
}
