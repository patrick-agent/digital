import { NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-auth"
import { readProduct, updateProduct, deleteProduct } from "@/lib/db"

export async function GET(request, { params }) {
  const authError = validateApiKey(request)
  if (authError) return authError

  const { param } = await params
  const product = await readProduct(param)

  if (!product) {
    return NextResponse.json(
      { success: false, error: "Product not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true, data: product })
}

export async function PATCH(request, { params }) {
  const authError = validateApiKey(request)
  if (authError) return authError

  try {
    const { param } = await params
    const body = await request.json()
    const product = await updateProduct(param, body)

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: product })
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
    const deleted = await deleteProduct(param)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
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
