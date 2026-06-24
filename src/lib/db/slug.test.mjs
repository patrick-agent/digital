import test from "node:test"
import assert from "node:assert/strict"

import { slugify, generateUniqueSlug } from "./slug.js"

test("slugify normalizes Vietnamese text", () => {
  assert.equal(slugify("Ứng Dụng Đàn", ""), "ung-dung-dan")
  assert.equal(slugify("đánh giá audio interface", ""), "danh-gia-audio-interface")
})

test("generateUniqueSlug appends numeric suffixes from normalized base", async () => {
  const slug = await generateUniqueSlug("Đánh giá Audio Interface", [
    { id: "1", slug: "danh-gia-audio-interface" },
    { id: "2", slug: "danh-gia-audio-interface-1" },
  ])

  assert.equal(slug, "danh-gia-audio-interface-2")
})
