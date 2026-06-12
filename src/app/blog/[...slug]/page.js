import Link from "next/link"
import { notFound, permanentRedirect } from "next/navigation"
import {
  listPublishedPosts,
  getBlogCategories,
  getPublishedPost,
  getAllPublishedSlugs,
  getRelatedPublishedPosts,
} from "@/lib/blog/public-catalog"
import { siteMetadata } from "@/lib/seo"
import { canonicalUrl as getCanonicalUrl, postUrl } from "@/lib/post-utils"
import { formatBlogCategoryLabel, getBlogCategoryHref, getBlogCategoryMeta } from "@/lib/blog/category-meta"
import ArticleHero from "@/components/blog/ArticleHero"
import ArticleBody, { ArticleSummary } from "@/components/blog/ArticleBody"
import ArticleSchema from "@/components/blog/ArticleSchema"
import ReadingProgress from "@/components/blog/ReadingProgress"
import TableOfContents from "@/components/blog/TableOfContents"
import RelatedPosts from "@/components/blog/RelatedPosts"
import Breadcrumb from "@/components/blog/Breadcrumb"
import ShareSection from "@/components/blog/ShareSection"
import AuthorBox from "@/components/blog/AuthorBox"
import PostGrid from "@/components/blog/PostGrid"
import AffiliateProducts from "@/components/blog/AffiliateProducts"
import { getAffiliateProductsForArticle } from "@/lib/blog/affiliate-products"
import styles from "./article-page.module.css"
import archiveStyles from "./category-page.module.css"

export const dynamicParams = true
export const revalidate = 300

const CATEGORY_ARCHIVE_PAGE_SIZE = 20

function normalizePageParam(value) {
  const page = Number(Array.isArray(value) ? value[0] : value)

  if (!Number.isFinite(page) || page < 1) return 1
  return Math.trunc(page)
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  const params = slugs.map(({ slug }) => ({ slug: [slug] }))

  const categories = await getBlogCategories()
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

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params
  const segments = slug || []

  if (segments.length === 1) {
    const [first] = segments
    const result = await getPublishedPost({ slug: first })

    if (result.success) {
      return getPostMetadata(result.data.post)
    }

    const decoded = decodeURIComponent(first)
    const categories = await getBlogCategories()

    if (categories.includes(decoded)) {
      const currentPage = normalizePageParam(((await searchParams) || {}).page)
      const categoryMeta = getBlogCategoryMeta(decoded)

      return {
        title: currentPage > 1
          ? `${categoryMeta.label} - Trang ${currentPage} | Blog Tachy`
          : `${categoryMeta.label} | Blog Tachy`,
        description: currentPage > 1
          ? `${categoryMeta.description} Trang ${currentPage} trong archive của ${categoryMeta.label}.`
          : categoryMeta.description,
        alternates: { canonical: `${siteMetadata.siteUrl}${getBlogCategoryHref(decoded, currentPage)}` },
        robots: { index: true, follow: true },
      }
    }

    return {}
  }

  if (segments.length >= 2) {
    const [categoryRaw, ...rest] = segments
    const result = await getPublishedPost({ slug: rest.join("/"), category: categoryRaw })
    if (!result.success) return {}

    return getPostMetadata(result.data.post)
  }

  return {}
}

export default async function BlogCatchAllPage({ params, searchParams }) {
  const { slug } = await params
  const segments = slug || []

  if (segments.length === 1) {
    const [first] = segments
    const result = await getPublishedPost({ slug: first })

    if (result.success) {
      const post = result.data.post
      const relatedResult = await getRelatedPublishedPosts({
        postId: post.id,
        category: post.category,
        tags: post.tags || [],
        limit: 3,
      })
      const related = relatedResult.success ? relatedResult.data.posts : []
      return renderArticlePage(post, related)
    }

    const decoded = decodeURIComponent(first)
    const categories = await getBlogCategories()

    if (categories.includes(decoded)) {
      const currentPage = normalizePageParam(((await searchParams) || {}).page)
      const listResult = await listPublishedPosts({
        category: decoded,
        page: currentPage,
        limit: CATEGORY_ARCHIVE_PAGE_SIZE,
      })

      if (!listResult.success) notFound()
      if (listResult.data.meta.totalPages > 0 && currentPage > listResult.data.meta.totalPages) notFound()

      return renderCategoryPage({
        category: decoded,
        posts: listResult.data.posts,
        meta: listResult.data.meta,
        categories: listResult.data.categories,
        currentPage,
      })
    }

    notFound()
  }

  if (segments.length >= 2) {
    const [categoryRaw, ...rest] = segments
    const result = await getPublishedPost({ slug: rest.join("/"), category: categoryRaw })
    if (!result.success) notFound()

    permanentRedirect(postUrl(result.data.post))
  }

  notFound()
}

async function renderArticlePage(post, related) {
  const parentHref = post.category ? getBlogCategoryHref(post.category) : "/blog"
  const currentHref = postUrl(post)
  const shareUrl = `${siteMetadata.siteUrl}${currentHref}`
  const affiliateProducts = await getAffiliateProductsForArticle(post.content)

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    ...(post.category ? [{ label: formatBlogCategoryLabel(post.category), href: parentHref }] : []),
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
          <div className={`${styles.contentGrid} ${affiliateProducts.length > 0 ? styles.contentGridWithAffiliate : ""}`}>
            <div className={styles.bodyWrap}>
              <ArticleSummary excerpt={post.excerpt} />
              <TableOfContents content={post.content} />
              <ArticleBody content={post.content} />
              {post.tags?.length > 0 && (
                <section className={styles.tagsSection}>
                  <h2 className={styles.tagsHeading}>Tags</h2>
                  <div className={styles.tags}>
                    {post.tags.map((tag) => (
                      <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} className={styles.tag}>
                        {tag}
                      </Link>
                    ))}
                  </div>
                </section>
              )}
              <ShareSection title={post.title} url={shareUrl} />
              <AuthorBox />
            </div>
            <AffiliateProducts products={affiliateProducts} />
          </div>
          <RelatedPosts posts={related} />
          <div className={styles.backWrap}>
            <Link href="/blog" className={styles.backLink}>← Quay lại Blog</Link>
          </div>
        </div>
      </article>
    </>
  )
}

function renderCategoryPage({ category, posts, meta, categories, currentPage }) {
  const categoryMeta = getBlogCategoryMeta(category)
  const firstItemIndex = posts.length > 0 ? ((currentPage - 1) * CATEGORY_ARCHIVE_PAGE_SIZE) + 1 : 0
  const lastItemIndex = posts.length > 0 ? firstItemIndex + posts.length - 1 : 0

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: categoryMeta.label, href: getBlogCategoryHref(category, currentPage) },
  ]

  return (
    <div className={archiveStyles.page}>
      <section className={archiveStyles.hero}>
        <div className={archiveStyles.heroPanel}>
          <div className={archiveStyles.heroContent}>
            <span className={archiveStyles.overline}>Danh mục</span>
            <h1 className={archiveStyles.title}>{categoryMeta.label}</h1>
            <p className={archiveStyles.description}>{categoryMeta.description}</p>

            <div className={archiveStyles.heroMeta}>
              <span className={archiveStyles.metaPill}>{meta.total} bài viết</span>
              <span className={archiveStyles.metaPill}>20 bài mỗi trang</span>
              <span className={archiveStyles.metaPill}>Trang {currentPage} / {Math.max(meta.totalPages, 1)}</span>
              <Link href="/blog" className={archiveStyles.backLink}>Về blog hub</Link>
            </div>
          </div>
        </div>
      </section>

      <div className={archiveStyles.container}>
        <Breadcrumb items={breadcrumbItems} />

        <nav className={archiveStyles.categoryRail} aria-label="Các category khác của blog">
          {categories.map((item) => (
            <Link
              key={item}
              href={getBlogCategoryHref(item)}
              className={`${archiveStyles.categoryChip} ${item === category ? archiveStyles.categoryChipActive : ""}`}
            >
              {formatBlogCategoryLabel(item)}
            </Link>
          ))}
        </nav>

        <div className={archiveStyles.resultsBar} aria-live="polite">
          <div className={archiveStyles.resultsMeta}>
            <p className={archiveStyles.resultsCount}>{meta.total} bài trong category này</p>
            <p className={archiveStyles.resultsSummary}>
              {posts.length > 0
                ? `Đang hiển thị bài ${firstItemIndex} - ${lastItemIndex} trong tổng số ${meta.total} bài mới nhất.`
                : "Category này hiện chưa có bài viết hiển thị."}
            </p>
          </div>
        </div>

        <PostGrid
          posts={posts}
          mobileCompact
          imageSizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
        />

        {meta.totalPages > 1 && (
          <nav className={archiveStyles.pagination} aria-label="Phân trang category blog">
            {currentPage > 1 && (
              <Link href={getBlogCategoryHref(category, currentPage - 1)} className={archiveStyles.pageNav}>
                Trước
              </Link>
            )}

            {Array.from({ length: meta.totalPages }, (_, index) => index + 1).map((pageNumber) => (
              pageNumber === currentPage ? (
                <span key={pageNumber} className={archiveStyles.pageCurrent} aria-current="page">
                  {pageNumber}
                </span>
              ) : (
                <Link key={pageNumber} href={getBlogCategoryHref(category, pageNumber)} className={archiveStyles.pageLink}>
                  {pageNumber}
                </Link>
              )
            ))}

            {currentPage < meta.totalPages && (
              <Link href={getBlogCategoryHref(category, currentPage + 1)} className={archiveStyles.pageNav}>
                Sau
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  )
}
