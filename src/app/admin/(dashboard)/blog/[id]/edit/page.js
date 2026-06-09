import { notFound } from "next/navigation"
import { readPost } from "@/lib/db"
import BlogForm from "@/components/admin/BlogForm"
import PageHeader from "@/components/admin/PageHeader"
import AdminPageContainer from "@/components/admin/AdminPageContainer"

export const dynamic = "force-dynamic"

export default async function EditBlogPostPage({ params }) {
  const { id } = await params
  const post = await readPost(id)

  if (!post) {
    notFound()
  }

  return (
    <AdminPageContainer>
      <PageHeader
        title="Edit Post"
        subtitle={`Editing: ${post.title}`}
        style={{ marginBottom: 12 , paddingLeft: 12, paddingRight: 12 }}
      />
      <BlogForm post={post} />
    </AdminPageContainer>
  )
}
