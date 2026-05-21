import { NextResponse } from "next/server"
import { readSEOMetadata, updateSEOMetadata, getAllRoutes } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const seo = await readSEOMetadata()
  const routes = await getAllRoutes()
  return NextResponse.json({ seo, routes })
}

export async function PATCH(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    if (body.route && body.data) {
      const result = await updateSEOMetadata(body.route, body.data)
      return NextResponse.json(result)
    }
    return NextResponse.json({ error: "Missing route or data" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
