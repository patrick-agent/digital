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
  let posts = []
  let categories = []
  let featuredPost = null

  try {
    const [postsData, categoriesData, featured] = await Promise.all([
      getAllPublishedPosts({ page: 1, limit: 9999 }),
      getAllCategories(),
      getFeaturedPost(),
    ])
    posts = postsData?.posts || []
    categories = categoriesData || []
    featuredPost = featured || null
    if (featuredPost) {
      posts = posts.filter((p) => p.id !== featuredPost.id)
    }
  } catch (error) {
    console.error("Error loading blog data:", error)
    posts = []
    categories = []
    featuredPost = null
  }

  return (
    <BlogClient
      initialPosts={posts}
      categories={categories}
      featuredPost={featuredPost}
      totalPosts={posts.length}
    />
  )
}
