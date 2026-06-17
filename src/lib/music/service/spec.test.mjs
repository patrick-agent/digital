import test from "node:test"
import assert from "node:assert/strict"

import {
  CreateMusicInputSchema,
  UpdateMusicInputSchema,
} from "./spec.js"

test("CreateMusicInputSchema parses canonical admin payload", () => {
  const result = CreateMusicInputSchema.parse({
    title: "  TSUNAMI  ",
    slug: "  tsunami  ",
    type: "EP",
    releaseDate: " 2026-11-02 ",
    coverArt: "  /images/releases/tsunami.webp  ",
    streamingLinks: {
      spotify: " https://open.spotify.com/track/123 ",
      youtube: " ",
    },
    spotifyEmbed: "  <iframe />  ",
    tracklist: ["  Intro  ", "", " Outro "],
    description: "  New release  ",
    featured: "true",
    status: "PUBLISHED",
    ignoredField: "ignore-me",
  })

  assert.deepEqual(result, {
    title: "TSUNAMI",
    slug: "tsunami",
    type: "ep",
    releaseDate: "2026-11-02",
    coverArt: "/images/releases/tsunami.webp",
    streamingLinks: {
      spotify: "https://open.spotify.com/track/123",
    },
    spotifyEmbed: "<iframe />",
    tracklist: ["Intro", "Outro"],
    description: "New release",
    featured: true,
    status: "published",
  })
})

test("UpdateMusicInputSchema rejects missing id", () => {
  const result = UpdateMusicInputSchema.safeParse({ title: "Updated release" })

  assert.equal(result.success, false)
})

test("CreateMusicInputSchema rejects blank title", () => {
  const result = CreateMusicInputSchema.safeParse({ title: "   " })

  assert.equal(result.success, false)
})
