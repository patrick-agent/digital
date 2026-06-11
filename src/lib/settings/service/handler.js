import {
  readSettings, updateSettings,
} from "../../db/settings.js"
import {
  UpdateSettingsInputSchema,
} from "./spec.js"
import { safeCatch } from "../../contract/base.js"

export class SettingsHandler {
  async get() {
    try {
      const data = await readSettings()
      return { success: true, data }
    } catch (error) {
      return safeCatch(error, "Failed to get settings")
    }
  }

  async update(input) {
    try {
      const { data } = UpdateSettingsInputSchema.parse(input || {})
      const result = await updateSettings(data)
      return { success: true, data: result }
    } catch (error) {
      return safeCatch(error, "Failed to update settings")
    }
  }
}
