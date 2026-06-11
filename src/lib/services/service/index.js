import { ServiceHandler } from "./handler.js"

const handler = new ServiceHandler()

export const listServices = (input) => handler.list(input)
export const getService = (input) => handler.get(input)
export const createService = (input) => handler.create(input)
export const updateService = (input) => handler.update(input)
export const deleteService = (input) => handler.remove(input)

export { ServiceHandler } from "./handler.js"
export * from "./spec.js"
