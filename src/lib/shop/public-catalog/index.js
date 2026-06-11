import { PublicCatalogHandler } from "./handler.js"

const publicCatalogHandler = new PublicCatalogHandler()

export function listPublicProducts(input) {
  return publicCatalogHandler.list(input)
}

export function getPublicProduct(input) {
  return publicCatalogHandler.get(input)
}

export function getRelatedProducts(input) {
  return publicCatalogHandler.related(input)
}
