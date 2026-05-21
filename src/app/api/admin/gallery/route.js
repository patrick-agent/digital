import { NextResponse } from "next/server"
import { readGallery, createGalleryItem, bulkCreateGalleryItems } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const result = await readGallery({
    mediaType: searchParams.get("mediaType") || "",
    search: searchParams.get("search") || "",
  })
  return NextResponse.json(result)
}

export async function POST(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    if (body.bulk && Array.isArray(body.items)) {
      const items = await bulkCreateGalleryItems(body.items)
      return NextResponse.json(items, { status: 201 })
    }
    const item = await createGalleryItem(body)
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}
