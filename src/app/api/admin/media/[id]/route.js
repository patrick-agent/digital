import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { updateMedia, deleteMedia } from "@/lib/media/service"

export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const result = await updateMedia({ id, ...body })
  if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 404 })
  return NextResponse.json(result.data)
}

export async function DELETE(_request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const result = await deleteMedia({ id })
  if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 404 })
  return NextResponse.json({ success: true })
}
