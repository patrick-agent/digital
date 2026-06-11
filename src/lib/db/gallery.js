import { readJSON, writeJSON } from "./io.js"
import { slugify, generateUniqueSlug } from "./slug.js"

export async function readGallery(filters = {}) {
  let items = await readJSON("gallery.json")
  const { category, search, status, mediaType, page = 1, limit = 50 } = filters

  if (status) items = items.filter((i) => i.status === status)
  if (category) items = items.filter((i) => i.category === category)
  if (mediaType) items = items.filter((i) => i.mediaType === mediaType)

  if (search) {
    const q = search.toLowerCase()
    items = items.filter(
      (i) =>
        i.title?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q)
    )
  }

  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const total = items.length
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit)

  return { data, meta: { page, limit, total } }
}

export async function createGalleryItem(data) {
  const items = await readJSON("gallery.json")
  const slug = await generateUniqueSlug(data.slug || slugify(data.title || "untitled"), items)
  const now = new Date().toISOString()
  const item = {
    id: crypto.randomUUID(),
    title: data.title || "",
    slug,
    description: data.description || "",
    image: data.image || "",
    category: data.category || "",
    tags: data.tags || [],
    mediaType: data.mediaType || "image",
    status: data.status || "draft",
    createdAt: now,
    updatedAt: now,
  }
  items.push(item)
  await writeJSON("gallery.json", items)
  return item
}

export async function bulkCreateGalleryItems(itemsData) {
  const items = await readJSON("gallery.json")
  const now = new Date().toISOString()
  const created = []
  for (const data of itemsData) {
    const slug = await generateUniqueSlug(data.slug || slugify(data.title || "untitled"), items)
    const item = {
      id: crypto.randomUUID(),
      title: data.title || "",
      slug,
      description: data.description || "",
      image: data.image || "",
      category: data.category || "",
      tags: data.tags || [],
      mediaType: data.mediaType || "image",
      status: data.status || "draft",
      createdAt: now,
      updatedAt: now,
    }
    items.push(item)
    created.push(item)
  }
  await writeJSON("gallery.json", items)
  return created
}

export async function readGalleryItem(id) {
  const items = await readJSON("gallery.json")
  return items.find((i) => i.id === id) || null
}

export async function updateGalleryItem(id, data) {
  const items = await readJSON("gallery.json")
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return null
  const existing = items[index]
  items[index] = { ...existing, ...data, id: existing.id, createdAt: existing.createdAt, updatedAt: new Date().toISOString() }
  await writeJSON("gallery.json", items)
  return items[index]
}

export async function deleteGalleryItem(id) {
  const items = await readJSON("gallery.json")
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return false
  items.splice(index, 1)
  await writeJSON("gallery.json", items)
  return true
}
