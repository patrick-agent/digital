import Link from "next/link"
import { Suspense } from "react"
import { listPublicProducts } from "@/lib/shop/public-catalog"
import { buildShopHref, SHOP_PRICE_RANGE_LABELS, SHOP_SORT_LABELS } from "@/lib/shop/query"
import { buildPageMetadata, defaultRobots, siteMetadata } from "@/lib/seo"
import ProductCard from "@/components/shop/ProductCard"
import FilterSelect from "./FilterSelect"
import cardStyles from "./shop-card.module.css"
import styles from "./shop.module.css"

export const revalidate = 300

const SHOP_TITLE = "Shop Home Studio Gear | Audio Interface, Mic & Monitor | Tachy"
const SHOP_DESCRIPTION = "Khám phá gear home studio do Tachy chọn lọc: audio interface, micro, tai nghe, loa kiểm âm, SSD và phụ kiện cho producer."

function normalizeSearchParam(value) {
  return typeof value === "string" ? value : ""
}

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {}
  const category = normalizeSearchParam(resolvedSearchParams.category)
  const priceRange = normalizeSearchParam(resolvedSearchParams.priceRange)
  const sort = normalizeSearchParam(resolvedSearchParams.sort)
  const q = normalizeSearchParam(resolvedSearchParams.q)
  const hasFilters = Boolean(category || priceRange || sort || q)

  return {
    ...buildPageMetadata({
      title: SHOP_TITLE,
      description: SHOP_DESCRIPTION,
      path: "/shop",
      keywords: ["shop home studio", "audio interface", "micro thu âm", "loa kiểm âm", "tai nghe studio", "Tachy"],
    }),
    robots: hasFilters ? { ...defaultRobots, index: false } : defaultRobots,
  }
}

function buildShopCollectionSchema(products, totalCount) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: SHOP_TITLE,
    description: SHOP_DESCRIPTION,
    url: `${siteMetadata.siteUrl}/shop`,
    inLanguage: "vi-VN",
    isPartOf: {
      "@type": "WebSite",
      name: siteMetadata.title,
      url: siteMetadata.siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalCount || products.length,
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
    },
  }
}

function getActiveFilters({ category, priceRange, sort, q }) {
  return [
    category ? `Danh mục: ${category}` : null,
    priceRange && SHOP_PRICE_RANGE_LABELS[priceRange]
      ? `Giá: ${SHOP_PRICE_RANGE_LABELS[priceRange]}`
      : null,
    sort && SHOP_SORT_LABELS[sort] ? `Sắp xếp: ${SHOP_SORT_LABELS[sort]}` : null,
    q ? `Từ khóa: “${q}”` : null,
  ].filter(Boolean)
}

export default async function ShopPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {}
  const category = normalizeSearchParam(resolvedSearchParams.category)
  const priceRange = normalizeSearchParam(resolvedSearchParams.priceRange)
  const sort = normalizeSearchParam(resolvedSearchParams.sort)
  const q = normalizeSearchParam(resolvedSearchParams.q)

  let products = []
  let categories = []
  let totalCount = 0
  let catalogError = ""

  try {
    const result = await listPublicProducts({ category, priceRange, sort, q })

    if (result.success) {
      products = result.data.products
      categories = result.data.categories
      totalCount = result.data.totalCount
    } else {
      catalogError = result.error.message
    }
  } catch (error) {
    console.error("Error loading products:", error)
    catalogError = "Không thể tải catalog shop lúc này."
  }

  const activeFilters = getActiveFilters({ category, priceRange, sort, q })
  const hasFilters = activeFilters.length > 0

  const shopCollectionJsonLd = buildShopCollectionSchema(products, totalCount)

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shopCollectionJsonLd).replace(/</g, "\\u003c") }}
      />

      <section className={styles.hero}>
        <div className={styles.heroPanel}>
          <span className={styles.overline}>Tachy Curates</span>
          <h1 className={styles.title}>Shop Home Studio</h1>
          <p className={styles.subtitle}>
            33 món gear, phụ kiện và storage dành cho producer, creator và home studio.
            Mỗi sản phẩm đều có giá tham khảo, góc nhìn thực tế và link affiliate minh bạch.
          </p>

          <div className={styles.heroStats}>
            <div>
              <span className={styles.heroStatValue}>{totalCount || products.length}</span>
              <span className={styles.heroStatLabel}>Sản phẩm đang mở</span>
            </div>
            <div>
              <span className={styles.heroStatValue}>{categories.length}</span>
              <span className={styles.heroStatLabel}>Danh mục rõ ràng</span>
            </div>
            <div>
              <span className={styles.heroStatValue}>Minh bạch</span>
              <span className={styles.heroStatLabel}>Giá tham khảo & affiliate</span>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <nav className={cardStyles.categoryRail} aria-label="Lọc shop theo danh mục">
          <Link
            href={buildShopHref(resolvedSearchParams, { category: "" })}
            className={`${cardStyles.categoryChip} ${!category ? cardStyles.categoryChipActive : ""}`}
          >
            Tất cả
          </Link>
          {categories.map((item) => (
            <Link
              key={item}
              href={buildShopHref(resolvedSearchParams, { category: item })}
              className={`${cardStyles.categoryChip} ${category === item ? cardStyles.categoryChipActive : ""}`}
            >
              {item}
            </Link>
          ))}
        </nav>
      )}

      <Suspense fallback={<div className={styles.filterBar}><p className={cardStyles.empty}>Đang tải bộ lọc…</p></div>}>
        <FilterSelect />
      </Suspense>

      <div className={styles.filterDivider} />

      <div className={styles.resultsBar} aria-live="polite">
        <div className={styles.resultsMeta}>
          <p className={styles.resultsCount}>{products.length} sản phẩm phù hợp</p>
          <p className={styles.resultsSummary}>
            {hasFilters
              ? activeFilters.join(" · ")
              : "Đang hiển thị toàn bộ catalog shop do Tachy chọn lọc cho workflow thu, mix và sản xuất tại nhà."}
          </p>
        </div>
        {hasFilters && (
          <Link href="/shop" className={styles.clearFilters}>
            Xóa bộ lọc
          </Link>
        )}
      </div>

      <section className={cardStyles.gridSection}>
        {products.length === 0 ? (
          <p className={cardStyles.empty}>
            {catalogError || "Chưa có sản phẩm phù hợp với bộ lọc hiện tại. Hãy thử nới rộng tiêu chí tìm kiếm."}
          </p>
        ) : (
          <div className={cardStyles.grid}>
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
