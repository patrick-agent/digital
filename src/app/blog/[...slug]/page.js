import { notFound, permanentRedirect } from "next/navigation"
import {
  getAllPublishedPosts,
  getAllCategories,
  getPostBySlug,
  getPostBySlugOnly,
  getAllPublishedSlugs,
  getRelatedPosts,
} from "@/lib/blog"
import { siteMetadata } from "@/lib/seo"
import { canonicalUrl as getCanonicalUrl, postUrl } from "@/lib/post-utils"
import ArticleHero from "@/components/blog/ArticleHero"
import ArticleBody, { ArticleSummary } from "@/components/blog/ArticleBody"
import ArticleSchema from "@/components/blog/ArticleSchema"
import ReadingProgress from "@/components/blog/ReadingProgress"
import TableOfContents from "@/components/blog/TableOfContents"
import RelatedPosts from "@/components/blog/RelatedPosts"
import Breadcrumb from "@/components/blog/Breadcrumb"
import ShareSection from "@/components/blog/ShareSection"
import AuthorBox from "@/components/blog/AuthorBox"
import BlogClient from "@/components/blog/BlogClient"
import styles from "./article-page.module.css"

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  const params = slugs.map(({ slug }) => ({ slug: [slug] }))

  const categories = await getAllCategories()
  for (const cat of categories) {
    if (!params.some((p) => p.slug.length === 1 && p.slug[0] === cat)) {
      params.push({ slug: [cat] })
    }
  }

  return params
}

function getPostMetadata(post) {
  const seoTitle = post.seoTitle || post.title
  const seoDescription = post.seoDescription || post.excerpt
  const canonical = `${siteMetadata.siteUrl}${getCanonicalUrl(post)}`
  const publishedTime = post.publishedAt || post.createdAt || undefined
  const modifiedTime = post.updatedAt || post.publishedAt || post.createdAt || undefined
  const image = post.coverImage || siteMetadata.defaultImage

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: post.seoKeywords?.length ? post.seoKeywords : post.tags,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonical,
      type: "article",
      publishedTime,
      modifiedTime,
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [image],
    },
    alternates: { canonical },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const segments = slug || []

  if (segments.length === 1) {
    const [first] = segments
    const post = await getPostBySlugOnly(first)

    if (post) {
      return getPostMetadata(post)
    }

    const decoded = decodeURIComponent(first)
    const categories = await getAllCategories()

    if (categories.includes(decoded)) {
      return {
        title: `${decoded} — Blog`,
        description: `Articles filed under ${decoded}. Tutorials, insights, and stories from ${siteMetadata.author}.`,
        alternates: { canonical: `${siteMetadata.siteUrl}/blog/${first}` },
        robots: { index: true, follow: true },
      }
    }

    return {}
  }

  if (segments.length >= 2) {
    const [categoryRaw, ...rest] = segments
    const post = await getPostBySlug(categoryRaw, rest.join("/"))
    if (!post) return {}

    return getPostMetadata(post)
  }

  return {}
}

export default async function BlogCatchAllPage({ params }) {
  const { slug } = await params
  const segments = slug || []

  if (segments.length === 1) {
    const [first] = segments
    const post = await getPostBySlugOnly(first)

    if (post) {
      const related = await getRelatedPosts(post, 3)
      return renderArticlePage(post, related)
    }

    const decoded = decodeURIComponent(first)
    const categories = await getAllCategories()

    if (categories.includes(decoded)) {
      const [{ posts }, allCategories] = await Promise.all([
        getAllPublishedPosts({ category: decoded, page: 1, limit: 9999 }),
        getAllCategories(),
      ])

      const categoryDescriptions = {
        tutorials: "Hướng dẫn chi tiết về sản xuất âm nhạc, home studio, và các kỹ thuật phòng thu.",
        news: "Cập nhật tin tức, sự kiện và thông báo mới nhất từ Tachy.",
        reviews: "Đánh giá chân thực về thiết bị phòng thu, nhạc cụ và công cụ sản xuất.",
        music: "Chia sẻ về quá trình sáng tác, sản xuất và cảm hứng âm nhạc.",
        production: "Kiến thức chuyên sâu về music production, mixing và mastering.",
        gear: "Giới thiệu và đánh giá thiết bị phòng thu âm nhạc.",
        seo: "Chiến lược SEO, digital marketing và tối ưu nội dung cho nghệ sĩ.",
      }

      return (
        <BlogClient
          initialPosts={posts}
          categories={allCategories}
          featuredPost={null}
          initialActiveCategory={decoded}
          pageTitle={`Category: ${decoded}`}
          categoryDescriptions={categoryDescriptions}
        />
      )
    }

    notFound()
  }

  if (segments.length >= 2) {
    const [categoryRaw, ...rest] = segments
    const post = await getPostBySlug(categoryRaw, rest.join("/"))
    if (!post) notFound()

    permanentRedirect(postUrl(post))
  }

  notFound()
}

async function renderArticlePage(post, related) {
  const parentHref = post.category ? `/blog/${post.category}` : "/blog"
  const currentHref = postUrl(post)
  const shareUrl = `${siteMetadata.siteUrl}${currentHref}`

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    ...(post.category ? [{ label: post.category, href: parentHref }] : []),
    { label: post.title, href: currentHref },
  ]

  return (
    <>
      <ReadingProgress />
      <ArticleSchema post={post} />
      <article className={styles.article}>
        <ArticleHero post={post} />
        <div className={styles.articleShell}>
          <div className={styles.breadcrumbWrap}>
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className={styles.contentGrid}>
            <div className={styles.bodyWrap}>
              <ArticleSummary excerpt={post.excerpt} />
              <TableOfContents content={post.content} />
              <ArticleBody content={post.content} />
              {post.tags?.length > 0 && (
                <section className={styles.tagsSection}>
                  <h2 className={styles.tagsHeading}>Tags</h2>
                  <div className={styles.tags}>
                    {post.tags.map((tag) => (
                      <a key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} className={styles.tag}>
                        {tag}
                      </a>
                    ))}
                  </div>
                </section>
              )}
              <ShareSection title={post.title} url={shareUrl} />
              <AuthorBox />
            </div>
          </div>
          <RelatedPosts posts={related} />
          <div className={styles.backWrap}>
            <a href="/blog" className={styles.backLink}>← Back to Blog</a>
          </div>
        </div>
      </article>
    </>
  )
}
