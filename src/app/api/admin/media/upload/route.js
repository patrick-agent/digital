import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createMediaItem } from "@/lib/db"

function safeSegment(value, fallback) {
  return String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || fallback
}

function safeFilename(value) {
  const ext = path.extname(value || "")
  const name = path.basename(value || "upload", ext)
  return `${safeSegment(name, "upload")}${ext.toLowerCase()}`
}

function mediaTypeFromMime(mimeType) {
  if (mimeType?.startsWith("image/")) return "image"
  if (mimeType?.startsWith("video/")) return "video"
  if (mimeType?.startsWith("audio/")) return "audio"
  return "file"
}

export async function POST(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get("file")
    const folder = safeSegment(formData.get("folder"), "uploads")
    const alt = String(formData.get("alt") || "")

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Missing file" }, { status: 400 })
    }

    const filename = `${Date.now()}-${safeFilename(file.name)}`
    const blobPath = `uploads/${folder}/${filename}`
    let url = ""

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(blobPath, file, {
        access: "public",
        addRandomSuffix: false,
      })
      url = blob.url
    } else {
      if (process.env.VERCEL === "1") {
        throw new Error("Set BLOB_READ_WRITE_TOKEN to enable media uploads on Vercel")
      }
      const bytes = await file.arrayBuffer()
      const uploadDir = path.join(process.cwd(), "public", "uploads", folder)
      await mkdir(uploadDir, { recursive: true })
      await writeFile(path.join(uploadDir, filename), Buffer.from(bytes))
      url = `/uploads/${folder}/${filename}`
    }

    const item = await createMediaItem({
      url,
      filename,
      folder,
      alt,
      type: mediaTypeFromMime(file.type),
      mimeType: file.type || "",
      size: file.size || 0,
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Upload failed" },
      { status: 500 }
    )
  }
}
