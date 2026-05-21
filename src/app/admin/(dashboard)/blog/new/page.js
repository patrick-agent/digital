import BlogForm from "@/components/admin/BlogForm"

export default function NewBlogPostPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">New Blog Post</h1>
        <p className="text-text-muted text-sm mt-1">Create a new blog post</p>
      </div>

      <BlogForm />
    </div>
  )
}
