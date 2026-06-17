import test from "node:test"
import assert from "node:assert/strict"

import { ServiceHandler } from "./handler.js"

function createStore(overrides = {}) {
  return {
    list: async () => ({
      data: [
        {
          id: "svc-001",
          serviceName: "Music Production",
          slug: "music-production",
          headline: "From demo to master",
          description: "Full-service production",
          features: ["Mixing"],
          priceRange: "$500 - $2000",
          ctaLabel: "Book now",
          ctaUrl: "/contact",
          icon: "Music",
          status: "active",
          displayOrder: 0,
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
      meta: { page: 1, limit: 50, total: 1 },
    }),
    get: async () => null,
    create: async (data) => ({
      id: "svc-new",
      serviceName: data.serviceName,
      slug: data.slug || "new-service",
      headline: data.headline || "",
      description: data.description || "",
      features: data.features || [],
      priceRange: data.priceRange || "",
      ctaLabel: data.ctaLabel || "Contact",
      ctaUrl: data.ctaUrl || "",
      icon: data.icon || "",
      status: data.status || "active",
      displayOrder: data.displayOrder ?? 0,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    }),
    update: async () => null,
    remove: async () => false,
    ...overrides,
  }
}

test("ServiceHandler.list returns typed success result", async () => {
  const handler = new ServiceHandler(createStore())

  const result = await handler.list({ search: "music" })

  assert.equal(result.success, true)
  if (result.success) {
    assert.equal(result.data.items.length, 1)
    assert.equal(result.data.items[0].serviceName, "Music Production")
  }
})

test("ServiceHandler.create returns INVALID_INPUT for bad payload", async () => {
  const handler = new ServiceHandler(createStore())

  const result = await handler.create({ serviceName: "" })

  assert.equal(result.success, false)
  if (!result.success) {
    assert.equal(result.error.code, "INVALID_INPUT")
    assert.equal(result.error.recoverable, false)
  }
})

test("ServiceHandler.get returns NOT_FOUND when store misses", async () => {
  const handler = new ServiceHandler(createStore({ get: async () => null }))

  const result = await handler.get({ id: "missing-id" })

  assert.equal(result.success, false)
  if (!result.success) {
    assert.equal(result.error.code, "SERVICE_NOT_FOUND")
    assert.equal(result.error.recoverable, false)
  }
})

test("ServiceHandler.update maps unexpected store error to UNKNOWN_ERROR", async () => {
  const handler = new ServiceHandler(createStore({
    update: async () => {
      throw new Error("disk unavailable")
    },
  }))

  const result = await handler.update({ id: "svc-001", serviceName: "Updated Service" })

  assert.equal(result.success, false)
  if (!result.success) {
    assert.equal(result.error.code, "UNKNOWN_ERROR")
    assert.equal(result.error.message, "disk unavailable")
    assert.equal(result.error.recoverable, true)
  }
})
