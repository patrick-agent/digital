import Link from "next/link"
import { Plus } from "lucide-react"
import { readPosts } from "@/lib/db"
import BlogListClient from "./BlogListClient"
import PageHeader from "@/components/admin/PageHeader"
import AdminPageContainer from "@/components/admin/AdminPageContainer"

export const dynamic = "force-dynamic"

export default async function AdminBlogPage({ searchParams }) {
  const params = await searchParams
  const status = params?.status || ""
  const search = params?.search || ""
  const persona = params?.persona || ""

  const { data: posts, meta } = await readPosts({ status, search, persona })

  const personaLabel = persona === "marketer" ? "Another Me Blog" : persona === "artist" ? "Tachy Artist Blog" : "Blog Posts"

  return (
    <AdminPageContainer>
      <PageHeader
        title={personaLabel}
        subtitle={`${meta.total} ${meta.total === 1 ? "post" : "posts"} total${persona ? ` • ${persona === "artist" ? "Tachy Artist" : "Another Me"}` : ""}`}
        contentStyle={{ paddingBottom: 12 }}
        actions={
          <Link href="/admin/blog/new" className="admin-btn-primary">
            <Plus size={16} />
            New Post
          </Link>
        }
      />
      <BlogListClient posts={posts} />
    </AdminPageContainer>
  )
}
