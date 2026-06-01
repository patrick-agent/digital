import { readFile, writeFile, mkdir, stat } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { mergeDeep, mergeSiteSettings } from "./site-defaults.js"


const DB_DIR = path.join(process.cwd(), "db")
const jsonCache = new Map()
const isVercel = process.env.VERCEL === '1'
const useBlobDb = isVercel || process.env.USE_VERCEL_BLOB_DB === '1' || process.env.DB_SYNC_MODE === 'blob'

function blobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN || ''
}

function blobStoreId() {
  const token = blobToken()
  const parts = token.split('_')
  if (parts.length >= 4 && parts[0] === 'vercel' && parts[1] === 'blob' && parts[2] === 'rw') {
    return parts[3].toLowerCase()
  }
  return null
}

function blobReadUrl(filename) {
  const id = blobStoreId()
  return id ? `https://${id}.private.blob.vercel-storage.com/${blobPath(filename)}` : null
}

function blobWriteUrl(filename) {
  return `https://blob.vercel-storage.com/${blobPath(filename)}`
}

function blobAuthHeaders() {
  const token = blobToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function ensureDbDir() {
  if (useBlobDb) return
  if (!existsSync(DB_DIR)) {
    await mkdir(DB_DIR, { recursive: true })
  }
}

function blobPath(filename) {
  return `db/${filename}`
}

async function readBlob(filename) {
  const url = blobReadUrl(filename)
  if (!url || !blobToken()) return null
  try {
    const res = await fetch(url, { headers: blobAuthHeaders() })
    if (!res.ok) {
      if (res.status !== 404) {
        console.error(`readBlob(${filename}) status:`, res.status, await res.text().catch(() => ''))
      }
      return null
    }
    const text = await res.text()
    if (!text || !text.trim()) return null
    return JSON.parse(text)
  } catch (err) {
    console.error(`readBlob(${filename}) error:`, err?.message || err)
    return null
  }
}

async function writeBlob(filename, data) {
  const token = blobToken()
  const storeId = blobStoreId()
  if (!token || !storeId) return false
  try {
    const json = JSON.stringify(data, null, 2)
    const path = blobPath(filename)
    const res = await fetch(`https://vercel.com/api/blob/?pathname=${encodeURIComponent(path)}`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
        'x-vercel-blob-store-id': storeId,
        'x-api-version': '12',
        'x-vercel-blob-access': 'private',
        'x-add-random-suffix': '0',
        'x-allow-overwrite': '1',
        'x-content-type': 'application/json',
      },
      body: json,
    })
    if (!res.ok) {
      const errorText = await res.text().catch(() => '')
      console.error(`writeBlob(${filename}) failed: ${res.status} ${errorText}`)
      return false
    }
    return true
  } catch (err) {
    console.error(`writeBlob(${filename}) error:`, err?.message || err)
    return false
  }
}

async function readJSON(filename) {
  if (useBlobDb && blobToken()) {
    const blobData = await readBlob(filename)
    if (blobData) return blobData
  }

  const filePath = path.join(DB_DIR, filename)
  if (!existsSync(filePath)) {
    jsonCache.delete(filePath)
    return []
  }
  try {
    const fileStats = await stat(filePath)
    const cached = jsonCache.get(filePath)
    if (cached?.mtimeMs === fileStats.mtimeMs && cached?.size === fileStats.size) {
      return cached.data
    }

    const raw = await readFile(filePath, "utf-8")
    if (!raw || raw.trim() === "") {
      const data = []
      jsonCache.set(filePath, { mtimeMs: fileStats.mtimeMs, size: fileStats.size, data })
      return data
    }
    const data = JSON.parse(raw)
    jsonCache.set(filePath, { mtimeMs: fileStats.mtimeMs, size: fileStats.size, data })
    return data
  } catch (error) {
    console.error(`Error reading/parsing ${filename}:`, error.message)
    jsonCache.delete(filePath)
    return []
  }
}

async function writeJSON(filename, data) {
  if (useBlobDb) {
    const ok = await writeBlob(filename, data)
    jsonCache.delete(`blob:${filename}`)
    if (ok) return
    throw new Error(
      `Blob write failed for ${filename}. ` +
      (blobToken()
        ? "Check Vercel Function Logs for details."
        : "Set BLOB_READ_WRITE_TOKEN in Vercel Environment Variables."
      )
    )
  }

  await ensureDbDir()
  const filePath = path.join(DB_DIR, filename)
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
  jsonCache.delete(filePath)
}

async function readFileJSON(filename) {
  if (useBlobDb && blobToken()) {
    const blobData = await readBlob(filename)
    if (blobData) return blobData
  }

  const filePath = path.join(DB_DIR, filename)
  if (!existsSync(filePath)) return null
  const raw = await readFile(filePath, "utf-8")
  return JSON.parse(raw)
}

async function writeFileJSON(filename, data) {
  if (useBlobDb) {
    const ok = await writeBlob(filename, data)
    jsonCache.delete(`blob:${filename}`)
    if (ok) return
    throw new Error(
      `Blob write failed for ${filename}. ` +
      (blobToken()
        ? "Check Vercel Function Logs for details."
        : "Set BLOB_READ_WRITE_TOKEN in Vercel Environment Variables."
      )
    )
  }

  await ensureDbDir()
  const filePath = path.join(DB_DIR, filename)
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

// ─── Slug helpers ────────────────────────────

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

async function generateUniqueSlug(baseSlug, existingItems, currentId) {
  let slug = baseSlug
  let counter = 1
  while (
    existingItems.some(
      (item) => item.slug === slug && item.id !== currentId
    )
  ) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  return slug
}

// ─── Blog ────────────────────────────────────

export async function readPosts(filters = {}) {
  let posts = await readJSON("blog.json")
  const { status, search, persona, category, page = 1, limit = 50 } = filters

  if (status) posts = posts.filter((p) => p.status === status)
  if (persona) posts = posts.filter((p) => p.persona === persona)
  if (category) posts = posts.filter((p) => p.category === category)

  if (search) {
    const q = search.toLowerCase()
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q)
    )
  }

  posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const total = posts.length
  const offset = (page - 1) * limit
  const data = posts.slice(offset, offset + limit)

  return { data, meta: { page, limit, total } }
}

export async function readPost(idOrSlug) {
  const posts = await readJSON("blog.json")
  return posts.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null
}

export async function createPost(data) {
  const posts = await readJSON("blog.json")

  const slug = await generateUniqueSlug(
    data.slug || slugify(data.title),
    posts
  )

  const now = new Date().toISOString()
  const post = {
    id: crypto.randomUUID(),
    title: data.title || "",
    slug,
    persona: data.persona || "artist",
    content: data.content || "",
    excerpt: data.excerpt || "",
    coverImage: data.coverImage || "",
    tags: data.tags || [],
    category: data.category || "",
    status: data.status || "draft",
    publishedAt: data.publishedAt || null,
    seoTitle: data.seoTitle || "",
    seoDescription: data.seoDescription || "",
    seoKeywords: data.seoKeywords || [],
    createdAt: now,
    updatedAt: now,
  }

  posts.push(post)
  await writeJSON("blog.json", posts)
  return post
}

export async function updatePost(id, data) {
  const posts = await readJSON("blog.json")
  const index = posts.findIndex((p) => p.id === id)

  if (index === -1) return null

  const existing = posts[index]

  if (data.title || data.slug) {
    const newSlug = data.slug || slugify(data.title || existing.title)
    data.slug = await generateUniqueSlug(newSlug, posts, id)
  }

  posts[index] = {
    ...existing,
    ...data,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  }

  await writeJSON("blog.json", posts)
  return posts[index]
}

export async function deletePost(idOrSlug) {
  const posts = await readJSON("blog.json")
  const index = posts.findIndex((p) => p.id === idOrSlug || p.slug === idOrSlug)
  if (index === -1) return false

  posts.splice(index, 1)
  await writeJSON("blog.json", posts)
  return true
}

export async function duplicatePost(id) {
  const post = await readPost(id)
  if (!post) return null

  const { id: _, createdAt, updatedAt, ...rest } = post
  return createPost({
    ...rest,
    title: `${rest.title} (Copy)`,
    status: "draft",
  })
}

// ─── Shop ────────────────────────────────────

export async function readProducts(filters = {}) {
  let products = await readJSON("shop.json")
  const { status, category, search, page = 1, limit = 50 } = filters

  if (status) products = products.filter((p) => p.status === status)
  if (category) products = products.filter((p) => p.category === category)

  if (search) {
    const q = search.toLowerCase()
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    )
  }

  products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const total = products.length
  const offset = (page - 1) * limit
  const data = products.slice(offset, offset + limit)

  return { data, meta: { page, limit, total } }
}

export async function readProduct(idOrSlug) {
  const products = await readJSON("shop.json")
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null
}

export async function createProduct(data) {
  const products = await readJSON("shop.json")

  const slug = await generateUniqueSlug(
    data.slug || slugify(data.name),
    products
  )

  const now = new Date().toISOString()
  const product = {
    id: crypto.randomUUID(),
    name: data.name || "",
    slug,
    description: data.description || "",
    price: data.price || 0,
    currency: data.currency || "USD",
    images: data.images || [],
    category: data.category || "",
    tags: data.tags || [],
    affiliateUrl: data.affiliateUrl || "",
    stockQuantity: data.stockQuantity ?? 0,
    stripeProductId: data.stripeProductId || "",
    status: data.status || "hidden",
    seoTitle: data.seoTitle || "",
    seoDescription: data.seoDescription || "",
    features: data.features || [],
    whyRecommend: data.whyRecommend || "",
    faq: data.faq || [],
    createdAt: now,
    updatedAt: now,
  }

  products.push(product)
  await writeJSON("shop.json", products)
  return product
}

export async function updateProduct(id, data) {
  const products = await readJSON("shop.json")
  const index = products.findIndex((p) => p.id === id)

  if (index === -1) return null

  const existing = products[index]

  if (data.name || data.slug) {
    const newSlug = data.slug || slugify(data.name || existing.name)
    data.slug = await generateUniqueSlug(newSlug, products, id)
  }

  products[index] = {
    ...existing,
    ...data,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  }

  await writeJSON("shop.json", products)
  return products[index]
}

export async function deleteProduct(id) {
  const products = await readJSON("shop.json")
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return false

  products.splice(index, 1)
  await writeJSON("shop.json", products)
  return true
}

// ─── Music / Discography ─────────────────────

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

// ─── Gallery ──────────────────────────────────

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

// ─── Events ───────────────────────────────────

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

// ─── Case Studies ─────────────────────────────

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

// ─── Services ─────────────────────────────────

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

// ─── Press Kit ────────────────────────────────

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

// ─── Newsletter ───────────────────────────────

export async function readSubscribers(filters = {}) {
  let items = await readJSON("newsletter.json")
  const { status, persona, search, page = 1, limit = 100 } = filters

  if (status) items = items.filter((s) => s.status === status)
  if (persona) items = items.filter((s) => s.personaInterest?.includes(persona))

  if (search) {
    const q = search.toLowerCase()
    items = items.filter(
      (s) =>
        s.email.toLowerCase().includes(q) ||
        s.firstName?.toLowerCase().includes(q)
    )
  }

  items.sort((a, b) => new Date(b.subscribedAt) - new Date(a.subscribedAt))
  const total = items.length
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit)

  return { data, meta: { page, limit, total } }
}

export async function unsubscribeSubscriber(id) {
  const items = await readJSON("newsletter.json")
  const index = items.findIndex((s) => s.id === id)
  if (index === -1) return null

  items[index].status = "unsubscribed"
  items[index].unsubscribedAt = new Date().toISOString()
  await writeJSON("newsletter.json", items)
  return items[index]
}

export async function addSubscriber(data) {
  const items = await readJSON("newsletter.json")

  if (items.some((s) => s.email === data.email)) {
    return null
  }

  const now = new Date().toISOString()
  const subscriber = {
    id: crypto.randomUUID(),
    email: data.email || "",
    firstName: data.firstName || "",
    personaInterest: data.personaInterest || [],
    subscribedAt: now,
    status: "active",
  }

  items.push(subscriber)
  await writeJSON("newsletter.json", items)
  return subscriber
}

// ─── SEO ──────────────────────────────────────

export async function readSEOMetadata() {
  const data = await readFileJSON("seo.json")
  if (data) return data
  return { pages: {} }
}

export async function updateSEOMetadata(route, data) {
  const existing = await readSEOMetadata()
  if (!existing.pages) existing.pages = {}

  existing.pages[route] = {
    ...(existing.pages[route] || {}),
    ...data,
    updatedAt: new Date().toISOString(),
  }

  await writeFileJSON("seo.json", existing)
  return existing.pages[route]
}

export async function getAllRoutes() {
  return [
    { route: "/", label: "Homepage" },
    { route: "/about", label: "About Artist" },
    { route: "/bio-music", label: "Bio Music" },
    { route: "/blog", label: "Blog Index" },
    { route: "/shop", label: "Shop" },
    { route: "/gallery", label: "Gallery" },
    { route: "/tour-events", label: "Tour & Events" },
    { route: "/press-kit", label: "Press Kit" },
    { route: "/collab", label: "Collaboration" },
    { route: "/digital", label: "Digital Landing" },
    { route: "/digital/about", label: "Digital About" },
    { route: "/digital/blog", label: "Digital Blog" },
    { route: "/digital/contact", label: "Digital Contact" },
    { route: "/digital/services", label: "Digital Services" },
    { route: "/digital/case-studies", label: "Digital Case Studies" },
    { route: "/newsletter", label: "Newsletter" },
    { route: "/links", label: "Links Hub" },
  ]
}

// ─── Media Library ─────────────────────────────

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

// ─── Settings ─────────────────────────────────

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

// ─── Export helpers ───────────────────────────

export { slugify, generateUniqueSlug }
