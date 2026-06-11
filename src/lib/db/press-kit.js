import { readFileJSON, writeFileJSON } from "./io.js"

export async function readPressKit() {
  const data = await readFileJSON("press-kit.json")
  if (data) return data
  return {
    bioShort: "",
    bioLong: "",
    headshots: [],
    logos: [],
    pressReleases: [],
    contactBookingEmail: "",
    riderPdf: "",
    techSpecPdf: "",
  }
}

export async function updatePressKit(data) {
  const existing = await readPressKit()
  const updated = { ...existing, ...data }
  await writeFileJSON("press-kit.json", updated)
  return updated
}
