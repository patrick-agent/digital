import { readJSON, writeJSON } from "./io.js"
import { slugify, generateUniqueSlug } from "./slug.js"

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
