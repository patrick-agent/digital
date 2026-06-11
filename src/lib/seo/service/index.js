import { SEOHandler } from "./handler.js"

const handler = new SEOHandler()

export const listSEORoutes = (input) => handler.list(input)
export const getSEO = (input) => handler.get(input)
export const updateSEO = (input) => handler.update(input)
export const getSEORoutes = (input) => handler.routes(input)

export { SEOHandler } from "./handler.js"
export * from "./spec.js"
