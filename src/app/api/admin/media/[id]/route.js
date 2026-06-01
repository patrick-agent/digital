import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { deleteMediaItem, updateMediaItem } from "@/lib/db"

export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const item = await updateMediaItem(id, body)
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(item)
}

export async function DELETE(_request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const deleted = await deleteMediaItem(id)
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ ok: true })
}
