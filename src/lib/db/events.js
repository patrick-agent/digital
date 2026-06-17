import { readJSON, writeJSON } from "./io.js"
import { slugify, generateUniqueSlug } from "./slug.js"

function trimString(value) {
  return typeof value === "string" ? value.trim() : ""
}

function normalizeEventStatus(status) {
  const normalizedStatus = trimString(status).toLowerCase()
  if (["upcoming", "past", "cancelled"].includes(normalizedStatus)) {
    return normalizedStatus
  }
  return "upcoming"
}

function normalizeTimestamp(value) {
  const timestamp = Date.parse(value || "")
  return Number.isFinite(timestamp) ? timestamp : 0
}

function normalizeEvent(item = {}) {
  const eventName = trimString(item.eventName) || trimString(item.title)
  const date = trimString(item.date) || trimString(item.eventDate) || null
  const createdAt = trimString(item.createdAt)

  return {
    id: trimString(item.id) || crypto.randomUUID(),
    eventName,
    slug: trimString(item.slug) || slugify(eventName || "untitled-event"),
    venue: trimString(item.venue),
    city: trimString(item.city) || trimString(item.location),
    country: trimString(item.country),
    date,
    ticketUrl: trimString(item.ticketUrl),
    posterImage: trimString(item.posterImage) || trimString(item.image),
    status: normalizeEventStatus(item.status),
    createdAt,
    updatedAt: trimString(item.updatedAt) || createdAt,
  }
}

function matchesSearch(event, query) {
  const haystack = [
    event.eventName,
    event.venue,
    event.city,
    event.country,
    event.slug,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return haystack.includes(query)
}

async function readAllEvents() {
  const items = await readJSON("events.json")
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeEvent(item))
}

export async function readEvents(filters = {}) {
  let items = await readAllEvents()
  const { status, search, page = 1, limit = 50 } = filters

  if (status) items = items.filter((e) => e.status === status)

  if (search) {
    const query = search.toLowerCase()
    items = items.filter((event) => matchesSearch(event, query))
  }

  items.sort((left, right) => {
    return normalizeTimestamp(right.date || right.createdAt) - normalizeTimestamp(left.date || left.createdAt)
  })

  const total = items.length
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit)

  return { data, meta: { page, limit, total } }
}

export async function createEvent(data) {
  const items = await readAllEvents()
  const eventName = trimString(data.eventName) || trimString(data.title)
  const slug = await generateUniqueSlug(data.slug || slugify(eventName || "untitled-event"), items)
  const now = new Date().toISOString()

  const item = normalizeEvent({
    id: crypto.randomUUID(),
    eventName,
    slug,
    venue: data.venue,
    city: data.city,
    country: data.country,
    date: data.date,
    ticketUrl: data.ticketUrl,
    posterImage: data.posterImage,
    status: data.status,
    createdAt: now,
    updatedAt: now,
  })

  items.push(item)
  await writeJSON("events.json", items)
  return item
}

export async function readEvent(id) {
  const items = await readAllEvents()
  return items.find((e) => e.id === id) || null
}

export async function updateEvent(id, data) {
  const items = await readAllEvents()
  const index = items.findIndex((e) => e.id === id)
  if (index === -1) return null

  const existing = items[index]
  const eventName = trimString(data.eventName) || existing.eventName
  const desiredSlug = trimString(data.slug) || existing.slug || slugify(eventName || "untitled-event")
  const slug = await generateUniqueSlug(desiredSlug, items, existing.id)

  items[index] = normalizeEvent({
    ...existing,
    ...data,
    id: existing.id,
    eventName,
    slug,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  })

  await writeJSON("events.json", items)
  return items[index]
}

export async function deleteEvent(id) {
  const items = await readAllEvents()
  const index = items.findIndex((e) => e.id === id)
  if (index === -1) return false

  items.splice(index, 1)
  await writeJSON("events.json", items)
  return true
}
