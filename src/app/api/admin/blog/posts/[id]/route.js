import { NextResponse } from "next/server"
import { getBlogPost, updateBlogPost, deleteBlogPost, duplicateBlogPost } from "@/lib/blog/service"
import { auth } from "@/lib/auth"
import { notifyPublishedBlogPost } from "@/lib/blog-indexing"

export async function GET(request, { params }) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const result = await getBlogPost({ id })
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
    const result = await updateBlogPost({ id, ...body })
    if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 404 })
    const indexing = await notifyPublishedBlogPost(result.data)
    return NextResponse.json({ ...result.data, indexing })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update post" },
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
    const result = await deleteBlogPost({ id })
    if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    )
  }
}

export async function POST(request, { params }) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    if (action === "duplicate") {
      const result = await duplicateBlogPost({ id })
      if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 404 })
      return NextResponse.json(result.data, { status: 201 })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to duplicate post" },
      { status: 500 }
    )
  }
}
