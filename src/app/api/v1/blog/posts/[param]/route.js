import { NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-auth"
import { getBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/blog/service"
import { notifyPublishedBlogPost } from "@/lib/blog-indexing"

export async function GET(request, { params }) {
  const authError = validateApiKey(request)
  if (authError) return authError

  const { param } = await params
  const result = await getBlogPost({ id: param })

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
    const result = await updateBlogPost({ id: param, ...body })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.message },
        { status: 404 }
      )
    }

    const indexing = await notifyPublishedBlogPost(result.data)
    return NextResponse.json({ success: true, data: result.data, indexing })
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
    const result = await deleteBlogPost({ id: param })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.message },
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
