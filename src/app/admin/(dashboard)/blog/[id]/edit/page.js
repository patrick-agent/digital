import { notFound } from "next/navigation"
import { readPost } from "@/lib/db"
import BlogForm from "@/components/admin/BlogForm"

export const dynamic = "force-dynamic"

export default async function EditBlogPostPage({ params }) {
  const { id } = await params
  const post = await readPost(id)

  if (!post) {
    notFound()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Edit Post</h1>
        <p className="text-text-muted text-sm mt-1">
          Editing: {post.title}
        </p>
      </div>

      <BlogForm post={post} />
    </div>
  )
}
