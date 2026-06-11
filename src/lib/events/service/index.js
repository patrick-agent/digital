import { EventHandler } from "./handler.js"

const handler = new EventHandler()

export const listEvents = (input) => handler.list(input)
export const getEvent = (input) => handler.get(input)
export const createEvent = (input) => handler.create(input)
export const updateEvent = (input) => handler.update(input)
export const deleteEvent = (input) => handler.remove(input)

export { EventHandler } from "./handler.js"
export * from "./spec.js"
