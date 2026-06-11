import { z } from "zod"

const optionalTrimmedString = z.string().optional().transform((value) => {
  const trimmed = value?.trim()
  return trimmed || undefined
})

const optionalPositiveInteger = z.union([z.string(), z.number()]).optional().transform((value) => {
  if (value === undefined || value === null || value === "") return undefined
  const numericValue = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(numericValue) || numericValue < 1) return undefined
  return Math.min(Math.trunc(numericValue), 1000)
})

export const PublicBlogListInputSchema = z.object({
  category: optionalTrimmedString,
  tag: optionalTrimmedString,
  q: optionalTrimmedString,
  page: optionalPositiveInteger,
  limit: optionalPositiveInteger,
}).strip()

export const PublicBlogPostLookupInputSchema = z.object({
  slug: optionalTrimmedString,
  category: optionalTrimmedString,
}).strip()

export const PublicBlogRelatedInputSchema = z.object({
  postId: optionalTrimmedString,
  category: optionalTrimmedString,
  tags: z.array(z.string()).optional().default([]),
  limit: optionalPositiveInteger,
}).strip()

export const PublicBlogPostSchema = z.object({
  id: z.string(),
  title: z.string().default(""),
  slug: z.string(),
  persona: z.string().default("artist"),
  content: z.string().default(""),
  excerpt: z.string().default(""),
  coverImage: z.string().default(""),
  tags: z.array(z.string()).default([]),
  category: z.string().default(""),
  status: z.string().default("draft"),
  publishedAt: z.string().nullable().default(null),
  seoTitle: z.string().default(""),
  seoDescription: z.string().default(""),
  seoKeywords: z.array(z.string()).default([]),
  createdAt: z.string().default(""),
  updatedAt: z.string().default(""),
}).strip()

export const PublicBlogErrorCodeSchema = z.enum([
  "BLOG_READ_FAILED",
  "INVALID_INPUT",
  "POST_NOT_FOUND",
])

export const PublicBlogFailureSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: PublicBlogErrorCodeSchema,
    message: z.string(),
    recoverable: z.boolean(),
  }),
})

export const PublicBlogListSuccessSchema = z.object({
  success: z.literal(true),
  data: z.object({
    posts: z.array(PublicBlogPostSchema),
    categories: z.array(z.string()),
    meta: z.object({
      page: z.number().int().nonnegative(),
      limit: z.number().int().nonnegative(),
      total: z.number().int().nonnegative(),
      totalPages: z.number().int().nonnegative(),
    }),
  }),
})

export const PublicBlogPostSuccessSchema = z.object({
  success: z.literal(true),
  data: z.object({
    post: PublicBlogPostSchema,
  }),
})

export const PublicBlogRelatedSuccessSchema = z.object({
  success: z.literal(true),
  data: z.object({
    posts: z.array(PublicBlogPostSchema),
  }),
})

export const PublicBlogListResultSchema = z.union([
  PublicBlogListSuccessSchema,
  PublicBlogFailureSchema,
])

export const PublicBlogPostResultSchema = z.union([
  PublicBlogPostSuccessSchema,
  PublicBlogFailureSchema,
])

export const PublicBlogRelatedResultSchema = z.union([
  PublicBlogRelatedSuccessSchema,
  PublicBlogFailureSchema,
])

export function createPublicBlogFailure(code, message, recoverable = true) {
  return PublicBlogFailureSchema.parse({
    success: false,
    error: { code, message, recoverable },
  })
}
