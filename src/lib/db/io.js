import { readFile, writeFile, mkdir, stat } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

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

function blobPath(filename) {
  return `db/${filename}`
}

async function ensureDbDir() {
  if (useBlobDb) return
  if (!existsSync(DB_DIR)) {
    await mkdir(DB_DIR, { recursive: true })
  }
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
    const pathname = blobPath(filename)
    const res = await fetch(`https://vercel.com/api/blob/?pathname=${encodeURIComponent(pathname)}`, {
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

export async function readJSON(filename) {
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

export async function writeJSON(filename, data) {
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

export async function readFileJSON(filename) {
  if (useBlobDb && blobToken()) {
    const blobData = await readBlob(filename)
    if (blobData) return blobData
  }

  const filePath = path.join(DB_DIR, filename)
  if (!existsSync(filePath)) return null
  const raw = await readFile(filePath, "utf-8")
  return JSON.parse(raw)
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
        : "Set BLOB_READ_WRITE_TOKEN in Vercel Environment Variables."
      )
    )
  }

  await ensureDbDir()
  const filePath = path.join(DB_DIR, filename)
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8")
}
