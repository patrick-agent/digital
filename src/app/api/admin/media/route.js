import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { readMedia } from "@/lib/db"

export async function GET(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const result = await readMedia({
    type: searchParams.get("type") || "",
    search: searchParams.get("search") || "",
    page: Number(searchParams.get("page") || 1),
    limit: Number(searchParams.get("limit") || 60),
  })

  return NextResponse.json(result)
}
