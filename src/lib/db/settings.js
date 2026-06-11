import { readFileJSON, writeFileJSON } from "./io.js"
import { mergeDeep, mergeSiteSettings } from "../site-defaults.js"

export async function readSettings() {
  const data = await readFileJSON("settings.json")
  return mergeSiteSettings(data || {})
}

export async function updateSettings(data) {
  const settings = await readSettings()
  const updated = mergeSiteSettings(mergeDeep(settings, data || {}))
  await writeFileJSON("settings.json", updated)
  return updated
}
