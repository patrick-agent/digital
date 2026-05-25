import Link from "next/link"
import { readProducts } from "@/lib/db"
import styles from "./shop.module.css"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Shop — Tachy Artist",
  description:
    "Discover recommended gear, tools, and essentials curated by Tachy. Each product includes an affiliate link — supporting the artist at no extra cost to you.",
  openGraph: {
    title: "Shop — Tachy Artist",
    description: "Curated gear & tools recommended by Tachy.",
    type: "website",
  },
}

function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, "").trim() || ""
}

function formatPrice(price, currency) {
  const symbols = { USD: "$", EUR: "\u20ac", VND: "\u20ab" }
  const sym = symbols[currency] || currency + " "
  if (currency === "VND") return sym + Number(price).toLocaleString("vi-VN")
  return sym + Number(price).toFixed(2)
}

function getCategories(products) {
  const cats = [...new Set(products.map((p) => p.category).filter(Boolean))]
  return cats.sort()
}

export default async function ShopPage() {
  const { data: products } = await readProducts({ status: "active" })
  const categories = getCategories(products)

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tachy Artist Shop",
    description: "Curated gear, tools, and essentials recommended by Tachy.",
    url: "https://tachyartist.com/shop",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        url: `https://tachyartist.com/shop/${p.slug}`,
        category: p.category,
        offers: p.price
          ? {
              "@type": "Offer",
              price: p.price,
              priceCurrency: p.currency || "USD",
              url: p.affiliateUrl || `https://tachyartist.com/shop/${p.slug}`,
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
        <nav className={styles.filters} aria-label="Filter by category">
          {categories.map((cat) => (
            <a
              key={cat}
              href={`?category=${encodeURIComponent(cat)}`}
              className={styles.filterBtn}
            >
              {cat}
            </a>
          ))}
        </nav>
      )}

      <section className={styles.gridSection}>
        {products.length === 0 ? (
          <p className={styles.empty}>No products available yet. Check back soon!</p>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <article key={product.id} className={styles.card}>
                <Link href={`/shop/${product.slug}`} className={styles.cardImageWrap}>
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className={styles.cardImage}
                      loading="lazy"
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
