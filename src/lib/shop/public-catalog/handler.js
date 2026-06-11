import { readProduct, readProducts } from "../../db.js"
import { stripHtml, syncDescriptionPrice } from "../presentation.js"
import {
  PublicCatalogListInputSchema,
  PublicCatalogListResultSchema,
  PublicCatalogListSuccessSchema,
  PublicProductLookupInputSchema,
  PublicCatalogProductResultSchema,
  PublicCatalogProductSuccessSchema,
  RelatedProductsInputSchema,
  PublicCatalogRelatedResultSchema,
  PublicCatalogRelatedSuccessSchema,
  PublicProductSchema,
  createPublicCatalogFailure,
} from "./spec.js"

const PUBLIC_CATALOG_LIMIT = 1000

function getCategories(products) {
  return [...new Set(products.map((product) => product.category).filter(Boolean))].sort((left, right) => left.localeCompare(right, "vi"))
}

function parsePriceRange(priceRange) {
  if (!priceRange) return null

  const [minRaw, maxRaw] = priceRange.split("-")
  const min = Number(minRaw) || 0
  const max = maxRaw ? Number(maxRaw) : Number.POSITIVE_INFINITY

  return { min, max }
}

function matchesSearch(product, searchQuery) {
  if (!searchQuery) return true

  const haystack = [
    product.name,
    product.brand,
    product.category,
    stripHtml(product.description),
    ...(product.tags || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return haystack.includes(searchQuery)
}

function sortProducts(products, sort) {
  const sortedProducts = [...products]

  if (sort === "price-asc") {
    sortedProducts.sort((left, right) => left.price - right.price)
  } else if (sort === "price-desc") {
    sortedProducts.sort((left, right) => right.price - left.price)
  } else if (sort === "name-asc") {
    sortedProducts.sort((left, right) => (left.name || "").localeCompare(right.name || "", "vi"))
  } else if (sort === "name-desc") {
    sortedProducts.sort((left, right) => (right.name || "").localeCompare(left.name || "", "vi"))
  }

  return sortedProducts
}

async function readAllPublicProducts() {
  const { data } = await readProducts({ status: "active", limit: PUBLIC_CATALOG_LIMIT })
  return PublicProductSchema.array().parse(data || []).map((product) => ({
    ...product,
    description: syncDescriptionPrice(product.description, product.price, product.currency),
  }))
}

export class PublicCatalogHandler {
  async list(input = {}) {
    const parsedInput = PublicCatalogListInputSchema.safeParse(input)

    if (!parsedInput.success) {
      return PublicCatalogListResultSchema.parse(
        createPublicCatalogFailure("INVALID_INPUT", "Bộ lọc shop không hợp lệ.")
      )
    }

    try {
      const products = await readAllPublicProducts()
      const categories = getCategories(products)
      const { category, priceRange, sort, q, limit } = parsedInput.data

      let filteredProducts = products

      if (category) {
        filteredProducts = filteredProducts.filter((product) => product.category === category)
      }

      const numericRange = parsePriceRange(priceRange)
      if (numericRange) {
        filteredProducts = filteredProducts.filter((product) => {
          return product.price >= numericRange.min && product.price <= numericRange.max
        })
      }

      if (q) {
        const normalizedQuery = q.toLowerCase()
        filteredProducts = filteredProducts.filter((product) => matchesSearch(product, normalizedQuery))
      }

      filteredProducts = sortProducts(filteredProducts, sort)

      if (limit) {
        filteredProducts = filteredProducts.slice(0, limit)
      }

      return PublicCatalogListResultSchema.parse(
        PublicCatalogListSuccessSchema.parse({
          success: true,
          data: {
            products: filteredProducts,
            categories,
            totalCount: products.length,
          },
        })
      )
    } catch (error) {
      return PublicCatalogListResultSchema.parse(
        createPublicCatalogFailure(
          "CATALOG_READ_FAILED",
          error instanceof Error ? error.message : "Không thể tải catalog shop.",
          true
        )
      )
    }
  }

  async get(input = {}) {
    const parsedInput = PublicProductLookupInputSchema.safeParse(input)

    if (!parsedInput.success || !parsedInput.data.slug) {
      return PublicCatalogProductResultSchema.parse(
        createPublicCatalogFailure("INVALID_INPUT", "Thiếu slug sản phẩm.", false)
      )
    }

    try {
      const product = await readProduct(parsedInput.data.slug)

      if (!product || product.status !== "active") {
        return PublicCatalogProductResultSchema.parse(
          createPublicCatalogFailure("PRODUCT_NOT_FOUND", "Không tìm thấy sản phẩm này.", false)
        )
      }

      return PublicCatalogProductResultSchema.parse(
        PublicCatalogProductSuccessSchema.parse({
          success: true,
          data: {
            product: {
              ...PublicProductSchema.parse(product),
              description: syncDescriptionPrice(product.description, product.price, product.currency),
            },
          },
        })
      )
    } catch (error) {
      return PublicCatalogProductResultSchema.parse(
        createPublicCatalogFailure(
          "CATALOG_READ_FAILED",
          error instanceof Error ? error.message : "Không thể tải dữ liệu sản phẩm.",
          true
        )
      )
    }
  }

  async related(input = {}) {
    const parsedInput = RelatedProductsInputSchema.safeParse(input)

    if (!parsedInput.success) {
      return PublicCatalogRelatedResultSchema.parse(
        createPublicCatalogFailure("INVALID_INPUT", "Dữ liệu sản phẩm liên quan không hợp lệ.")
      )
    }

    const { productId, category, limit = 3 } = parsedInput.data

    if (!productId || !category) {
      return PublicCatalogRelatedResultSchema.parse(
        PublicCatalogRelatedSuccessSchema.parse({
          success: true,
          data: { products: [] },
        })
      )
    }

    try {
      const products = await readAllPublicProducts()
      const relatedProducts = products
        .filter((product) => product.id !== productId && product.category === category)
        .slice(0, limit)

      return PublicCatalogRelatedResultSchema.parse(
        PublicCatalogRelatedSuccessSchema.parse({
          success: true,
          data: {
            products: relatedProducts,
          },
        })
      )
    } catch (error) {
      return PublicCatalogRelatedResultSchema.parse(
        createPublicCatalogFailure(
          "CATALOG_READ_FAILED",
          error instanceof Error ? error.message : "Không thể tải sản phẩm liên quan.",
          true
        )
      )
    }
  }
}
