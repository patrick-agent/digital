import { readJSON, writeJSON } from "./io.js"
import { slugify, generateUniqueSlug } from "./slug.js"

function trimString(value) {
  return typeof value === "string" ? value.trim() : ""
}

function normalizeTimestamp(value) {
  const timestamp = Date.parse(value || "")
  return Number.isFinite(timestamp) ? timestamp : 0
}

function normalizeMusicType(type) {
  const normalizedType = trimString(type).toLowerCase()
  if (["album", "single", "ep", "collab"].includes(normalizedType)) return normalizedType
  return "single"
}

function normalizeMusicStatus(status) {
  const normalizedStatus = trimString(status).toLowerCase()
  if (["draft", "published"].includes(normalizedStatus)) return normalizedStatus
  return "draft"
}

function normalizeFeatured(value) {
  if (typeof value === "boolean") return value
  if (typeof value === "string") return value.trim().toLowerCase() === "true"
  return Boolean(value)
}

function normalizeTracklist(tracklist) {
  if (!Array.isArray(tracklist)) return []
  return tracklist.map((track) => trimString(track)).filter(Boolean)
}

function normalizeStreamingLinks(streamingLinks) {
  if (!streamingLinks || typeof streamingLinks !== "object" || Array.isArray(streamingLinks)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(streamingLinks)
      .map(([key, value]) => [key, trimString(value)])
      .filter(([, value]) => value)
  )
}

function normalizeMusicItem(item = {}) {
  const title = trimString(item.title)
  const createdAt = trimString(item.createdAt)

  return {
    id: trimString(item.id) || crypto.randomUUID(),
    title,
    slug: trimString(item.slug) || slugify(title || "untitled-release"),
    type: normalizeMusicType(item.type),
    releaseDate: trimString(item.releaseDate) || null,
    coverArt: trimString(item.coverArt),
    streamingLinks: normalizeStreamingLinks(item.streamingLinks),
    spotifyEmbed: trimString(item.spotifyEmbed),
    tracklist: normalizeTracklist(item.tracklist),
    description: trimString(item.description),
    featured: normalizeFeatured(item.featured),
    status: normalizeMusicStatus(item.status),
    createdAt,
    updatedAt: trimString(item.updatedAt) || createdAt,
  }
}

async function readAllMusic() {
  const items = await readJSON("music.json")
  if (!Array.isArray(items)) return []
  return items.map((item) => normalizeMusicItem(item))
}

export async function readMusic(filters = {}) {
  let items = await readAllMusic()
  const { status, type, search, featured, page = 1, limit = 50 } = filters

  if (status) items = items.filter((m) => m.status === status)
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

  items.sort((left, right) => {
    return normalizeTimestamp(right.releaseDate || right.createdAt) - normalizeTimestamp(left.releaseDate || left.createdAt)
  })

  const total = items.length
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit)

  return { data, meta: { page, limit, total } }
}

export async function readMusicItem(idOrSlug) {
  const items = await readAllMusic()
  return items.find((m) => m.id === idOrSlug || m.slug === idOrSlug) || null
}

export async function createMusic(data) {
  const items = await readAllMusic()
  const title = trimString(data.title)
  const slug = await generateUniqueSlug(data.slug || slugify(title || "untitled-release"), items)
  const now = new Date().toISOString()

  const item = normalizeMusicItem({
    id: crypto.randomUUID(),
    title,
    slug,
    type: data.type,
    releaseDate: data.releaseDate,
    coverArt: data.coverArt,
    streamingLinks: data.streamingLinks,
    spotifyEmbed: data.spotifyEmbed,
    tracklist: data.tracklist,
    description: data.description,
    featured: data.featured,
    status: data.status,
    createdAt: now,
    updatedAt: now,
  })

  items.push(item)
  await writeJSON("music.json", items)
  return item
}

export async function updateMusic(id, data) {
  const items = await readAllMusic()
  const index = items.findIndex((m) => m.id === id)
  if (index === -1) return null

  const existing = items[index]
  const title = trimString(data.title) || existing.title
  const desiredSlug = trimString(data.slug) || existing.slug || slugify(title || "untitled-release")
  const slug = await generateUniqueSlug(desiredSlug, items, id)

  items[index] = normalizeMusicItem({
    ...existing,
    ...data,
    id: existing.id,
    title,
    slug,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  })

  await writeJSON("music.json", items)
  return items[index]
}

export async function deleteMusic(id) {
  const items = await readAllMusic()
  const index = items.findIndex((m) => m.id === id)
  if (index === -1) return false

  items.splice(index, 1)
  await writeJSON("music.json", items)
  return true
}
