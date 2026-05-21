import { NextResponse } from "next/server"
import { readPressKit, updatePressKit } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await readPressKit()
  return NextResponse.json(data)
}

export async function PATCH(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const data = await updatePressKit(body)
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
