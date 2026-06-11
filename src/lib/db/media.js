import { readJSON, writeJSON } from "./io.js"

export async function readMedia(filters = {}) {
  let items = await readJSON("media.json")
  const { type, search, page = 1, limit = 60 } = filters

  if (type) items = items.filter((item) => item.type === type)

  if (search) {
    const q = search.toLowerCase()
    items = items.filter(
      (item) =>
        item.filename?.toLowerCase().includes(q) ||
        item.alt?.toLowerCase().includes(q) ||
        item.url?.toLowerCase().includes(q)
    )
  }

  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const total = items.length
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit)
  return { data, meta: { page, limit, total } }
}

export async function createMediaItem(data) {
  const items = await readJSON("media.json")
  const now = new Date().toISOString()
  const item = {
    id: crypto.randomUUID(),
    url: data.url || "",
    filename: data.filename || "",
    folder: data.folder || "uploads",
    type: data.type || "image",
    mimeType: data.mimeType || "",
    size: data.size || 0,
    alt: data.alt || "",
    createdAt: now,
    updatedAt: now,
  }

  items.push(item)
  await writeJSON("media.json", items)
  return item
}

export async function updateMediaItem(id, data) {
  const items = await readJSON("media.json")
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return null

  items[index] = {
    ...items[index],
    ...data,
    id: items[index].id,
    createdAt: items[index].createdAt,
    updatedAt: new Date().toISOString(),
  }

  await writeJSON("media.json", items)
  return items[index]
}

export async function deleteMediaItem(id) {
  const items = await readJSON("media.json")
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return false

  items.splice(index, 1)
  await writeJSON("media.json", items)
  return true
}
