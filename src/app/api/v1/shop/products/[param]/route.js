import { NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-auth"
import { getShopProduct, updateShopProduct, deleteShopProduct } from "@/lib/shop/service"

export async function GET(request, { params }) {
  const authError = validateApiKey(request)
  if (authError) return authError

  const { param } = await params
  const result = await getShopProduct({ id: param })

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error.message },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true, data: result.data })
}

export async function PATCH(request, { params }) {
  const authError = validateApiKey(request)
  if (authError) return authError

  try {
    const { param } = await params
    const body = await request.json()
    const result = await updateShopProduct({ id: param, ...body })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.message },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  const authError = validateApiKey(request)
  if (authError) return authError

  try {
    const { param } = await params
    const result = await deleteShopProduct({ id: param })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.message },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
