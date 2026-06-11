import { NextResponse } from "next/server"
import { getSettings, updateSettings } from "@/lib/settings/service/index.js"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const result = await getSettings()
  if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 500 })
  return NextResponse.json(result.data)
}

export async function PATCH(request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const result = await updateSettings(body)
  if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 500 })
  return NextResponse.json(result.data)
}
