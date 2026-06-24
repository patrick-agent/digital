import { z } from "zod"
import {
  optionalTrimmedString, optionalPositiveInteger,
  createListInputSchema, createSingleSuccessSchema,
  createListSuccessSchema, createDeleteSuccessSchema,
  BaseFailureSchema, LookupInputSchema,
} from "../../contract/base.js"

const optionalNullableTrimmedString = z.union([z.string(), z.null()]).optional().transform((value) => {
  if (value === null || value === undefined) return undefined
  const trimmed = value.trim()
  return trimmed || undefined
})

export const BlogSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  persona: z.string(),
  content: z.string(),
  excerpt: z.string(),
  coverImage: z.string(),
  tags: z.array(z.string()),
  category: z.string(),
  status: z.string(),
  publishedAt: z.string().nullable(),
  seoTitle: z.string(),
  seoDescription: z.string(),
  seoKeywords: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateBlogInputSchema = z.object({
  title: optionalTrimmedString,
  slug: optionalTrimmedString,
  persona: optionalTrimmedString,
  content: optionalTrimmedString,
  excerpt: optionalTrimmedString,
  coverImage: optionalTrimmedString,
  tags: z.array(z.string()).optional(),
  category: optionalTrimmedString,
  status: optionalTrimmedString,
  publishedAt: optionalNullableTrimmedString,
  seoTitle: optionalTrimmedString,
  seoDescription: optionalTrimmedString,
  seoKeywords: z.array(z.string()).optional(),
}).strip()

export const UpdateBlogInputSchema = z.object({
  id: z.string(),
  title: optionalTrimmedString,
  slug: optionalTrimmedString,
  persona: optionalTrimmedString,
  content: optionalTrimmedString,
  excerpt: optionalTrimmedString,
  coverImage: optionalTrimmedString,
  tags: z.array(z.string()).optional(),
  category: optionalTrimmedString,
  status: optionalTrimmedString,
  publishedAt: optionalNullableTrimmedString,
  seoTitle: optionalTrimmedString,
  seoDescription: optionalTrimmedString,
  seoKeywords: z.array(z.string()).optional(),
}).strip()

export const ListBlogInputSchema = createListInputSchema({
  persona: optionalTrimmedString,
  category: optionalTrimmedString,
})

export const LookupBlogInputSchema = LookupInputSchema

export const BlogErrorCode = {
  NOT_FOUND: "BLOG_NOT_FOUND",
  INVALID_INPUT: "INVALID_INPUT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const BlogListSuccessSchema = createListSuccessSchema(BlogSchema)
export const BlogSingleSuccessSchema = createSingleSuccessSchema(BlogSchema)
export const BlogDeleteSuccessSchema = createDeleteSuccessSchema()
export const BlogFailureSchema = BaseFailureSchema

export const BlogResultSchema = z.union([
  BlogListSuccessSchema,
  BlogSingleSuccessSchema,
  BlogDeleteSuccessSchema,
  BlogFailureSchema,
])

export const BlogListResultSchema = z.union([BlogListSuccessSchema, BlogFailureSchema])
export const BlogSingleResultSchema = z.union([BlogSingleSuccessSchema, BlogFailureSchema])
export const BlogDeleteResultSchema = z.union([BlogDeleteSuccessSchema, BlogFailureSchema])
