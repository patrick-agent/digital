import test from "node:test"
import assert from "node:assert/strict"

import { sanitizeShopFaqEntries, sanitizeShopRichText } from "./public-html.js"

test("sanitizeShopRichText removes unsafe script content", () => {
  const sanitized = sanitizeShopRichText('<p>Hello</p><script>alert(1)</script><a href="https://example.com">Link</a>')

  assert.equal(sanitized.includes("<script>"), false)
  assert.match(sanitized, /rel="noopener noreferrer"/)
})

test("sanitizeShopFaqEntries sanitizes each answer", () => {
  const faq = sanitizeShopFaqEntries([
    { question: "Q", answer: '<img src="https://example.com/x.png" onerror="alert(1)">' },
  ])

  assert.equal(faq[0].answer.includes("onerror"), false)
  assert.match(faq[0].answer, /loading="lazy"/)
})
