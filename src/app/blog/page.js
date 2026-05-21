import { getAllPublishedPosts, getAllCategories, getFeaturedPost } from "@/lib/blog"
import BlogClient from "@/components/blog/BlogClient"

export const revalidate = 300

export const metadata = {
  title: "Blog — Studio 3D",
  description: "Tutorials, insights, and stories about 3D art, music production, and the creative process.",
  openGraph: {
    title: "Blog — Studio 3D",
    description: "Tutorials, insights, and stories about 3D art, music production, and the creative process.",
    type: "website",
  },
  alternates: {
    canonical: "https://yourdomain.com/blog",
  },
}

export default async function BlogPage() {
  const [{ posts }, categories, featuredPost] = await Promise.all([
    getAllPublishedPosts({ page: 1, limit: 9999 }),
    getAllCategories(),
    getFeaturedPost(),
  ])

  return (
    <BlogClient
      initialPosts={posts}
      categories={categories}
      featuredPost={featuredPost}
      totalPosts={posts.length}
    />
  )
}
