import { getAllPublishedPosts, getAllCategories, getFeaturedPost } from "@/lib/blog"
import { siteMetadata } from "@/lib/seo"
import BlogClient from "@/components/blog/BlogClient"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Blog — Tachy",
  description: "Read articles on music production, home studio gear, SEO, and creative strategy from Tachy.",
  openGraph: {
    title: "Blog — Tachy",
    description: "Khám phá các bài viết về sản xuất âm nhạc, thiết bị phòng thu, SEO và chiến lược sáng tạo từ Tachy.",
    type: "website",
    url: `${siteMetadata.siteUrl}/blog`,
    images: [{ url: "/images/tachy-about.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Tachy",
    description: "Music production, home studio gear, SEO, and creative strategy from Tachy.",
    images: ["/images/tachy-about.jpg"],
  },
  alternates: {
    canonical: `${siteMetadata.siteUrl}/blog`,
  },
  robots: { index: true, follow: true },
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
    />
  )
}
