import { NextResponse } from "next/server"
import { listEvents, createEvent } from "@/lib/events/service"
import { auth } from "@/lib/auth"

export async function GET(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const result = await listEvents({
    status: searchParams.get("status") || "",
    search: searchParams.get("search") || "",
  })
  if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 500 })
  return NextResponse.json({ data: result.data.items, meta: result.data.meta })
}

export async function POST(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const result = await createEvent(body)
    if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 500 })
    return NextResponse.json(result.data, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}
