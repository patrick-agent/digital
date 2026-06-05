import { NextResponse } from "next/server"
import { validateApiKey } from "@/lib/api-auth"
import { readPosts, createPost } from "@/lib/db"
import { notifyPublishedBlogPost } from "@/lib/blog-indexing"

export async function GET(request) {
  const authError = validateApiKey(request)
  if (authError) return authError

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") || ""
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "50", 10)

  const { data, meta } = await readPosts({ status, page, limit })

  return NextResponse.json({
    success: true,
    data,
    meta,
  })
}

export async function POST(request) {
  const authError = validateApiKey(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const post = await createPost(body)
    const indexing = await notifyPublishedBlogPost(post)

    return NextResponse.json(
      { success: true, data: post, indexing },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    )
  }
}
