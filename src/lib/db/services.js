import { readJSON, writeJSON } from "./io.js"
import { slugify, generateUniqueSlug } from "./slug.js"

export async function readServices(filters = {}) {
  let items = await readJSON("services.json")
  const { status, active, page = 1, limit = 50 } = filters

  if (status) items = items.filter((s) => s.status === status)
  if (active !== undefined) items = items.filter((s) => s.active === active)

  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const total = items.length
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit)

  return { data, meta: { page, limit, total } }
}

export async function createService(data) {
  const items = await readJSON("services.json")
  const slug = await generateUniqueSlug(data.slug || slugify(data.title || "untitled"), items)
  const now = new Date().toISOString()
  const item = {
    id: crypto.randomUUID(),
    title: data.title || "",
    slug,
    description: data.description || "",
    icon: data.icon || "",
    price: data.price || 0,
    currency: data.currency || "USD",
    features: data.features || [],
    active: data.active ?? true,
    status: data.status || "active",
    createdAt: now,
    updatedAt: now,
  }
  items.push(item)
  await writeJSON("services.json", items)
  return item
}

export async function readService(id) {
  const items = await readJSON("services.json")
  return items.find((s) => s.id === id) || null
}

export async function updateService(id, data) {
  const items = await readJSON("services.json")
  const index = items.findIndex((s) => s.id === id)
  if (index === -1) return null
  const existing = items[index]
  items[index] = { ...existing, ...data, id: existing.id, createdAt: existing.createdAt, updatedAt: new Date().toISOString() }
  await writeJSON("services.json", items)
  return items[index]
}

export async function deleteService(id) {
  const items = await readJSON("services.json")
  const index = items.findIndex((s) => s.id === id)
  if (index === -1) return false
  items.splice(index, 1)
  await writeJSON("services.json", items)
  return true
}
