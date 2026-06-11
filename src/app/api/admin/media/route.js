import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { listMedia } from "@/lib/media/service"

export async function GET(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const result = await listMedia({
    type: searchParams.get("type") || "",
    search: searchParams.get("search") || "",
    page: Number(searchParams.get("page") || 1),
    limit: Number(searchParams.get("limit") || 60),
  })

  if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 500 })
  return NextResponse.json({ data: result.data.items, meta: result.data.meta })
}
