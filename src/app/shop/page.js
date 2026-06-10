import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { readProducts } from "@/lib/db"
import { siteMetadata } from "@/lib/seo"
import FilterSelect from "./FilterSelect"
import styles from "./shop.module.css"

export const revalidate = 300

export const metadata = {
  title: "Shop — Tachy Artist",
  description:
    "Discover recommended gear, tools, and essentials curated by Tachy. Each product includes an affiliate link — supporting the artist at no extra cost to you.",
  openGraph: {
    title: "Shop — Tachy Artist",
    description: "Curated gear & tools recommended by Tachy.",
    type: "website",
  },
  alternates: {
    canonical: `${siteMetadata.siteUrl}/shop`,
  },
}

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, "").trim() || ""
}

function formatPrice(price, currency) {
  const symbols = { USD: "$", EUR: "\u20ac" }
  const sym = symbols[currency] || currency + " "
  if (currency === "VND") return Number(price).toLocaleString("vi-VN") + " VNĐ"
  return sym + Number(price).toFixed(2)
}

function getCategories(products) {
  const cats = [...new Set(products.map((p) => p.category).filter(Boolean))]
  return cats.sort()
}

export default async function ShopPage({ searchParams }) {
  const { category, priceRange, sort, q } = await searchParams || {}

  let products = []
  try {
    const { data } = await readProducts({ status: "active" })
    products = data || []
  } catch (error) {
    console.error("Error loading products:", error)
    products = []
  }

  const categories = getCategories(products)

  // ── Category filter ──
  if (category && category !== "all") {
    products = products.filter((p) => p.category === category)
  }

  // ── Price range filter ──
  if (priceRange) {
    const [minStr, maxStr] = priceRange.split("-")
    const min = minStr ? Number(minStr) : 0
    const max = maxStr ? Number(maxStr) : Infinity
    products = products.filter((p) => p.price >= min && p.price <= max)
  }

  // ── Search ──
  if (q) {
    const kw = q.toLowerCase()
    products = products.filter((p) => {
      return (
        p.name?.toLowerCase().includes(kw) ||
        p.brand?.toLowerCase().includes(kw) ||
        p.category?.toLowerCase().includes(kw) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(kw))) ||
        stripHtml(p.description).toLowerCase().includes(kw)
      )
    })
  }

  // ── Sort ──
  if (sort === "price-asc") {
    products.sort((a, b) => a.price - b.price)
  } else if (sort === "price-desc") {
    products.sort((a, b) => b.price - a.price)
  } else if (sort === "name-asc") {
    products.sort((a, b) => (a.name || "").localeCompare(b.name || "vi"))
  } else if (sort === "name-desc") {
    products.sort((a, b) => (b.name || "").localeCompare(a.name || "vi"))
  }

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tachy Artist Shop",
    description: "Curated gear, tools, and essentials recommended by Tachy.",
    url: `${siteMetadata.siteUrl}/shop`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        url: `${siteMetadata.siteUrl}/shop/${p.slug}`,
        category: p.category,
        offers: p.price
          ? {
              "@type": "Offer",
              price: p.price,
              priceCurrency: p.currency || "USD",
              url: p.affiliateUrl || `${siteMetadata.siteUrl}/shop/${p.slug}`,
            }
          : undefined,
      },
    })),
  }

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <section className={styles.hero}>
        <span className={styles.overline}>Tachy Recommends</span>
        <h1 className={styles.title}>Shop</h1>
        <p className={styles.subtitle}>
          Gear, tools, and essentials I personally use and recommend. Every
          purchase through these affiliate links supports my work — at no extra
          cost to you.
        </p>
      </section>

      {categories.length > 1 && (
        <Suspense fallback={<div className={styles.filterBar}><p className={styles.empty}>Loading filters…</p></div>}>
          <FilterSelect categories={categories} />
        </Suspense>
      )}

      <div className={styles.filterDivider} />

      <section className={styles.gridSection}>
        {products.length === 0 ? (
          <p className={styles.empty}>No products available yet. Check back soon!</p>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <article key={product.id} className={styles.card}>
                <Link href={`/shop/${product.slug}`} className={styles.cardImageWrap}>
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.cardImage}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--text-muted)",
                        fontSize: "var(--fs-sm)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      no image
                    </div>
                  )}
                </Link>
                <div className={styles.cardBody}>
                  {product.category && (
                    <span className={styles.cardCategory}>{product.category}</span>
                  )}
                  <h2 className={styles.cardName}>
                    <Link href={`/shop/${product.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                      {product.name}
                    </Link>
                  </h2>
                  <p className={styles.cardExcerpt}>
                    {stripHtml(product.description).slice(0, 150)}
                  </p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>
                      {formatPrice(product.price, product.currency)}
                    </span>
                    {product.affiliateUrl ? (
                      <a
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className={styles.cardLink}
                        data-no-nav="true"
                      >
                        Buy Now
                      </a>
                    ) : (
                      <Link
                        href={`/shop/${product.slug}`}
                        className={styles.cardLink}
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
