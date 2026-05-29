import { notFound } from "next/navigation"
import {
  getAllPublishedPosts,
  getAllCategories,
  getPostBySlug,
  getPostBySlugOnly,
  getAllPublishedSlugs,
  getRelatedPosts,
} from "@/lib/blog"
import { siteMetadata } from "@/lib/seo"
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

export const revalidate = 300

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  const params = []
  for (const { category, slug } of slugs) {
    if (category) {
      params.push({ slug: [category, slug] })
    } else {
      params.push({ slug: [slug] })
    }
  }
  // Also generate params for every valid category
  const categories = await getAllCategories()
  for (const cat of categories) {
    if (!params.some((p) => p.slug.length === 1 && p.slug[0] === cat)) {
      params.push({ slug: [cat] })
    }
  }
  return params
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const segments = slug || []

  if (segments.length === 1) {
    const [first] = segments
    const categories = await getAllCategories()

    // Category listing page
    if (categories.includes(first)) {
      const decoded = decodeURIComponent(first)
      return {
        title: `${decoded} — Blog`,
        description: `Articles filed under ${decoded}. Tutorials, insights, and stories from ${siteMetadata.author}.`,
        alternates: { canonical: `${siteMetadata.siteUrl}/blog/${decoded}` },
      }
    }

    // Single slug detail page (no category)
    const post = await getPostBySlugOnly(first)
    if (post) {
      const seoTitle = post.seoTitle || post.title
      const seoDescription = post.seoDescription || post.excerpt
      return {
        title: seoTitle,
        description: seoDescription,
        keywords: post.seoKeywords?.length ? post.seoKeywords : post.tags,
        openGraph: {
          title: seoTitle,
          description: seoDescription,
          url: `${siteMetadata.siteUrl}/blog/${post.slug}`,
          type: "article",
          publishedTime: post.publishedAt || undefined,
          modifiedTime: post.updatedAt || post.publishedAt || undefined,
          tags: post.tags,
          images: post.coverImage
            ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
            : [{ url: siteMetadata.defaultImage, width: 1200, height: 630, alt: post.title }],
        },
        twitter: {
          card: "summary_large_image",
          title: seoTitle,
          description: seoDescription,
          images: [post.coverImage || siteMetadata.defaultImage],
        },
        alternates: { canonical: `${siteMetadata.siteUrl}/blog/${post.slug}` },
        robots: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
      }
    }

    return {}
  }

  if (segments.length >= 2) {
    const [categoryRaw, ...rest] = segments
    const slug = rest.join("/")
    const post = await getPostBySlug(categoryRaw, slug)
    if (!post) return {}

    const seoTitle = post.seoTitle || post.title
    const seoDescription = post.seoDescription || post.excerpt
    const canonicalUrl = `${siteMetadata.siteUrl}/blog/${post.category}/${post.slug}`

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: post.seoKeywords?.length ? post.seoKeywords : post.tags,
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        url: canonicalUrl,
        type: "article",
        publishedTime: post.publishedAt || undefined,
        modifiedTime: post.updatedAt || post.publishedAt || undefined,
        tags: post.tags,
        images: post.coverImage
          ? [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }]
          : [{ url: siteMetadata.defaultImage, width: 1200, height: 630, alt: post.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
        images: [post.coverImage || siteMetadata.defaultImage],
      },
      alternates: { canonical: canonicalUrl },
      robots: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
    }
  }

  return {}
}

export default async function BlogCatchAllPage({ params }) {
  const { slug } = await params
  const segments = slug || []

  // Single segment
  if (segments.length === 1) {
    const [first] = segments
    const decoded = decodeURIComponent(first)
    const categories = await getAllCategories()

    // Category listing
    if (categories.includes(decoded)) {
      const [{ posts }, allCategories] = await Promise.all([
        getAllPublishedPosts({ category: decoded, page: 1, limit: 9999 }),
        getAllCategories(),
      ])
      return (
        <BlogClient
          initialPosts={posts}
          categories={allCategories}
          featuredPost={null}
          totalPosts={posts.length}
          initialActiveCategory={decoded}
          pageTitle={`Category: ${decoded}`}
        />
      )
    }

    // Post slug without category
    const post = await getPostBySlugOnly(first)
    if (!post) notFound()

    const related = await getRelatedPosts(post, 3)
    return renderArticlePage(post, related)
  }

  // Two+ segments: /blog/[category]/[slug]
  if (segments.length >= 2) {
    const [categoryRaw, ...rest] = segments
    const postSlug = rest.join("/")
    const post = await getPostBySlug(categoryRaw, postSlug)
    if (!post) notFound()

    const related = await getRelatedPosts(post, 3)
    return renderArticlePage(post, related)
  }

  notFound()
}

async function renderArticlePage(post, related) {
  const parentHref = post.category ? `/blog/${post.category}` : "/blog"
  const currentHref = post.category
    ? `/blog/${post.category}/${post.slug}`
    : `/blog/${post.slug}`
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
            <aside className={styles.tocAside}>
              <TableOfContents content={post.content} />
            </aside>
            <div className={styles.bodyWrap}>
              <ArticleSummary excerpt={post.excerpt} />
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
