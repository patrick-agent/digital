import { PressKitHandler } from "./handler.js"

const handler = new PressKitHandler()

export const getPressKit = (input) => handler.get(input)
export const updatePressKit = (input) => handler.update(input)

export { PressKitHandler } from "./handler.js"
export * from "./spec.js"
