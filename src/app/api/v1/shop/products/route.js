import { NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-auth"
import { listShopProducts, createShopProduct } from "@/lib/shop/service"

export async function GET(request) {
  const authError = validateApiKey(request)
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") || ""
  const category = searchParams.get("category") || ""
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "50", 10)

  const result = await listShopProducts({ status, category, page, limit })
  if (!result.success) return NextResponse.json({ success: false, error: result.error.message }, { status: 500 })

  return NextResponse.json({
    success: true,
    data: result.data.items,
    meta: result.data.meta,
  })
}

export async function POST(request) {
  const authError = validateApiKey(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const result = await createShopProduct(body)
    if (!result.success) return NextResponse.json({ success: false, error: result.error.message }, { status: 500 })

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 }
    )
  }
}
