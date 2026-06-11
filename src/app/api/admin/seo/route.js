import { NextResponse } from "next/server"
import { getSEO, getSEORoutes, updateSEO } from "@/lib/seo/service/index.js"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const seoResult = await getSEO()
  const routesResult = await getSEORoutes()
  if (!seoResult.success) return NextResponse.json({ error: seoResult.error.message }, { status: 500 })
  return NextResponse.json({ seo: seoResult.data, routes: routesResult.success ? routesResult.data.items : [] })
}

export async function PATCH(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  if (body.route && body.data) {
    const result = await updateSEO({ route: body.route, data: body.data })
    if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 500 })
    return NextResponse.json(result.data)
  }
  return NextResponse.json({ error: "Missing route or data" }, { status: 400 })
}
