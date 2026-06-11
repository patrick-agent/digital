import { readJSON, writeJSON } from "./io.js"
import { slugify, generateUniqueSlug } from "./slug.js"

export async function readEvents(filters = {}) {
  let items = await readJSON("events.json")
  const { status, type, page = 1, limit = 50 } = filters

  if (status) items = items.filter((e) => e.status === status)
  if (type) items = items.filter((e) => e.type === type)

  items.sort((a, b) => new Date(b.eventDate || b.createdAt) - new Date(a.eventDate || a.createdAt))
  const total = items.length
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit)

  return { data, meta: { page, limit, total } }
}

export async function createEvent(data) {
  const items = await readJSON("events.json")
  const slug = await generateUniqueSlug(data.slug || slugify(data.title || "untitled"), items)
  const now = new Date().toISOString()
  const item = {
    id: crypto.randomUUID(),
    title: data.title || "",
    slug,
    description: data.description || "",
    eventDate: data.eventDate || null,
    location: data.location || "",
    venue: data.venue || "",
    type: data.type || "concert",
    ticketUrl: data.ticketUrl || "",
    image: data.image || "",
    status: data.status || "draft",
    createdAt: now,
    updatedAt: now,
  }
  items.push(item)
  await writeJSON("events.json", items)
  return item
}

export async function readEvent(id) {
  const items = await readJSON("events.json")
  return items.find((e) => e.id === id) || null
}

export async function updateEvent(id, data) {
  const items = await readJSON("events.json")
  const index = items.findIndex((e) => e.id === id)
  if (index === -1) return null
  const existing = items[index]
  items[index] = { ...existing, ...data, id: existing.id, createdAt: existing.createdAt, updatedAt: new Date().toISOString() }
  await writeJSON("events.json", items)
  return items[index]
}

export async function deleteEvent(id) {
  const items = await readJSON("events.json")
  const index = items.findIndex((e) => e.id === id)
  if (index === -1) return false
  items.splice(index, 1)
  await writeJSON("events.json", items)
  return true
}
