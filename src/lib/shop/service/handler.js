import {
  readProducts, readProduct, createProduct, updateProduct, deleteProduct,
} from "../../db/shop.js"
import {
  CreateShopInputSchema, UpdateShopInputSchema,
  ListShopInputSchema, LookupShopInputSchema,
  ShopErrorCode,
} from "./spec.js"
import { createFailure, safeCatch } from "../../contract/base.js"

export class ShopHandler {
  async list(input) {
    try {
      const filters = ListShopInputSchema.parse(input || {})
      const { data, meta } = await readProducts(filters)
      return { success: true, data: { items: data, meta } }
    } catch (error) {
      return safeCatch(error, "Failed to list products")
    }
  }

  async get(input) {
    try {
      const { id } = LookupShopInputSchema.parse(input || {})
      if (!id) return createFailure(ShopErrorCode.INVALID_INPUT, "id is required", false)
      const product = await readProduct(id)
      if (!product) return createFailure(ShopErrorCode.NOT_FOUND, `Product not found: ${id}`, false)
      return { success: true, data: product }
    } catch (error) {
      return safeCatch(error, "Failed to get product")
    }
  }

  async create(input) {
    try {
      const data = CreateShopInputSchema.parse(input || {})
      const product = await createProduct(data)
      return { success: true, data: product }
    } catch (error) {
      return safeCatch(error, "Failed to create product")
    }
  }

  async update(input) {
    try {
      const { id, ...data } = UpdateShopInputSchema.parse(input || {})
      if (!id) return createFailure(ShopErrorCode.INVALID_INPUT, "id is required", false)
      const product = await updateProduct(id, data)
      if (!product) return createFailure(ShopErrorCode.NOT_FOUND, `Product not found: ${id}`, false)
      return { success: true, data: product }
    } catch (error) {
      return safeCatch(error, "Failed to update product")
    }
  }

  async remove(input) {
    try {
      const { id } = LookupShopInputSchema.parse(input || {})
      if (!id) return createFailure(ShopErrorCode.INVALID_INPUT, "id is required", false)
      const deleted = await deleteProduct(id)
      if (!deleted) return createFailure(ShopErrorCode.NOT_FOUND, `Product not found: ${id}`, false)
      return { success: true, data: { deleted: true } }
    } catch (error) {
      return safeCatch(error, "Failed to delete product")
    }
  }
}
