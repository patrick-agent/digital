import { NextResponse } from "next/server"
import { readSettings, updateSettings } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const settings = await readSettings()
  return NextResponse.json(settings)
}

export async function PATCH(request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const settings = await updateSettings(body)
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
