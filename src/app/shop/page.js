import { listPublicProducts } from "@/lib/shop/public-catalog"
import { SHOP_PRICE_RANGE_LABELS, SHOP_SORT_LABELS } from "@/lib/shop/query"
import { buildPageMetadata, defaultRobots, siteMetadata } from "@/lib/seo"
import ShopClient from "@/components/shop/ShopClient"
import styles from "./shop.module.css"

export const revalidate = 300

const SHOP_TITLE = "Shop Home Studio Gear | Audio Interface, Mic & Monitor | Tachy"
const SHOP_DESCRIPTION = "Khám phá gear home studio do Tachy chọn lọc: audio interface, micro, tai nghe, loa kiểm âm, SSD và phụ kiện cho producer."

function normalizeSearchParam(value) {
  return typeof value === "string" ? value.trim() : ""
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

function normalizeSelectValue(value, labels) {
  return value && Object.hasOwn(labels, value) ? value : ""
}

export default async function ShopPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {}
  const category = normalizeSearchParam(resolvedSearchParams.category)
  const priceRange = normalizeSelectValue(normalizeSearchParam(resolvedSearchParams.priceRange), SHOP_PRICE_RANGE_LABELS)
  const sort = normalizeSelectValue(normalizeSearchParam(resolvedSearchParams.sort), SHOP_SORT_LABELS)
  const q = normalizeSearchParam(resolvedSearchParams.q)

  let products = []
  let categories = []
  let totalCount = 0
  let catalogError = ""

  try {
    const result = await listPublicProducts()

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

  const initialActiveCategory = categories.includes(category) ? category : null

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

      <ShopClient
        initialProducts={products}
        categories={categories}
        catalogError={catalogError}
        initialActiveCategory={initialActiveCategory}
        initialPriceRange={priceRange}
        initialSort={sort}
        initialSearchQuery={q}
      />
    </div>
  )
}
