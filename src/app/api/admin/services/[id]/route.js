import { NextResponse } from "next/server"
import { getService, updateService, deleteService } from "@/lib/services/service/index.js"
import { auth } from "@/lib/auth"

export async function GET(request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const result = await getService({ id })
  if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 404 })
  return NextResponse.json(result.data)
}

export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const result = await updateService({ id, ...body })
  if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 404 })
  return NextResponse.json(result.data)
}

export async function DELETE(request, { params }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const result = await deleteService({ id })
  if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 404 })
  return NextResponse.json({ success: true })
}
