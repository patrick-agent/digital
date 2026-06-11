import {
  readPressKit, updatePressKit,
} from "../../db/press-kit.js"
import {
  UpdatePressKitInputSchema,
} from "./spec.js"
import { safeCatch } from "../../contract/base.js"

export class PressKitHandler {
  async get() {
    try {
      const data = await readPressKit()
      return { success: true, data }
    } catch (error) {
      return safeCatch(error, "Failed to get press kit")
    }
  }

  async update(input) {
    try {
      const data = UpdatePressKitInputSchema.parse(input || {})
      const result = await updatePressKit(data)
      return { success: true, data: result }
    } catch (error) {
      return safeCatch(error, "Failed to update press kit")
    }
  }
}
