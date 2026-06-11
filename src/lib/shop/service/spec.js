import { z } from "zod"
import {
  optionalTrimmedString, optionalPositiveInteger,
  createListInputSchema, createSingleSuccessSchema,
  createListSuccessSchema, createDeleteSuccessSchema,
  BaseFailureSchema, LookupInputSchema,
} from "../../contract/base.js"

export const ShopSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.number(),
  currency: z.string(),
  images: z.array(z.string()),
  category: z.string(),
  tags: z.array(z.string()),
  affiliateUrl: z.string(),
  stockQuantity: z.number(),
  stripeProductId: z.string(),
  status: z.string(),
  seoTitle: z.string(),
  seoDescription: z.string(),
  features: z.array(z.string()),
  whyRecommend: z.string(),
  faq: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const CreateShopInputSchema = z.object({
  name: optionalTrimmedString,
  slug: optionalTrimmedString,
  description: optionalTrimmedString,
  price: z.coerce.number().optional(),
  currency: optionalTrimmedString,
  images: z.array(z.string()).optional(),
  category: optionalTrimmedString,
  tags: z.array(z.string()).optional(),
  affiliateUrl: optionalTrimmedString,
  stockQuantity: z.coerce.number().optional(),
  stripeProductId: optionalTrimmedString,
  status: optionalTrimmedString,
  seoTitle: optionalTrimmedString,
  seoDescription: optionalTrimmedString,
  features: z.array(z.string()).optional(),
  whyRecommend: optionalTrimmedString,
  faq: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
}).strip()

export const UpdateShopInputSchema = z.object({
  id: z.string(),
  name: optionalTrimmedString,
  slug: optionalTrimmedString,
  description: optionalTrimmedString,
  price: z.coerce.number().optional(),
  currency: optionalTrimmedString,
  images: z.array(z.string()).optional(),
  category: optionalTrimmedString,
  tags: z.array(z.string()).optional(),
  affiliateUrl: optionalTrimmedString,
  stockQuantity: z.coerce.number().optional(),
  stripeProductId: optionalTrimmedString,
  status: optionalTrimmedString,
  seoTitle: optionalTrimmedString,
  seoDescription: optionalTrimmedString,
  features: z.array(z.string()).optional(),
  whyRecommend: optionalTrimmedString,
  faq: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
}).strip()

export const ListShopInputSchema = createListInputSchema({
  category: optionalTrimmedString,
})

export const LookupShopInputSchema = LookupInputSchema

export const ShopErrorCode = {
  NOT_FOUND: "SHOP_NOT_FOUND",
  INVALID_INPUT: "INVALID_INPUT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const ShopListSuccessSchema = createListSuccessSchema(ShopSchema)
export const ShopSingleSuccessSchema = createSingleSuccessSchema(ShopSchema)
export const ShopDeleteSuccessSchema = createDeleteSuccessSchema()
export const ShopFailureSchema = BaseFailureSchema

export const ShopResultSchema = z.union([
  ShopListSuccessSchema,
  ShopSingleSuccessSchema,
  ShopDeleteSuccessSchema,
  ShopFailureSchema,
])

export const ShopListResultSchema = z.union([ShopListSuccessSchema, ShopFailureSchema])
export const ShopSingleResultSchema = z.union([ShopSingleSuccessSchema, ShopFailureSchema])
export const ShopDeleteResultSchema = z.union([ShopDeleteSuccessSchema, ShopFailureSchema])
