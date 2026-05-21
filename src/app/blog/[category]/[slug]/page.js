import { notFound } from "next/navigation"
import {
  getPostBySlug,
  getRelatedPosts,
  getAllPublishedSlugs,
  estimateReadTime,
} from "@/lib/blog"
import { siteMetadata } from "@/lib/seo"
import ArticleHero from "@/components/blog/ArticleHero"
import ArticleBody from "@/components/blog/ArticleBody"
import ArticleSchema from "@/components/blog/ArticleSchema"
import TableOfContents from "@/components/blog/TableOfContents"
import RelatedPosts from "@/components/blog/RelatedPosts"
import Breadcrumb from "@/components/blog/Breadcrumb"
import styles from "./article-page.module.css"

export const revalidate = 300

/* ------------------------------------------------------------------ */
/*  Static params — pre-render every published post at build time      */
/* ------------------------------------------------------------------ */
export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map((p) => ({
    category: p.category,
    slug: p.slug,
  }))
}

/* ------------------------------------------------------------------ */
/*  Per-page SEO metadata (Traditional + AIO + GEO)                   */
/* ------------------------------------------------------------------ */
export async function generateMetadata({ params }) {
  const { category, slug } = await params
  const post = await getPostBySlug(category, slug)

  if (!post) return {}

  const seoTitle = post.seoTitle || post.title
  const seoDescription = post.seoDescription || post.excerpt
  const canonicalUrl = `${siteMetadata.siteUrl}/blog/${post.category}/${post.slug}`

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: post.seoKeywords?.length ? post.seoKeywords : post.tags,
    authors: [{ name: siteMetadata.author }],
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
      site: siteMetadata.twitterHandle,
      creator: siteMetadata.twitterHandle,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */
export default async function ArticlePage({ params }) {
  const { category, slug } = await params
  const post = await getPostBySlug(category, slug)

  if (!post) notFound()

  const related = await getRelatedPosts(post, 3)
  const readTime = estimateReadTime(post.content)

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.category, href: `/blog/${post.category}` },
    { label: post.title, href: `/blog/${post.category}/${post.slug}` },
  ]

  return (
    <>
      {/* JSON-LD structured data — AIO & GEO critical */}
      <ArticleSchema post={post} />

      <article className={styles.article}>
        {/* Hero with parallax cover */}
        <ArticleHero post={post} />

        {/* Breadcrumb navigation */}
        <div className={styles.breadcrumbWrap}>
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Two-column layout: TOC + Body */}
        <div className={styles.contentGrid}>
          <aside className={styles.tocAside}>
            <TableOfContents content={post.content} />
          </aside>

          <div className={styles.bodyWrap}>
            {/* TL;DR / Summary — AIO optimisation */}
            {post.excerpt && (
              <section aria-label="summary" className={styles.summary}>
                <p>{post.excerpt}</p>
              </section>
            )}

            {/* Rich-text body */}
            <ArticleBody content={post.content} />
          </div>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <section className={styles.tagsSection}>
            <h2 className={styles.tagsHeading}>Tags</h2>
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className={styles.tag}
                >
                  {tag}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Related posts */}
        <RelatedPosts posts={related} />

        {/* Back to blog */}
        <div className={styles.backWrap}>
          <a href="/blog" className={styles.backLink}>
            ← Back to Blog
          </a>
        </div>
      </article>
    </>
  )
}
