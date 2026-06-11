import { MediaHandler } from "./handler.js"

const handler = new MediaHandler()

export const listMedia = (input) => handler.list(input)
export const getMedia = (input) => handler.get(input)
export const createMedia = (input) => handler.create(input)
export const updateMedia = (input) => handler.update(input)
export const deleteMedia = (input) => handler.remove(input)

export { MediaHandler } from "./handler.js"
export * from "./spec.js"
