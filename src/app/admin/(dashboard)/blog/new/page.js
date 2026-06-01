import BlogForm from "@/components/admin/BlogForm"
import PageHeader from "@/components/admin/PageHeader"
import AdminPageContainer from "@/components/admin/AdminPageContainer"

export default function NewBlogPostPage() {
  return (
    <AdminPageContainer>
      <PageHeader
        title="New Blog Post"
        subtitle="Create a new blog post"
      />
      <BlogForm />
    </AdminPageContainer>
  )
}
