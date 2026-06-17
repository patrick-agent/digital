import { readJSON, writeJSON } from "./io.js"
import { slugify, generateUniqueSlug } from "./slug.js"

function trimString(value) {
  return typeof value === "string" ? value.trim() : ""
}

function normalizeFeatures(features) {
  if (!Array.isArray(features)) return []
  return features.map((feature) => trimString(feature)).filter(Boolean)
}

function normalizeStatus(status, active) {
  if (status === "active" || status === "hidden") return status
  if (typeof active === "boolean") return active ? "active" : "hidden"
  return "active"
}

function normalizePriceRange(item) {
  const explicitPriceRange = trimString(item?.priceRange)
  if (explicitPriceRange) return explicitPriceRange

  if (item?.price === undefined || item?.price === null || item?.price === "") {
    return ""
  }

  const currency = trimString(item?.currency) || "USD"
  return `${currency} ${item.price}`
}

function normalizeDisplayOrder(value, fallback = 0) {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue) || numericValue < 0) return fallback
  return Math.trunc(numericValue)
}

function normalizeTimestamp(value) {
  const timestamp = Date.parse(value || "")
  return Number.isFinite(timestamp) ? timestamp : 0
}

function normalizeService(item = {}, fallbackDisplayOrder = 0) {
  const serviceName = trimString(item.serviceName) || trimString(item.title)
  const createdAt = trimString(item.createdAt)

  return {
    id: trimString(item.id) || crypto.randomUUID(),
    serviceName,
    slug: trimString(item.slug) || slugify(serviceName || "untitled"),
    headline: trimString(item.headline),
    description: trimString(item.description),
    features: normalizeFeatures(item.features),
    priceRange: normalizePriceRange(item),
    ctaLabel: trimString(item.ctaLabel) || "Contact",
    ctaUrl: trimString(item.ctaUrl),
    icon: trimString(item.icon),
    status: normalizeStatus(item.status, item.active),
    displayOrder: normalizeDisplayOrder(item.displayOrder, fallbackDisplayOrder),
    createdAt,
    updatedAt: trimString(item.updatedAt) || createdAt,
  }
}

function matchesSearch(service, query) {
  const haystack = [
    service.serviceName,
    service.slug,
    service.headline,
    service.description,
    ...(service.features || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return haystack.includes(query)
}

async function readAllServices() {
  const items = await readJSON("services.json")
  if (!Array.isArray(items)) return []
  return items.map((item, index) => normalizeService(item, index))
}

function nextDisplayOrder(items) {
  return items.reduce((highest, item) => Math.max(highest, item.displayOrder), -1) + 1
}

export async function readServices(filters = {}) {
  let items = await readAllServices()
  const { status, search, page = 1, limit = 50 } = filters

  if (status) items = items.filter((s) => s.status === status)

  if (search) {
    const query = search.toLowerCase()
    items = items.filter((service) => matchesSearch(service, query))
  }

  items.sort((left, right) => {
    return (
      left.displayOrder - right.displayOrder
      || normalizeTimestamp(right.createdAt) - normalizeTimestamp(left.createdAt)
      || left.serviceName.localeCompare(right.serviceName, "vi")
    )
  })

  const total = items.length
  const offset = (page - 1) * limit
  const data = items.slice(offset, offset + limit)

  return { data, meta: { page, limit, total } }
}

export async function createService(data) {
  const items = await readAllServices()
  const serviceName = trimString(data.serviceName) || trimString(data.title)
  const slug = await generateUniqueSlug(data.slug || slugify(serviceName || "untitled"), items)
  const now = new Date().toISOString()

  const item = normalizeService({
    id: crypto.randomUUID(),
    serviceName,
    slug,
    headline: data.headline,
    description: data.description,
    features: data.features,
    priceRange: data.priceRange,
    ctaLabel: data.ctaLabel,
    ctaUrl: data.ctaUrl,
    icon: data.icon,
    status: data.status,
    displayOrder: data.displayOrder ?? nextDisplayOrder(items),
    createdAt: now,
    updatedAt: now,
  })

  items.push(item)
  await writeJSON("services.json", items)
  return item
}

export async function readService(id) {
  const items = await readAllServices()
  return items.find((s) => s.id === id) || null
}

export async function updateService(id, data) {
  const items = await readAllServices()
  const index = items.findIndex((s) => s.id === id)
  if (index === -1) return null

  const existing = items[index]
  const serviceName = trimString(data.serviceName) || existing.serviceName
  const desiredSlug = trimString(data.slug) || existing.slug || slugify(serviceName || "untitled")
  const slug = await generateUniqueSlug(desiredSlug, items, existing.id)

  items[index] = normalizeService({
    ...existing,
    ...data,
    id: existing.id,
    serviceName,
    slug,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  }, existing.displayOrder)

  await writeJSON("services.json", items)
  return items[index]
}

export async function deleteService(id) {
  const items = await readAllServices()
  const index = items.findIndex((s) => s.id === id)
  if (index === -1) return false

  items.splice(index, 1)
  await writeJSON("services.json", items)
  return true
}
