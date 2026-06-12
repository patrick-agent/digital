import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  getPublicProduct,
  getRelatedProducts,
  listPublicProducts,
} from "@/lib/shop/public-catalog"
import {
  formatProductPrice,
  getPrimaryProductImage,
  stripHtml,
} from "@/lib/shop/presentation"
import { buildPageMetadata, defaultRobots, siteMetadata } from "@/lib/seo"
import ProductCard from "@/components/shop/ProductCard"
import cardStyles from "@/app/shop/shop-card.module.css"
import styles from "@/app/shop/shop.module.css"

export const revalidate = 300

export async function generateStaticParams() {
  const result = await listPublicProducts({ limit: 1000 })
  if (!result.success) return []
  return result.data.products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const result = await getPublicProduct({ slug })
  const product = result.success ? result.data.product : null

  if (!product) {
    return { title: "Không tìm thấy sản phẩm | Tachy" }
  }

  const title = product.seoTitle || `${product.name} | Shop Home Studio Tachy`
  const description =
    product.seoDescription ||
    stripHtml(product.description).slice(0, 160) ||
    `Xem giá tham khảo, đặc điểm nổi bật và lý do Tachy gợi ý ${product.name}.`

  return {
    ...buildPageMetadata({
      title,
      description,
      path: `/shop/${product.slug}`,
      image: product.images?.[0],
      keywords: [product.name, product.category, product.brand, ...(product.tags || [])].filter(Boolean),
    }),
    robots: defaultRobots,
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params
  const productResult = await getPublicProduct({ slug })
  const product = productResult.success ? productResult.data.product : null

  if (!product) {
    notFound()
  }

  const relatedResult = await getRelatedProducts({
    productId: product.id,
    category: product.category,
    limit: 3,
  })
  const related = relatedResult.success ? relatedResult.data.products : []

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: stripHtml(product.description),
    image: getPrimaryProductImage(product) || undefined,
    category: product.category || undefined,
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand,
        }
      : undefined,
    url: `${siteMetadata.siteUrl}/shop/${product.slug}`,
    inLanguage: "vi-VN",
    mainEntityOfPage: `${siteMetadata.siteUrl}/shop/${product.slug}`,
    offers: product.price > 0
      ? {
          "@type": "Offer",
          price: product.price,
          priceCurrency: product.currency || "USD",
          url: product.affiliateUrl || `${siteMetadata.siteUrl}/shop/${product.slug}`,
          availability: "https://schema.org/InStock",
          priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        }
      : undefined,
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteMetadata.siteUrl },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${siteMetadata.siteUrl}/shop` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${siteMetadata.siteUrl}/shop/${product.slug}` },
    ],
  }

  const faqJsonLd = product.faq?.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: product.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: stripHtml(item.answer),
          },
        })),
      }
    : null

  return (
    <div className={styles.detailPage}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <Link href="/shop" className={styles.backLink}>
        &larr; Quay lại shop
      </Link>

      <div className={styles.detailGrid}>
        <div className={styles.detailMedia}>
          <div className={styles.detailImageWrap}>
            {getPrimaryProductImage(product) ? (
              <Image
                src={getPrimaryProductImage(product)}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.detailImage}
              />
            ) : (
              <div className={cardStyles.imageFallback}>Chưa có ảnh</div>
            )}
          </div>
        </div>

        <div className={styles.detailInfo}>
          {(product.category || product.brand) && (
            <div className={styles.detailMetaRow}>
              {product.category && (
                <span className={styles.detailCategory}>{product.category}</span>
              )}

              {product.brand && (
                <span className={styles.detailBrand}>{product.brand}</span>
              )}
            </div>
          )}

          <h1 className={styles.detailName}>{product.name}</h1>

          {product.price > 0 && (
            <span className={styles.detailPrice}>
              {formatProductPrice(product.price, product.currency)}
            </span>
          )}

          {product.priceNote && (
            <span className={styles.priceNote}>{product.priceNote}</span>
          )}

          {product.description && (
            <div className={styles.detailDesc} dangerouslySetInnerHTML={{ __html: product.description }} />
          )}

          {product.tags?.length > 0 && (
            <div className={styles.detailTags}>
              {product.tags.map((tag) => (
                <span key={tag} className={styles.detailTag}>#{tag}</span>
              ))}
            </div>
          )}

          <div className={styles.detailActions}>
            {product.affiliateUrl ? (
              <>
                <a href={product.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" className={styles.affiliateBtn}>
                  Mua qua Shopee
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
                <p className={styles.affiliateDisclosure}>
                  Link affiliate giúp hỗ trợ Tachy mà không làm tăng giá bạn phải trả.
                </p>
              </>
            ) : (
              <span className={styles.mutedNote}>
                Hiện chưa có link mua phù hợp cho sản phẩm này.
              </span>
            )}
          </div>
        </div>
      </div>

      {product.features?.length > 0 && (
        <section className={styles.contentSection}>
          <div className={styles.sectionDivider} />
          <h2 className={styles.sectionTitle}>Điểm Nổi Bật</h2>
          <ul className={styles.featuresList}>
            {product.features.map((feature, i) => (
              <li key={i} className={styles.featureItem}>{feature}</li>
            ))}
          </ul>
        </section>
      )}

      {product.whyRecommend && (
        <section className={styles.contentSection}>
          <div className={styles.sectionDivider} />
          <h2 className={styles.sectionTitle}>Vì Sao Tachy Gợi Ý Món Này</h2>
          <div className={styles.recommendContent} dangerouslySetInnerHTML={{ __html: product.whyRecommend }} />
        </section>
      )}

      {product.faq?.length > 0 && (
        <section className={styles.contentSection}>
          <div className={styles.sectionDivider} />
          <h2 className={styles.sectionTitle}>Câu Hỏi Thường Gặp</h2>
          <div className={styles.faqList}>
            {product.faq.map((item, i) => (
              <details key={i} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{item.question}</summary>
                <div className={styles.faqAnswer} dangerouslySetInnerHTML={{ __html: item.answer }} />
              </details>
            ))}
          </div>
        </section>
      )}

      {product.relatedArticles?.length > 0 && (
        <section className={styles.contentSection}>
          <div className={styles.sectionDivider} />
          <h2 className={styles.sectionTitle}>Bài Viết Liên Quan</h2>
          <ul className={styles.relatedArticlesList}>
            {product.relatedArticles.map((article, i) => (
              <li key={i}>
                <Link href={`/blog/${article.slug}`} className={styles.relatedArticleLink}>
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.sectionDivider} />
          <h2 className={styles.sectionTitle}>Sản Phẩm Liên Quan</h2>
          <div className={cardStyles.grid}>
            {related.map((rp, index) => (
              <ProductCard
                key={rp.id}
                product={rp}
                headingLevel="h3"
                excerptLength={120}
                compact={true}
                imageSizes="(max-width: 768px) 100vw, 33vw"
                index={index}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
