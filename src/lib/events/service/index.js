import { EventHandler } from "./handler.js"

export const eventHandler = new EventHandler()

export const listEvents = (input) => eventHandler.list(input)
export const getEvent = (input) => eventHandler.get(input)
export const createEvent = (input) => eventHandler.create(input)
export const updateEvent = (input) => eventHandler.update(input)
export const deleteEvent = (input) => eventHandler.remove(input)

export { EventHandler } from "./handler.js"
export * from "./http.js"
export * from "./spec.js"
