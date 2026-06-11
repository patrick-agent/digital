import { readJSON, writeJSON } from "./io.js"
import { slugify, generateUniqueSlug } from "./slug.js"

export async function readMusic(filters = {}) {
  let items = await readJSON("music.json")
  const { type, search, featured, page = 1, limit = 50 } = filters

  if (type) items = items.filter((m) => m.type === type)
  if (featured !== undefined) items = items.filter((m) => m.featured === featured)

  if (search) {
    const q = search.toLowerCase()
    items = items.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description?.toLowerCase().includes(q)
    )
  }

  items.sort((a, b) => new Date(b.releaseDate || b.createdAt) - new Date(a.releaseDate || a.createdAt))

  const total = items.length
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit)

  return { data, meta: { page, limit, total } }
}

export async function readMusicItem(idOrSlug) {
  const items = await readJSON("music.json")
  return items.find((m) => m.id === idOrSlug || m.slug === idOrSlug) || null
}

export async function createMusic(data) {
  const items = await readJSON("music.json")
  const slug = await generateUniqueSlug(data.slug || slugify(data.title), items)
  const now = new Date().toISOString()

  const item = {
    id: crypto.randomUUID(),
    title: data.title || "",
    slug,
    type: data.type || "single",
    releaseDate: data.releaseDate || null,
    coverArt: data.coverArt || "",
    streamingLinks: data.streamingLinks || {},
    spotifyEmbed: data.spotifyEmbed || "",
    tracklist: data.tracklist || [],
    description: data.description || "",
    featured: data.featured || false,
    status: data.status || "draft",
    createdAt: now,
    updatedAt: now,
  }

  items.push(item)
  await writeJSON("music.json", items)
  return item
}

export async function updateMusic(id, data) {
  const items = await readJSON("music.json")
  const index = items.findIndex((m) => m.id === id)
  if (index === -1) return null

  const existing = items[index]
  if (data.title || data.slug) {
    const newSlug = data.slug || slugify(data.title || existing.title)
    data.slug = await generateUniqueSlug(newSlug, items, id)
  }

  items[index] = { ...existing, ...data, id: existing.id, createdAt: existing.createdAt, updatedAt: new Date().toISOString() }
  await writeJSON("music.json", items)
  return items[index]
}

export async function deleteMusic(id) {
  const items = await readJSON("music.json")
  const index = items.findIndex((m) => m.id === id)
  if (index === -1) return false
  items.splice(index, 1)
  await writeJSON("music.json", items)
  return true
}
