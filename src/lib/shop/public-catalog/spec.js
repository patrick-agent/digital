import { z } from "zod"

const SORT_VALUES = ["price-asc", "price-desc", "name-asc", "name-desc"]
const PRICE_RANGE_PATTERN = /^\d+(?:e\d+)?-\d*(?:e\d+)?$/i

const optionalTrimmedString = z.string().optional().transform((value) => {
  const trimmed = value?.trim()
  return trimmed || undefined
})

const optionalPositiveInteger = z.union([z.string(), z.number()]).optional().transform((value) => {
  if (value === undefined || value === null || value === "") return undefined

  const numericValue = typeof value === "number" ? value : Number(value)

  if (!Number.isFinite(numericValue) || numericValue < 1) {
    return undefined
  }

  return Math.min(Math.trunc(numericValue), 1000)
})

export const PublicCatalogListInputSchema = z.object({
  category: optionalTrimmedString,
  priceRange: optionalTrimmedString.transform((value) => {
    if (!value || !PRICE_RANGE_PATTERN.test(value)) return undefined
    return value.toLowerCase()
  }),
  sort: optionalTrimmedString.transform((value) => {
    if (!value || !SORT_VALUES.includes(value)) return undefined
    return value
  }),
  q: optionalTrimmedString,
  limit: optionalPositiveInteger,
}).strip()

export const PublicProductLookupInputSchema = z.object({
  slug: optionalTrimmedString,
}).strip()

export const RelatedProductsInputSchema = z.object({
  productId: optionalTrimmedString,
  category: optionalTrimmedString,
  limit: optionalPositiveInteger,
}).strip()

const PublicProductFaqSchema = z.object({
  question: z.string().default(""),
  answer: z.string().default(""),
}).strip()

const PublicProductRelatedArticleSchema = z.object({
  slug: z.string().default(""),
  title: z.string().default(""),
}).strip()

export const PublicProductSchema = z.object({
  id: z.string(),
  brand: z.string().default(""),
  name: z.string().default(""),
  slug: z.string(),
  description: z.string().default(""),
  price: z.coerce.number().default(0),
  currency: z.string().default("VND"),
  images: z.array(z.string()).default([]),
  category: z.string().default(""),
  tags: z.array(z.string()).default([]),
  affiliateUrl: z.string().default(""),
  status: z.string().default("hidden"),
  seoTitle: z.string().default(""),
  seoDescription: z.string().default(""),
  priceNote: z.string().default(""),
  features: z.array(z.string()).default([]),
  whyRecommend: z.string().default(""),
  faq: z.array(PublicProductFaqSchema).default([]),
  relatedArticles: z.array(PublicProductRelatedArticleSchema).default([]),
  createdAt: z.string().default(""),
  updatedAt: z.string().default(""),
}).strip()

export const PublicCatalogErrorCodeSchema = z.enum([
  "CATALOG_READ_FAILED",
  "INVALID_INPUT",
  "PRODUCT_NOT_FOUND",
])

export const PublicCatalogFailureSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: PublicCatalogErrorCodeSchema,
    message: z.string(),
    recoverable: z.boolean(),
  }),
})

export const PublicCatalogListSuccessSchema = z.object({
  success: z.literal(true),
  data: z.object({
    products: z.array(PublicProductSchema),
    categories: z.array(z.string()),
    totalCount: z.number().int().nonnegative(),
  }),
})

export const PublicCatalogProductSuccessSchema = z.object({
  success: z.literal(true),
  data: z.object({
    product: PublicProductSchema,
  }),
})

export const PublicCatalogRelatedSuccessSchema = z.object({
  success: z.literal(true),
  data: z.object({
    products: z.array(PublicProductSchema),
  }),
})

export const PublicCatalogListResultSchema = z.union([
  PublicCatalogListSuccessSchema,
  PublicCatalogFailureSchema,
])

export const PublicCatalogProductResultSchema = z.union([
  PublicCatalogProductSuccessSchema,
  PublicCatalogFailureSchema,
])

export const PublicCatalogRelatedResultSchema = z.union([
  PublicCatalogRelatedSuccessSchema,
  PublicCatalogFailureSchema,
])

export function createPublicCatalogFailure(code, message, recoverable = true) {
  return PublicCatalogFailureSchema.parse({
    success: false,
    error: {
      code,
      message,
      recoverable,
    },
  })
}

/**
 * @typedef {Object} PublicCatalogSpec
 * @property {(input?: unknown) => Promise<z.infer<typeof PublicCatalogListResultSchema>>} list
 * @property {(input?: unknown) => Promise<z.infer<typeof PublicCatalogProductResultSchema>>} get
 * @property {(input?: unknown) => Promise<z.infer<typeof PublicCatalogRelatedResultSchema>>} related
 */
