import { z } from "zod"
import {
  createSingleSuccessSchema,
  BaseFailureSchema,
} from "../../contract/base.js"

export const SettingsSchema = z.record(z.any())

export const UpdateSettingsInputSchema = z.object({
  data: z.any().optional(),
}).strip()

export const SettingsErrorCode = {
  INVALID_INPUT: "INVALID_INPUT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
}

export const SettingsSingleSuccessSchema = createSingleSuccessSchema(SettingsSchema)
export const SettingsFailureSchema = BaseFailureSchema

export const SettingsResultSchema = z.union([
  SettingsSingleSuccessSchema,
  SettingsFailureSchema,
])

export const SettingsSingleResultSchema = z.union([SettingsSingleSuccessSchema, SettingsFailureSchema])
