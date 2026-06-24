import test from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, mkdir, writeFile } from "fs/promises"
import path from "path"
import os from "os"
import { fileURLToPath, pathToFileURL } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..", "..", "..")

async function importFresh(relativePath) {
  return import(`${pathToFileURL(path.join(projectRoot, relativePath)).href}?t=${Date.now()}-${Math.random()}`)
}

async function withCwd(cwd, callback) {
  const previousCwd = process.cwd()
  process.chdir(cwd)
  try {
    return await callback()
  } finally {
    process.chdir(previousCwd)
  }
}

test("createPost auto-sets publishedAt for published posts and normalizes slug", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "studio-3d-blog-"))
  const dbDir = path.join(tempDir, "db")
  await mkdir(dbDir, { recursive: true })
  await writeFile(path.join(dbDir, "blog.json"), "[]", "utf-8")

  const { createPost } = await importFresh("src/lib/db/blog.js")
  const post = await withCwd(tempDir, () => createPost({
    title: "Ứng Dụng Đàn",
    status: "published",
  }))

  assert.equal(post.slug, "ung-dung-dan")
  assert.equal(typeof post.publishedAt, "string")
})

test("updatePost preserves slug and publishedAt when editing a published post", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "studio-3d-blog-"))
  const dbDir = path.join(tempDir, "db")
  await mkdir(dbDir, { recursive: true })
  await writeFile(path.join(dbDir, "blog.json"), JSON.stringify([
    {
      id: "post-1",
      title: "Old title",
      slug: "old-title",
      persona: "artist",
      content: "",
      excerpt: "",
      coverImage: "",
      tags: [],
      category: "",
      status: "published",
      publishedAt: "2026-01-01T00:00:00.000Z",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: [],
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ], null, 2), "utf-8")

  const { updatePost } = await importFresh("src/lib/db/blog.js")
  const updated = await withCwd(tempDir, () => updatePost("post-1", {
    title: "New title",
    status: "published",
  }))

  assert.equal(updated.slug, "old-title")
  assert.equal(updated.publishedAt, "2026-01-01T00:00:00.000Z")
})
