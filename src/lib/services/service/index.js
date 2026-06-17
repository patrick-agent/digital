import { ServiceHandler } from "./handler.js"

export const serviceHandler = new ServiceHandler()

export const listServices = (input) => serviceHandler.list(input)
export const getService = (input) => serviceHandler.get(input)
export const createService = (input) => serviceHandler.create(input)
export const updateService = (input) => serviceHandler.update(input)
export const deleteService = (input) => serviceHandler.remove(input)

export { ServiceHandler } from "./handler.js"
export * from "./http.js"
export * from "./spec.js"
