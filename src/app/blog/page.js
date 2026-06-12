import { listPublishedPosts, getBlogCategories, getFeaturedPublishedPost } from "@/lib/blog/public-catalog"
import { canonicalUrl } from "@/lib/post-utils"
import { formatBlogCategoryLabel, getBlogCategoryHref } from "@/lib/blog/category-meta"
import { buildPageMetadata, defaultRobots, siteMetadata } from "@/lib/seo"
import BlogClient from "@/components/blog/BlogClient"

export const dynamic = "force-dynamic"

const BLOG_TITLE = "Blog Music Production, Home Studio & Audio Gear | Tachy"
const BLOG_DESCRIPTION = "Hướng dẫn music production, home studio, mixing, audio gear và workflow sáng tạo dành cho producer, artist và creator."

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {}
  const category = normalizeQueryParam(resolvedSearchParams.category)
  const q = normalizeQueryParam(resolvedSearchParams.q)
  const hasFilters = Boolean(category || q)

  return {
    ...buildPageMetadata({
      title: BLOG_TITLE,
      description: BLOG_DESCRIPTION,
      path: "/blog",
      keywords: ["music production", "home studio", "mixing", "audio gear", "blog âm nhạc", "Tachy"],
    }),
    robots: hasFilters ? { ...defaultRobots, index: false } : defaultRobots,
  }
}

function buildBlogCollectionSchema(posts, categories) {
  const previewPosts = posts.slice(0, 24)

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    url: `${siteMetadata.siteUrl}/blog`,
    inLanguage: "vi-VN",
    isPartOf: {
      "@type": "WebSite",
      name: siteMetadata.title,
      url: siteMetadata.siteUrl,
    },
    hasPart: categories.map((category) => ({
      "@type": "WebPage",
      name: formatBlogCategoryLabel(category),
      url: `${siteMetadata.siteUrl}${getBlogCategoryHref(category)}`,
    })),
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: previewPosts.length,
      itemListElement: previewPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteMetadata.siteUrl}${canonicalUrl(post)}`,
        name: post.title,
      })),
    },
  }
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

  const blogCollectionJsonLd = buildBlogCollectionSchema(posts, categories)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogCollectionJsonLd).replace(/</g, "\\u003c") }}
      />
      <BlogClient
        initialPosts={posts}
        categories={categories}
        featuredPost={featuredPost}
        initialActiveCategory={initialActiveCategory}
        initialSearchQuery={initialSearchQuery}
      />
    </>
  )
}
