import { NextResponse } from "next/server"
import { readSubscribers, unsubscribeSubscriber } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const result = await readSubscribers({
    status: searchParams.get("status") || "",
    search: searchParams.get("search") || "",
  })
  return NextResponse.json(result)
}

export async function PATCH(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    if (body.action === "unsubscribe" && body.id) {
      const subscriber = await unsubscribeSubscriber(body.id)
      if (!subscriber) return NextResponse.json({ error: "Not found" }, { status: 404 })
      return NextResponse.json(subscriber)
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
