import { NewsletterHandler } from "./handler.js"

const handler = new NewsletterHandler()

export const listSubscribers = (input) => handler.list(input)
export const getSubscriber = (input) => handler.get(input)
export const addSubscriber = (input) => handler.add(input)
export const unsubscribeSubscriber = (input) => handler.unsubscribe(input)

export { NewsletterHandler } from "./handler.js"
export * from "./spec.js"
