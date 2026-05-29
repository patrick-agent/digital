import { siteMetadata } from "@/lib/seo"
import { canonicalUrl } from "@/lib/post-utils"

const DOMAIN = siteMetadata.siteUrl
const AUTHOR_NAME = siteMetadata.author
const SITE_NAME = siteMetadata.title

function absoluteUrl(url) {
  if (!url) return `${DOMAIN}${siteMetadata.defaultImage}`
  return /^https?:\/\//i.test(url) ? url : `${DOMAIN}${url.startsWith("/") ? url : `/${url}`}`
}

export default function ArticleSchema({ post }) {
  const plainText = post.content?.replace(/<[^>]*>/g, "") || ""
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    image: absoluteUrl(post.coverImage),
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: `${DOMAIN}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${DOMAIN}/logo.png`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    keywords: post.seoKeywords?.join(", ") || post.tags?.join(", ") || "",
    articleSection: post.category,
    wordCount: plainText.split(/\s+/).filter(Boolean).length,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${DOMAIN}${canonicalUrl(post)}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  )
}
