import test from "node:test"
import assert from "node:assert/strict"

import {
  CreateServiceInputSchema,
  UpdateServiceInputSchema,
} from "./spec.js"

test("CreateServiceInputSchema parses canonical admin payload", () => {
  const result = CreateServiceInputSchema.parse({
    serviceName: "  Music Production  ",
    slug: "  music-production  ",
    headline: "  From demo to master  ",
    description: "  Full-service production  ",
    features: ["  Mixing  ", "", " Mastering "],
    priceRange: "  $500 - $2000  ",
    ctaLabel: "  Book now  ",
    ctaUrl: "  /contact  ",
    icon: "  Music  ",
    status: "active",
    displayOrder: "3",
    ignoredField: "ignore-me",
  })

  assert.deepEqual(result, {
    serviceName: "Music Production",
    slug: "music-production",
    headline: "From demo to master",
    description: "Full-service production",
    features: ["Mixing", "Mastering"],
    priceRange: "$500 - $2000",
    ctaLabel: "Book now",
    ctaUrl: "/contact",
    icon: "Music",
    status: "active",
    displayOrder: 3,
  })
})

test("UpdateServiceInputSchema rejects missing id", () => {
  const result = UpdateServiceInputSchema.safeParse({ serviceName: "Updated" })

  assert.equal(result.success, false)
})

test("CreateServiceInputSchema rejects blank serviceName", () => {
  const result = CreateServiceInputSchema.safeParse({ serviceName: "   " })

  assert.equal(result.success, false)
})
