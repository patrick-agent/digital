import { NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-auth"
import { readPost, updatePost, deletePost } from "@/lib/db"

export async function GET(request, { params }) {
  const authError = validateApiKey(request)
  if (authError) return authError

  const { param } = await params
  const post = await readPost(param)

  if (!post) {
    return NextResponse.json(
      { success: false, error: "Post not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true, data: post })
}

export async function PATCH(request, { params }) {
  const authError = validateApiKey(request)
  if (authError) return authError

  try {
    const { param } = await params
    const body = await request.json()
    const post = await updatePost(param, body)

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: post })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update post" },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  const authError = validateApiKey(request)
  if (authError) return authError

  try {
    const { param } = await params
    const deleted = await deletePost(param)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete post" },
      { status: 500 }
    )
  }
}
