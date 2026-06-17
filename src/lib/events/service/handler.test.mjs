import test from "node:test"
import assert from "node:assert/strict"

import { EventHandler } from "./handler.js"

function createStore(overrides = {}) {
  return {
    list: async () => ({
      data: [
        {
          id: "evt-001",
          eventName: "Live in Saigon",
          slug: "live-in-saigon",
          venue: "The Observatory",
          city: "Ho Chi Minh City",
          country: "Vietnam",
          date: "2026-08-15",
          ticketUrl: "https://tickets.example.com/event",
          posterImage: "https://cdn.example.com/poster.jpg",
          status: "upcoming",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
      meta: { page: 1, limit: 50, total: 1 },
    }),
    get: async () => null,
    create: async (data) => ({
      id: "evt-new",
      eventName: data.eventName,
      slug: data.slug || "live-in-saigon",
      venue: data.venue || "",
      city: data.city || "",
      country: data.country || "",
      date: data.date || null,
      ticketUrl: data.ticketUrl || "",
      posterImage: data.posterImage || "",
      status: data.status || "upcoming",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    }),
    update: async () => null,
    remove: async () => false,
    ...overrides,
  }
}

test("EventHandler.list returns typed success result", async () => {
  const handler = new EventHandler(createStore())

  const result = await handler.list({ search: "saigon" })

  assert.equal(result.success, true)
  if (result.success) {
    assert.equal(result.data.items.length, 1)
    assert.equal(result.data.items[0].eventName, "Live in Saigon")
  }
})

test("EventHandler.create returns INVALID_INPUT for bad payload", async () => {
  const handler = new EventHandler(createStore())

  const result = await handler.create({ eventName: "" })

  assert.equal(result.success, false)
  if (!result.success) {
    assert.equal(result.error.code, "INVALID_INPUT")
    assert.equal(result.error.recoverable, false)
  }
})

test("EventHandler.get returns NOT_FOUND when store misses", async () => {
  const handler = new EventHandler(createStore({ get: async () => null }))

  const result = await handler.get({ id: "missing-id" })

  assert.equal(result.success, false)
  if (!result.success) {
    assert.equal(result.error.code, "EVENT_NOT_FOUND")
    assert.equal(result.error.recoverable, false)
  }
})

test("EventHandler.update maps unexpected store error to UNKNOWN_ERROR", async () => {
  const handler = new EventHandler(createStore({
    update: async () => {
      throw new Error("calendar unavailable")
    },
  }))

  const result = await handler.update({ id: "evt-001", eventName: "Updated Event" })

  assert.equal(result.success, false)
  if (!result.success) {
    assert.equal(result.error.code, "UNKNOWN_ERROR")
    assert.equal(result.error.message, "calendar unavailable")
    assert.equal(result.error.recoverable, true)
  }
})
