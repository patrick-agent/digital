import { NextResponse } from "next/server"
import { listSubscribers, unsubscribeSubscriber } from "@/lib/newsletter/service"
import { auth } from "@/lib/auth"

export async function GET(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const result = await listSubscribers({
    status: searchParams.get("status") || "",
    search: searchParams.get("search") || "",
  })

  if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 500 })
  return NextResponse.json({ data: result.data.items, meta: result.data.meta })
}

export async function PATCH(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    if (body.action === "unsubscribe" && body.id) {
      const result = await unsubscribeSubscriber({ id: body.id })
      if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 404 })
      return NextResponse.json(result.data)
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
