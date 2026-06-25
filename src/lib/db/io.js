import { readFile, writeFile, mkdir, stat, rename, unlink } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const jsonCache = new Map()
const isVercel = process.env.VERCEL === "1"
const useBlobDb = isVercel || process.env.USE_VERCEL_BLOB_DB === "1" || process.env.DB_SYNC_MODE === "blob"

function getDbDir() {
  return path.join(process.cwd(), "db")
}

function blobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN || ""
}

function blobStoreId() {
  const token = blobToken()
  const parts = token.split("_")
  if (parts.length >= 4 && parts[0] === "vercel" && parts[1] === "blob" && parts[2] === "rw") {
    return parts[3].toLowerCase()
  }
  return null
}

function blobReadUrl(filename) {
  const id = blobStoreId()
  return id ? `https://${id}.private.blob.vercel-storage.com/${blobPath(filename)}` : null
}

function blobAuthHeaders() {
  const token = blobToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function blobPath(filename) {
  return `db/${filename}`
}

function createStorageError(code, filename, message, cause) {
  const error = new Error(message)
  error.name = "StorageError"
  error.code = code
  error.filename = filename
  if (cause) error.cause = cause
  return error
}

function parseJsonOrThrow(text, filename, sourceLabel) {
  if (!text || !text.trim()) {
    throw createStorageError(
      `${sourceLabel}_BLANK_FILE`,
      filename,
      `${filename} is blank. Refusing to treat it as an empty dataset.`
    )
  }

  try {
    return JSON.parse(text)
  } catch (error) {
    throw createStorageError(
      `${sourceLabel}_INVALID_JSON`,
      filename,
      `${filename} contains invalid JSON.`,
      error
    )
  }
}

function ensureArrayData(data, filename) {
  if (Array.isArray(data)) return data
  throw createStorageError(
    "DATASET_SHAPE_INVALID",
    filename,
    `${filename} is not an array dataset.`
  )
}

function assertBlobConfig(/*filename*/) {
  // Soft check — if blob token is missing, just skip blob reads
  // and fall through to local file read instead of throwing.
}

async function ensureDbDir() {
  if (useBlobDb) return
  const dbDir = getDbDir()
  if (!existsSync(dbDir)) {
    await mkdir(dbDir, { recursive: true })
  }
}

async function readBlobJson(filename) {
  const url = blobReadUrl(filename)
  if (!url || !blobToken()) return { status: "missing" }

  try {
    const res = await fetch(url, { headers: blobAuthHeaders() })
    if (res.status === 404) return { status: "missing" }
    if (!res.ok) {
      const errorText = await res.text().catch(() => "")
      throw createStorageError(
        "BLOB_READ_FAILED",
        filename,
        `Blob read failed for ${filename} with status ${res.status}. ${errorText}`.trim()
      )
    }

    const text = await res.text()
    return { status: "ok", data: parseJsonOrThrow(text, filename, "BLOB") }
  } catch (error) {
    if (error?.name === "StorageError") throw error
    throw createStorageError(
      "BLOB_READ_FAILED",
      filename,
      `Blob read failed for ${filename}.`,
      error
    )
  }
}

async function writeBlob(filename, data) {
  const token = blobToken()
  const storeId = blobStoreId()
  if (!token || !storeId) return false
  try {
    const json = JSON.stringify(data, null, 2)
    const pathname = blobPath(filename)
    const res = await fetch(`https://vercel.com/api/blob/?pathname=${encodeURIComponent(pathname)}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "x-vercel-blob-store-id": storeId,
        "x-api-version": "12",
        "x-vercel-blob-access": "private",
        "x-add-random-suffix": "0",
        "x-allow-overwrite": "1",
        "x-content-type": "application/json",
      },
      body: json,
    })
    if (!res.ok) {
      const errorText = await res.text().catch(() => "")
      console.error(`writeBlob(${filename}) failed: ${res.status} ${errorText}`)
      return false
    }
    return true
  } catch (err) {
    console.error(`writeBlob(${filename}) error:`, err?.message || err)
    return false
  }
}

async function writeAtomicJson(filePath, filename, data) {
  const tempFilePath = `${filePath}.${process.pid}.${Date.now()}.tmp`

  try {
    await writeFile(tempFilePath, JSON.stringify(data, null, 2), "utf-8")

    try {
      await rename(tempFilePath, filePath)
    } catch (error) {
      if (error?.code !== "EEXIST" && error?.code !== "EPERM") {
        throw error
      }

      await unlink(filePath).catch(() => {})
      await rename(tempFilePath, filePath)
    }
  } catch (error) {
    throw createStorageError(
      "WRITE_FAILED",
      filename,
      `Failed to write ${filename}.`,
      error
    )
  } finally {
    await unlink(tempFilePath).catch(() => {})
  }
}

export async function readJSON(filename) {
  if (useBlobDb) {
    assertBlobConfig(filename)
    const blobResult = await readBlobJson(filename)
    if (blobResult.status === "ok") {
      return ensureArrayData(blobResult.data, filename)
    }
    if (blobResult.status === "missing") {
      // Fall through to local file read
    }
  }

  const filePath = path.join(getDbDir(), filename)
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
    const data = ensureArrayData(parseJsonOrThrow(raw, filename, "FILE"), filename)
    jsonCache.set(filePath, { mtimeMs: fileStats.mtimeMs, size: fileStats.size, data })
    return data
  } catch (error) {
    jsonCache.delete(filePath)
    if (error?.name === "StorageError") throw error
    throw createStorageError(
      "FILE_READ_FAILED",
      filename,
      `Failed to read ${filename}.`,
      error
    )
  }
}

export async function writeJSON(filename, data) {
  if (useBlobDb) {
    const ok = await writeBlob(filename, data)
    jsonCache.delete(`blob:${filename}`)
    if (ok) return
    throw new Error(
      `Blob write failed for ${filename}. ` +
      (blobToken()
        ? "Check Vercel Function Logs for details."
        : "Set BLOB_READ_WRITE_TOKEN in Vercel Environment Variables.")
    )
  }

  await ensureDbDir()
  const filePath = path.join(getDbDir(), filename)
  await writeAtomicJson(filePath, filename, data)
  jsonCache.delete(filePath)
}

export async function readFileJSON(filename) {
  if (useBlobDb) {
    assertBlobConfig(filename)
    const blobResult = await readBlobJson(filename)
    if (blobResult.status === "ok") return blobResult.data
    if (blobResult.status === "missing") return null
  }

  const filePath = path.join(getDbDir(), filename)
  if (!existsSync(filePath)) return null

  try {
    const raw = await readFile(filePath, "utf-8")
    return parseJsonOrThrow(raw, filename, "FILE")
  } catch (error) {
    if (error?.name === "StorageError") throw error
    throw createStorageError(
      "FILE_READ_FAILED",
      filename,
      `Failed to read ${filename}.`,
      error
    )
  }
}

export async function writeFileJSON(filename, data) {
  if (useBlobDb) {
    const ok = await writeBlob(filename, data)
    jsonCache.delete(`blob:${filename}`)
    if (ok) return
    throw new Error(
      `Blob write failed for ${filename}. ` +
      (blobToken()
        ? "Check Vercel Function Logs for details."
        : "Set BLOB_READ_WRITE_TOKEN in Vercel Environment Variables.")
    )
  }

  await ensureDbDir()
  const filePath = path.join(getDbDir(), filename)
  await writeAtomicJson(filePath, filename, data)
}
