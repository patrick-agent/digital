import { NextResponse } from "next/server"
import { getEvent, updateEvent, deleteEvent } from "@/lib/events/service"
import { auth } from "@/lib/auth"

export async function GET(request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const result = await getEvent({ id })
  if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 404 })
  return NextResponse.json(result.data)
}

export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()
    const result = await updateEvent({ id, ...body })
    if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 404 })
    return NextResponse.json(result.data)
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await params
    const result = await deleteEvent({ id })
    if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
