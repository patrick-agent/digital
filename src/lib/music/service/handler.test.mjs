import test from "node:test"
import assert from "node:assert/strict"

import { MusicHandler } from "./handler.js"

function createStore(overrides = {}) {
  return {
    list: async () => ({
      data: [
        {
          id: "rel-001",
          title: "TSUNAMI",
          slug: "tsunami",
          type: "single",
          releaseDate: "2026-11-02",
          coverArt: "/images/releases/tsunami.webp",
          streamingLinks: { spotify: "https://open.spotify.com/track/123" },
          spotifyEmbed: "",
          tracklist: [],
          description: "New release",
          featured: true,
          status: "published",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
      meta: { page: 1, limit: 50, total: 1 },
    }),
    get: async () => null,
    create: async (data) => ({
      id: "rel-new",
      title: data.title,
      slug: data.slug || "new-release",
      type: data.type || "single",
      releaseDate: data.releaseDate || null,
      coverArt: data.coverArt || "",
      streamingLinks: data.streamingLinks || {},
      spotifyEmbed: data.spotifyEmbed || "",
      tracklist: data.tracklist || [],
      description: data.description || "",
      featured: data.featured || false,
      status: data.status || "draft",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    }),
    update: async () => null,
    remove: async () => false,
    ...overrides,
  }
}

test("MusicHandler.list returns typed success result", async () => {
  const handler = new MusicHandler(createStore())

  const result = await handler.list({ type: "single", search: "tsunami" })

  assert.equal(result.success, true)
  if (result.success) {
    assert.equal(result.data.items.length, 1)
    assert.equal(result.data.items[0].title, "TSUNAMI")
  }
})

test("MusicHandler.create returns INVALID_INPUT for bad payload", async () => {
  const handler = new MusicHandler(createStore())

  const result = await handler.create({ title: "" })

  assert.equal(result.success, false)
  if (!result.success) {
    assert.equal(result.error.code, "INVALID_INPUT")
    assert.equal(result.error.recoverable, false)
  }
})

test("MusicHandler.get returns NOT_FOUND when store misses", async () => {
  const handler = new MusicHandler(createStore({ get: async () => null }))

  const result = await handler.get({ id: "missing-id" })

  assert.equal(result.success, false)
  if (!result.success) {
    assert.equal(result.error.code, "MUSIC_NOT_FOUND")
    assert.equal(result.error.recoverable, false)
  }
})

test("MusicHandler.update maps unexpected store error to UNKNOWN_ERROR", async () => {
  const handler = new MusicHandler(createStore({
    update: async () => {
      throw new Error("catalog unavailable")
    },
  }))

  const result = await handler.update({ id: "rel-001", title: "Updated Release" })

  assert.equal(result.success, false)
  if (!result.success) {
    assert.equal(result.error.code, "UNKNOWN_ERROR")
    assert.equal(result.error.message, "catalog unavailable")
    assert.equal(result.error.recoverable, true)
  }
})
