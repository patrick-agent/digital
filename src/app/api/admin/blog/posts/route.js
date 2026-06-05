import { NextResponse } from "next/server"
import { readPosts, createPost } from "@/lib/db"
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

  const result = await readPosts({ status, search, persona })
  return NextResponse.json(result)
}

export async function POST(request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const post = await createPost(body)
    const indexing = await notifyPublishedBlogPost(post)
    return NextResponse.json({ ...post, indexing }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    )
  }
}
