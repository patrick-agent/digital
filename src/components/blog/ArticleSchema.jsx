import { siteMetadata } from "@/lib/seo"

const DOMAIN = siteMetadata.siteUrl
const AUTHOR_NAME = siteMetadata.author
const SITE_NAME = siteMetadata.title

export default function ArticleSchema({ post }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage,
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
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${DOMAIN}/blog/${post.category}/${post.slug}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
