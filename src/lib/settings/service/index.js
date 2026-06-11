import { SettingsHandler } from "./handler.js"

const handler = new SettingsHandler()

export const getSettings = (input) => handler.get(input)
export const updateSettings = (input) => handler.update(input)

export { SettingsHandler } from "./handler.js"
export * from "./spec.js"
