import { readSubscribers, addSubscriber, unsubscribeSubscriber } from "../../db/newsletter.js"
import {
  AddSubscriberInputSchema, UnsubscribeInputSchema,
  ListSubscriberInputSchema, LookupSubscriberInputSchema,
  NewsletterErrorCode,
} from "./spec.js"
import { createFailure, safeCatch } from "../../contract/base.js"

export class NewsletterHandler {
  async list(input) {
    try {
      const filters = ListSubscriberInputSchema.parse(input || {})
      const { data, meta } = await readSubscribers(filters)
      return { success: true, data: { items: data, meta } }
    } catch (error) {
      return safeCatch(error, "Failed to list subscribers")
    }
  }

  async get(input) {
    try {
      const { id } = LookupSubscriberInputSchema.parse(input || {})
      if (!id) return createFailure(NewsletterErrorCode.INVALID_INPUT, "id is required", false)
      const { data } = await readSubscribers({})
      const subscriber = data.find((s) => s.id === id)
      if (!subscriber) return createFailure(NewsletterErrorCode.NOT_FOUND, `Subscriber not found: ${id}`, false)
      return { success: true, data: subscriber }
    } catch (error) {
      return safeCatch(error, "Failed to get subscriber")
    }
  }

  async add(input) {
    try {
      const data = AddSubscriberInputSchema.parse(input || {})
      const subscriber = await addSubscriber(data)
      if (!subscriber) return createFailure(NewsletterErrorCode.DUPLICATE, "Email already subscribed", false)
      return { success: true, data: subscriber }
    } catch (error) {
      return safeCatch(error, "Failed to add subscriber")
    }
  }

  async unsubscribe(input) {
    try {
      const { id } = UnsubscribeInputSchema.parse(input || {})
      if (!id) return createFailure(NewsletterErrorCode.INVALID_INPUT, "id is required", false)
      const subscriber = await unsubscribeSubscriber(id)
      if (!subscriber) return createFailure(NewsletterErrorCode.NOT_FOUND, `Subscriber not found: ${id}`, false)
      return { success: true, data: subscriber }
    } catch (error) {
      return safeCatch(error, "Failed to unsubscribe subscriber")
    }
  }
}
