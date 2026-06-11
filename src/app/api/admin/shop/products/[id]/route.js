import { NextResponse } from "next/server"
import { getShopProduct, updateShopProduct, deleteShopProduct } from "@/lib/shop/service"
import { auth } from "@/lib/auth"

export async function GET(request, { params }) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const result = await getShopProduct({ id })
  if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 404 })
  return NextResponse.json(result.data)
}

export async function PATCH(request, { params }) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const result = await updateShopProduct({ id, ...body })
    if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 404 })
    return NextResponse.json(result.data)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const result = await deleteShopProduct({ id })
    if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
