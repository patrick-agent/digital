import { readFile, writeFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_DIR = path.resolve(__dirname, "..", "..", "db")

async function readJSON(filename) {
  const filePath = path.join(DB_DIR, filename)
  if (!existsSync(filePath)) return []
  const raw = await readFile(filePath, "utf-8")
  if (!raw || raw.trim() === "") return []
  return JSON.parse(raw)
}

async function writeJSON(filename, data) {
  const filePath = path.join(DB_DIR, filename)
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}

function slugify(text) {
  return text
    .toString().toLowerCase().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

async function generateUniqueSlug(baseSlug, existingItems, currentId) {
  let slug = baseSlug
  let counter = 1
  while (existingItems.some((item) => item.slug === slug && item.id !== currentId)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }
  return slug
}

export async function readPosts(filters = {}) {
  let posts = await readJSON("blog.json")
  const { status, search, persona, category, page = 1, limit = 50 } = filters
  if (status) posts = posts.filter((p) => p.status === status)
  if (persona) posts = posts.filter((p) => p.persona === persona)
  if (category) posts = posts.filter((p) => p.category === category)
  if (search) {
    const q = search.toLowerCase()
    posts = posts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q)
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
  const slug = await generateUniqueSlug(data.slug || slugify(data.title), posts)
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
