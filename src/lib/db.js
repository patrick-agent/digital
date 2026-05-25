import { readFile, writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const DB_DIR = path.join(process.cwd(), "db")

async function ensureDbDir() {
  if (!existsSync(DB_DIR)) {
    await mkdir(DB_DIR, { recursive: true })
  }
}

async function readJSON(filename) {
  await ensureDbDir()
  const filePath = path.join(DB_DIR, filename)
  if (!existsSync(filePath)) {
    return []
  }
  const raw = await readFile(filePath, "utf-8")
  return JSON.parse(raw)
}

async function writeJSON(filename, data) {
  await ensureDbDir()
  const filePath = path.join(DB_DIR, filename)
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

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

// ─── Blog ───────────────────────────────────────────────

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

export async function deletePost(id) {
  const posts = await readJSON("blog.json")
  const index = posts.findIndex((p) => p.id === id)
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

// ─── Shop ───────────────────────────────────────────────

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

// ─── Music / Discography ────────────────────────────────

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

// ─── Events / Tour ──────────────────────────────────────

export async function readEvents(filters = {}) {
  let items = await readJSON("events.json")
  const { status, search, page = 1, limit = 50 } = filters

  if (status) items = items.filter((e) => e.status === status)

  if (search) {
    const q = search.toLowerCase()
    items = items.filter(
      (e) =>
        e.eventName.toLowerCase().includes(q) ||
        e.venue?.toLowerCase().includes(q) ||
        e.city?.toLowerCase().includes(q)
    )
  }

  items.sort((a, b) => new Date(a.date) - new Date(b.date))

  // Auto-archive past events
  const now = new Date()
  items = items.map((e) => {
    if (e.status === "upcoming" && new Date(e.date) < now) {
      return { ...e, status: "past" }
    }
    return e
  })
  await writeJSON("events.json", items)

  const total = items.length
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit)

  return { data, meta: { page, limit, total } }
}

export async function readEvent(id) {
  const items = await readJSON("events.json")
  return items.find((e) => e.id === id) || null
}

export async function createEvent(data) {
  const items = await readJSON("events.json")
  const now = new Date().toISOString()

  const item = {
    id: crypto.randomUUID(),
    eventName: data.eventName || "",
    venue: data.venue || "",
    city: data.city || "",
    country: data.country || "",
    date: data.date || null,
    ticketUrl: data.ticketUrl || "",
    posterImage: data.posterImage || "",
    status: data.status || "upcoming",
    createdAt: now,
    updatedAt: now,
  }

  items.push(item)
  await writeJSON("events.json", items)
  return item
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

// ─── Services (Another Me) ──────────────────────────────

export async function readServices(filters = {}) {
  let items = await readJSON("services.json")
  const { status, search, page = 1, limit = 50 } = filters

  if (status) items = items.filter((s) => s.status === status)

  if (search) {
    const q = search.toLowerCase()
    items = items.filter(
      (s) =>
        s.serviceName.toLowerCase().includes(q) ||
        s.headline?.toLowerCase().includes(q)
    )
  }

  items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))

  const total = items.length
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit)

  return { data, meta: { page, limit, total } }
}

export async function readService(idOrSlug) {
  const items = await readJSON("services.json")
  return items.find((s) => s.id === idOrSlug || s.slug === idOrSlug) || null
}

export async function createService(data) {
  const items = await readJSON("services.json")
  const slug = await generateUniqueSlug(data.slug || slugify(data.serviceName), items)
  const now = new Date().toISOString()

  const maxOrder = items.reduce((max, s) => Math.max(max, s.displayOrder || 0), 0)

  const item = {
    id: crypto.randomUUID(),
    serviceName: data.serviceName || "",
    slug,
    persona: "digital",
    headline: data.headline || "",
    description: data.description || "",
    features: data.features || [],
    priceRange: data.priceRange || "",
    ctaLabel: data.ctaLabel || "Contact",
    ctaUrl: data.ctaUrl || "",
    icon: data.icon || "",
    displayOrder: data.displayOrder ?? maxOrder + 1,
    status: data.status || "active",
    createdAt: now,
    updatedAt: now,
  }

  items.push(item)
  await writeJSON("services.json", items)
  return item
}

export async function updateService(id, data) {
  const items = await readJSON("services.json")
  const index = items.findIndex((s) => s.id === id)
  if (index === -1) return null

  const existing = items[index]
  if (data.serviceName || data.slug) {
    const newSlug = data.slug || slugify(data.serviceName || existing.serviceName)
    data.slug = await generateUniqueSlug(newSlug, items, id)
  }

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

export async function reorderServices(orderedIds) {
  const items = await readJSON("services.json")
  orderedIds.forEach((id, index) => {
    const item = items.find((s) => s.id === id)
    if (item) item.displayOrder = index + 1
  })
  await writeJSON("services.json", items)
  return items
}

// ─── Case Studies ───────────────────────────────────────

export async function readCaseStudies(filters = {}) {
  let items = await readJSON("case-studies.json")
  const { status, search, industry, page = 1, limit = 50 } = filters

  if (status) items = items.filter((c) => c.status === status)
  if (industry) items = items.filter((c) => c.industry === industry)

  if (search) {
    const q = search.toLowerCase()
    items = items.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.clientName?.toLowerCase().includes(q)
    )
  }

  items.sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))

  const total = items.length
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit)

  return { data, meta: { page, limit, total } }
}

export async function readCaseStudy(idOrSlug) {
  const items = await readJSON("case-studies.json")
  return items.find((c) => c.id === idOrSlug || c.slug === idOrSlug) || null
}

export async function createCaseStudy(data) {
  const items = await readJSON("case-studies.json")
  const slug = await generateUniqueSlug(data.slug || slugify(data.title), items)
  const now = new Date().toISOString()

  const item = {
    id: crypto.randomUUID(),
    title: data.title || "",
    slug,
    clientName: data.clientName || "",
    industry: data.industry || "",
    challenge: data.challenge || "",
    solution: data.solution || "",
    results: data.results || [],
    metrics: data.metrics || {},
    coverImage: data.coverImage || "",
    testimonialQuote: data.testimonialQuote || "",
    testimonialAuthor: data.testimonialAuthor || "",
    tags: data.tags || [],
    publishedAt: data.publishedAt || null,
    status: data.status || "draft",
    createdAt: now,
    updatedAt: now,
  }

  items.push(item)
  await writeJSON("case-studies.json", items)
  return item
}

export async function updateCaseStudy(id, data) {
  const items = await readJSON("case-studies.json")
  const index = items.findIndex((c) => c.id === id)
  if (index === -1) return null

  const existing = items[index]
  if (data.title || data.slug) {
    const newSlug = data.slug || slugify(data.title || existing.title)
    data.slug = await generateUniqueSlug(newSlug, items, id)
  }

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

// ─── Gallery ────────────────────────────────────────────

export async function readGallery(filters = {}) {
  let items = await readJSON("gallery.json")
  const { mediaType, search, page = 1, limit = 50 } = filters

  if (mediaType) items = items.filter((g) => g.mediaType === mediaType)

  if (search) {
    const q = search.toLowerCase()
    items = items.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.caption?.toLowerCase().includes(q) ||
        g.altText?.toLowerCase().includes(q)
    )
  }

  items.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))

  const total = items.length
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit)

  return { data, meta: { page, limit, total } }
}

export async function readGalleryItem(id) {
  const items = await readJSON("gallery.json")
  return items.find((g) => g.id === id) || null
}

export async function createGalleryItem(data) {
  const items = await readJSON("gallery.json")
  const now = new Date().toISOString()
  const maxOrder = items.reduce((max, g) => Math.max(max, g.displayOrder || 0), 0)

  const item = {
    id: crypto.randomUUID(),
    title: data.title || "",
    mediaType: data.mediaType || "photo",
    fileUrl: data.fileUrl || "",
    thumbnail: data.thumbnail || "",
    altText: data.altText || "",
    caption: data.caption || "",
    tags: data.tags || [],
    eventRef: data.eventRef || "",
    displayOrder: data.displayOrder ?? maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  }

  items.push(item)
  await writeJSON("gallery.json", items)
  return item
}

export async function updateGalleryItem(id, data) {
  const items = await readJSON("gallery.json")
  const index = items.findIndex((g) => g.id === id)
  if (index === -1) return null

  const existing = items[index]
  items[index] = { ...existing, ...data, id: existing.id, createdAt: existing.createdAt, updatedAt: new Date().toISOString() }
  await writeJSON("gallery.json", items)
  return items[index]
}

export async function deleteGalleryItem(id) {
  const items = await readJSON("gallery.json")
  const index = items.findIndex((g) => g.id === id)
  if (index === -1) return false
  items.splice(index, 1)
  await writeJSON("gallery.json", items)
  return true
}

export async function bulkCreateGalleryItems(itemsData) {
  const items = await readJSON("gallery.json")
  const now = new Date().toISOString()
  const maxOrder = items.reduce((max, g) => Math.max(max, g.displayOrder || 0), 0)

  const newItems = itemsData.map((data, i) => ({
    id: crypto.randomUUID(),
    title: data.title || "",
    mediaType: data.mediaType || "photo",
    fileUrl: data.fileUrl || "",
    thumbnail: data.thumbnail || "",
    altText: data.altText || "",
    caption: data.caption || "",
    tags: data.tags || [],
    eventRef: data.eventRef || "",
    displayOrder: data.displayOrder ?? maxOrder + i + 1,
    createdAt: now,
    updatedAt: now,
  }))

  items.push(...newItems)
  await writeJSON("gallery.json", items)
  return newItems
}

// ─── Press Kit (Singleton) ──────────────────────────────

export async function readPressKit() {
  await ensureDbDir()
  const filePath = path.join(DB_DIR, "press-kit.json")
  if (!existsSync(filePath)) {
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
  const raw = await readFile(filePath, "utf-8")
  return JSON.parse(raw)
}

export async function updatePressKit(data) {
  const existing = await readPressKit()
  const updated = { ...existing, ...data }
  const filePath = path.join(DB_DIR, "press-kit.json")
  await writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8")
  return updated
}

// ─── Newsletter Subscribers ─────────────────────────────

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

  // Check duplicate
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

// ─── SEO & Metadata ─────────────────────────────────────

export async function readSEOMetadata() {
  await ensureDbDir()
  const filePath = path.join(DB_DIR, "seo.json")
  if (!existsSync(filePath)) {
    return { pages: {} }
  }
  const raw = await readFile(filePath, "utf-8")
  return JSON.parse(raw)
}

export async function updateSEOMetadata(route, data) {
  const existing = await readSEOMetadata()
  if (!existing.pages) existing.pages = {}

  existing.pages[route] = {
    ...(existing.pages[route] || {}),
    ...data,
    updatedAt: new Date().toISOString(),
  }

  const filePath = path.join(DB_DIR, "seo.json")
  await writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8")
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

// ─── Settings ───────────────────────────────────────────

export async function readSettings() {
  await ensureDbDir()
  const filePath = path.join(DB_DIR, "settings.json")
  if (!existsSync(filePath)) {
    return {
      siteTitle: "Tachy Artist",
      seoTitle: "Tachy Artist — Interactive Music Portfolio",
      seoDescription: "",
      seoKeywords: [],
      socialLinks: {},
    }
  }
  const raw = await readFile(filePath, "utf-8")
  return JSON.parse(raw)
}

export async function updateSettings(data) {
  const settings = await readSettings()
  const updated = { ...settings, ...data }
  const filePath = path.join(DB_DIR, "settings.json")
  await writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8")
  return updated
}

// ─── Export helpers ─────────────────────────────────────

export { slugify, generateUniqueSlug }
