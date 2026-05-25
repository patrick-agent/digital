import Link from "next/link"
import { notFound } from "next/navigation"
import { readProducts, readProduct } from "@/lib/db"
import styles from "@/app/shop/shop.module.css"

export const dynamic = "force-dynamic"

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, "").trim() || ""
}

function formatPrice(price, currency) {
  const symbols = { USD: "$", EUR: "\u20ac", VND: "\u20ab" }
  const sym = symbols[currency] || currency + " "
  if (currency === "VND") return sym + Number(price).toLocaleString("vi-VN")
  return sym + Number(price).toFixed(2)
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await readProduct(slug)

  if (!product) {
    return { title: "Product Not Found — Tachy Artist" }
  }

  const title = product.seoTitle || `${product.name} — Tachy Artist Shop`
  const description =
    product.seoDescription ||
    stripHtml(product.description).slice(0, 160) ||
    `Buy ${product.name} recommended by Tachy.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params
  const product = await readProduct(slug)

  if (!product || product.status !== "active") {
    notFound()
  }

  const { data: allProducts } = await readProducts({ status: "active" })
  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3)

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: stripHtml(product.description),
    image: product.images?.[0] || undefined,
    category: product.category || undefined,
    url: `https://tachyartist.com/shop/${product.slug}`,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "USD",
      url: product.affiliateUrl || `https://tachyartist.com/shop/${product.slug}`,
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://tachyartist.com" },
      { "@type": "ListItem", position: 2, name: "Shop", item: "https://tachyartist.com/shop" },
      { "@type": "ListItem", position: 3, name: product.name },
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
            text: item.answer,
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
        &larr; Back to Shop
      </Link>

      {/* ─── Hero ─── */}
      <div className={styles.detailGrid}>
        <div className={styles.detailImageWrap}>
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className={styles.detailImage} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "var(--fs-sm)", fontFamily: "var(--font-mono)" }}>
              no image
            </div>
          )}
        </div>

        <div className={styles.detailInfo}>
          {product.category && (
            <span className={styles.detailCategory}>{product.category}</span>
          )}

          <h1 className={styles.detailName}>{product.name}</h1>

          {product.price > 0 && (
            <span className={styles.detailPrice}>
              {formatPrice(product.price, product.currency)}
            </span>
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
                  Buy on Shopee
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
                <span className={styles.affiliateDisclosure}>
                  As an affiliate, I earn from qualifying purchases at no extra cost to you.
                </span>
              </>
            ) : (
              <span style={{ color: "var(--text-muted)", fontSize: "var(--fs-sm)" }}>
                This product is currently not available for purchase.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ─── Key Features ─── */}
      {product.features?.length > 0 && (
        <section className={styles.contentSection}>
          <div className={styles.sectionDivider} />
          <h2 className={styles.sectionTitle}>Key Features</h2>
          <ul className={styles.featuresList}>
            {product.features.map((feature, i) => (
              <li key={i} className={styles.featureItem}>{feature}</li>
            ))}
          </ul>
        </section>
      )}

      {/* ─── Why Tachy Recommends ─── */}
      {product.whyRecommend && (
        <section className={styles.contentSection}>
          <div className={styles.sectionDivider} />
          <h2 className={styles.sectionTitle}>Why Tachy Recommends This</h2>
          <div className={styles.recommendContent} dangerouslySetInnerHTML={{ __html: product.whyRecommend }} />
        </section>
      )}

      {/* ─── FAQ ─── */}
      {product.faq?.length > 0 && (
        <section className={styles.contentSection}>
          <div className={styles.sectionDivider} />
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {product.faq.map((item, i) => (
              <details key={i} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{item.question}</summary>
                <p className={styles.faqAnswer}>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ─── Related Products ─── */}
      {related.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.sectionDivider} />
          <h2 className={styles.sectionTitle}>Related Products</h2>
          <div className={styles.grid}>
            {related.map((rp) => (
              <article key={rp.id} className={styles.card}>
                <Link href={`/shop/${rp.slug}`} className={styles.cardImageWrap}>
                  {rp.images?.[0] ? (
                    <img src={rp.images[0]} alt={rp.name} className={styles.cardImage} loading="lazy" />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "var(--fs-sm)", fontFamily: "var(--font-mono)" }}>
                      no image
                    </div>
                  )}
                </Link>
                <div className={styles.cardBody}>
                  {rp.category && <span className={styles.cardCategory}>{rp.category}</span>}
                  <h3 className={styles.cardName}>
                    <Link href={`/shop/${rp.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {rp.name}
                    </Link>
                  </h3>
                  <p className={styles.cardExcerpt}>{stripHtml(rp.description).slice(0, 120)}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>{formatPrice(rp.price, rp.currency)}</span>
                    {rp.affiliateUrl ? (
                      <a href={rp.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" className={`${styles.cardLink} ${styles.affiliateBtnSmall}`}>
                        Buy Now
                      </a>
                    ) : (
                      <Link href={`/shop/${rp.slug}`} className={`${styles.cardLink} ${styles.affiliateBtnSmall}`}>
                        View
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
