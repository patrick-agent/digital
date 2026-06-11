import { GalleryHandler } from "./handler.js"

const handler = new GalleryHandler()

export const listGalleryItems = (input) => handler.list(input)
export const getGalleryItem = (input) => handler.get(input)
export const createGalleryItem = (input) => handler.create(input)
export const bulkCreateGalleryItems = (input) => handler.bulkCreate(input)
export const updateGalleryItem = (input) => handler.update(input)
export const deleteGalleryItem = (input) => handler.remove(input)

export { GalleryHandler } from "./handler.js"
export * from "./spec.js"
