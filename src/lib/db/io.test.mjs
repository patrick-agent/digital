import test from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, mkdir, writeFile, readFile } from "fs/promises"
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

test("readJSON throws on invalid JSON instead of returning an empty array", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "studio-3d-io-"))
  const dbDir = path.join(tempDir, "db")
  await mkdir(dbDir, { recursive: true })
  await writeFile(path.join(dbDir, "blog.json"), "{invalid", "utf-8")

  const { readJSON } = await importFresh("src/lib/db/io.js")

  await assert.rejects(() => withCwd(tempDir, () => readJSON("blog.json")), (error) => {
    assert.equal(error.name, "StorageError")
    assert.equal(error.code, "FILE_INVALID_JSON")
    return true
  })
})

test("writeJSON persists data that can be read back", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "studio-3d-io-"))
  const dbDir = path.join(tempDir, "db")
  await mkdir(dbDir, { recursive: true })

  const { writeJSON, readJSON } = await importFresh("src/lib/db/io.js")

  await withCwd(tempDir, () => writeJSON("blog.json", [{ id: "post-1", title: "Hello" }]))
  const raw = await readFile(path.join(dbDir, "blog.json"), "utf-8")
  const data = await withCwd(tempDir, () => readJSON("blog.json"))

  assert.match(raw, /post-1/)
  assert.deepEqual(data, [{ id: "post-1", title: "Hello" }])
})
