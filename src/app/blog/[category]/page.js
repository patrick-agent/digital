import { notFound } from "next/navigation"
import {
  getAllPublishedPosts,
  getAllCategories,
} from "@/lib/blog"
import { siteMetadata } from "@/lib/seo"
import BlogClient from "@/components/blog/BlogClient"

export const revalidate = 300

/* ------------------------------------------------------------------ */
/*  Static params — pre-render every published category at build time  */
/* ------------------------------------------------------------------ */
export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((cat) => ({ category: cat }))
}

/* ------------------------------------------------------------------ */
/*  Per-page SEO metadata                                              */
/* ------------------------------------------------------------------ */
export async function generateMetadata({ params }) {
  const { category } = await params
  const decoded = decodeURIComponent(category)

  const title = `${decoded} — Blog`
  const description = `Articles filed under ${decoded}. Tutorials, insights, and stories from ${siteMetadata.author}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    alternates: {
      canonical: `${siteMetadata.siteUrl}/blog/${decoded}`,
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default async function CategoryPage({ params }) {
  const { category } = await params
  const decoded = decodeURIComponent(category)

  const [{ posts }, categories] = await Promise.all([
    getAllPublishedPosts({ category: decoded, page: 1, limit: 9999 }),
    getAllCategories(),
  ])

  // If the category doesn't exist in our data, return 404
  if (!categories.includes(decoded)) {
    notFound()
  }

  return (
    <BlogClient
      initialPosts={posts}
      categories={categories}
      featuredPost={null}
      totalPosts={posts.length}
      initialActiveCategory={decoded}
      pageTitle={`Category: ${decoded}`}
    />
  )
}
