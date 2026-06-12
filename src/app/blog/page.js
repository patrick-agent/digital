import { listPublishedPosts, getBlogCategories, getFeaturedPublishedPost } from "@/lib/blog/public-catalog"
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

function normalizeQueryParam(value) {
  return typeof value === "string" ? value.trim() : ""
}

export default async function BlogPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {}
  let posts = []
  let categories = []
  let featuredPost = null
  let initialActiveCategory = null
  let initialSearchQuery = normalizeQueryParam(resolvedSearchParams.q)

  try {
    const [listResult, categoriesData, featured] = await Promise.all([
      listPublishedPosts({ page: 1, limit: 9999 }),
      getBlogCategories(),
      getFeaturedPublishedPost(),
    ])
    posts = listResult.success ? listResult.data.posts : []
    categories = categoriesData || []
    featuredPost = featured || null
    initialActiveCategory = categories.includes(resolvedSearchParams.category)
      ? resolvedSearchParams.category
      : null
  } catch (error) {
    console.error("Error loading blog data:", error)
    posts = []
    categories = []
    featuredPost = null
    initialActiveCategory = null
    initialSearchQuery = ""
  }

  return (
    <BlogClient
      initialPosts={posts}
      categories={categories}
      featuredPost={featuredPost}
      initialActiveCategory={initialActiveCategory}
      initialSearchQuery={initialSearchQuery}
    />
  )
}
