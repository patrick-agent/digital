import { readJSON, writeJSON } from "./io.js"
import { slugify, generateUniqueSlug } from "./slug.js"

export async function readCaseStudies(filters = {}) {
  let items = await readJSON("case-studies.json")
  const { status, page = 1, limit = 50 } = filters

  if (status) items = items.filter((c) => c.status === status)

  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const total = items.length
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit)

  return { data, meta: { page, limit, total } }
}

export async function createCaseStudy(data) {
  const items = await readJSON("case-studies.json")
  const slug = await generateUniqueSlug(data.slug || slugify(data.title || "untitled"), items)
  const now = new Date().toISOString()
  const item = {
    id: crypto.randomUUID(),
    title: data.title || "",
    slug,
    client: data.client || "",
    description: data.description || "",
    content: data.content || "",
    thumbnail: data.thumbnail || "",
    tags: data.tags || [],
    status: data.status || "draft",
    createdAt: now,
    updatedAt: now,
  }
  items.push(item)
  await writeJSON("case-studies.json", items)
  return item
}

export async function readCaseStudy(id) {
  const items = await readJSON("case-studies.json")
  return items.find((c) => c.id === id) || null
}

export async function updateCaseStudy(id, data) {
  const items = await readJSON("case-studies.json")
  const index = items.findIndex((c) => c.id === id)
  if (index === -1) return null
  const existing = items[index]
  items[index] = { ...existing, ...data, id: existing.id, createdAt: existing.createdAt, updatedAt: new Date().toISOString() }
  await writeJSON("case-studies.json", items)
  return items[index]
}

export async function deleteCaseStudy(id) {
  const items = await readJSON("case-studies.json")
  const index = items.findIndex((c) => c.id === id)
  if (index === -1) return false
  items.splice(index, 1)
  await writeJSON("case-studies.json", items)
  return true
}
