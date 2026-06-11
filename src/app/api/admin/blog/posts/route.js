import { NextResponse } from "next/server"
import { listBlogPosts, createBlogPost } from "@/lib/blog/service"
import { auth } from "@/lib/auth"
import { notifyPublishedBlogPost } from "@/lib/blog-indexing"

export async function GET(request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status") || ""
  const search = searchParams.get("search") || ""
  const persona = searchParams.get("persona") || ""

  const result = await listBlogPosts({ status, search, persona })
  if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 500 })
  return NextResponse.json({ data: result.data.items, meta: result.data.meta })
}

export async function POST(request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = await createBlogPost(body)
    if (!result.success) return NextResponse.json({ error: result.error.message }, { status: 500 })
    const indexing = await notifyPublishedBlogPost(result.data)
    return NextResponse.json({ ...result.data, indexing }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}
