import { ShopHandler } from "./handler.js"

const handler = new ShopHandler()

export const listShopProducts = (input) => handler.list(input)
export const getShopProduct = (input) => handler.get(input)
export const createShopProduct = (input) => handler.create(input)
export const updateShopProduct = (input) => handler.update(input)
export const deleteShopProduct = (input) => handler.remove(input)

export { ShopHandler } from "./handler.js"
export * from "./spec.js"
