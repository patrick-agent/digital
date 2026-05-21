import Link from "next/link"
import { Plus } from "lucide-react"
import { readPosts } from "@/lib/db"
import BlogListClient from "./BlogListClient"

export const dynamic = "force-dynamic"

export default async function AdminBlogPage({ searchParams }) {
  const params = await searchParams
  const status = params?.status || ""
  const search = params?.search || ""
  const persona = params?.persona || ""

  const { data: posts, meta } = await readPosts({ status, search, persona })

  const personaLabel = persona === "marketer" ? "Another Me Blog" : persona === "artist" ? "Tachy Artist Blog" : "Blog Posts"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{personaLabel}</h1>
          <p className="text-text-muted text-sm mt-1">
            {meta.total} {meta.total === 1 ? "post" : "posts"} total
            {persona && ` • ${persona === "artist" ? "Tachy Artist" : "Another Me"}`}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      <BlogListClient posts={posts} />
    </div>
  )
}
