import test from "node:test"
import assert from "node:assert/strict"

import {
  CreateEventInputSchema,
  UpdateEventInputSchema,
} from "./spec.js"

test("CreateEventInputSchema parses canonical admin payload", () => {
  const result = CreateEventInputSchema.parse({
    eventName: "  Live in Saigon  ",
    slug: "  live-in-saigon  ",
    venue: "  The Observatory  ",
    city: "  Ho Chi Minh City  ",
    country: "  Vietnam  ",
    date: " 2026-08-15 ",
    ticketUrl: "  https://tickets.example.com/event  ",
    posterImage: "  https://cdn.example.com/poster.jpg  ",
    status: "UPCOMING",
    ignoredField: "ignore-me",
  })

  assert.deepEqual(result, {
    eventName: "Live in Saigon",
    slug: "live-in-saigon",
    venue: "The Observatory",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    date: "2026-08-15",
    ticketUrl: "https://tickets.example.com/event",
    posterImage: "https://cdn.example.com/poster.jpg",
    status: "upcoming",
  })
})

test("UpdateEventInputSchema rejects missing id", () => {
  const result = UpdateEventInputSchema.safeParse({ eventName: "Updated show" })

  assert.equal(result.success, false)
})

test("CreateEventInputSchema rejects blank eventName", () => {
  const result = CreateEventInputSchema.safeParse({ eventName: "   " })

  assert.equal(result.success, false)
})
