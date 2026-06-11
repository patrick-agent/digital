import { SearchConsoleHandler } from "./handler.js"

const handler = new SearchConsoleHandler()

export const submitSitemap = (input) => handler.submitSitemap(input)

export { SearchConsoleHandler } from "./handler.js"
export * from "./spec.js"
