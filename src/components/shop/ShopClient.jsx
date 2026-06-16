"use client"

import { startTransition, useDeferredValue, useEffect, useEffectEvent, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import Breadcrumb from "@/components/blog/Breadcrumb"
import CategoryNav from "@/components/blog/CategoryNav"
import { stripHtml } from "@/lib/shop/presentation"
import {
  SHOP_PRICE_RANGES,
  SHOP_PRICE_RANGE_LABELS,
  SHOP_SORT_OPTIONS,
  SHOP_SORT_LABELS,
} from "@/lib/shop/query"
import ProductShelf from "./ProductShelf"
import styles from "./ShopClient.module.css"

const PRODUCT_PREVIEW_LIMIT = 3

function normalizeSearchValue(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function parsePriceRange(priceRange) {
  if (!priceRange) return null

  const [minRaw, maxRaw] = priceRange.split("-")
  const min = Number(minRaw) || 0
  const max = maxRaw ? Number(maxRaw) : Number.POSITIVE_INFINITY

  return { min, max }
}

function matchesSearch(product, query) {
  if (!query) return true

  const haystack = normalizeSearchValue([
    product.name,
    product.brand,
    product.category,
    stripHtml(product.description),
    ...(product.tags || []),
  ].filter(Boolean).join(" "))

  return haystack.includes(query)
}

function sortProducts(products, sort) {
  const sortedProducts = [...products]

  if (sort === "price-asc") {
    sortedProducts.sort((left, right) => left.price - right.price)
  } else if (sort === "price-desc") {
    sortedProducts.sort((left, right) => right.price - left.price)
  } else if (sort === "name-asc") {
    sortedProducts.sort((left, right) => (left.name || "").localeCompare(right.name || "", "vi"))
  } else if (sort === "name-desc") {
    sortedProducts.sort((left, right) => (right.name || "").localeCompare(left.name || "", "vi"))
  }

  return sortedProducts
}

function buildCategorySummary(category, count) {
  return `${count} lựa chọn trong nhóm ${category}, đủ để so nhanh theo nhu cầu thu âm, mix và setup home studio.`
}

function getCategorySectionId(category) {
  return `shop-category-${normalizeSearchValue(category).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`
}

export default function ShopClient({
  initialProducts,
  categories,
  catalogError = "",
  initialActiveCategory = null,
  initialPriceRange = "",
  initialSort = "",
  initialSearchQuery = "",
}) {
  const [activeCategory, setActiveCategory] = useState(initialActiveCategory)
  const [priceRange, setPriceRange] = useState(initialPriceRange)
  const [sort, setSort] = useState(initialSort)
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const reducedMotion = useReducedMotion()
  const pathname = usePathname()
  const deferredQuery = useDeferredValue(searchQuery)

  const normalizedQuery = useMemo(() => normalizeSearchValue(deferredQuery.trim()), [deferredQuery])

  const totalCategoryCounts = useMemo(() => {
    const counts = {}

    for (const category of categories) {
      counts[category] = 0
    }

    for (const product of initialProducts) {
      if (!product.category || !Object.hasOwn(counts, product.category)) continue
      counts[product.category] += 1
    }

    return counts
  }, [categories, initialProducts])

  const hasActiveFilters = Boolean(activeCategory || priceRange || sort || normalizedQuery)

  const sections = useMemo(() => {
    const grouped = new Map(categories.map((category) => [category, []]))
    const numericRange = parsePriceRange(priceRange)

    for (const product of initialProducts) {
      if (!product.category || !grouped.has(product.category)) continue
      if (activeCategory && product.category !== activeCategory) continue
      if (numericRange && (product.price < numericRange.min || product.price > numericRange.max)) continue
      if (!matchesSearch(product, normalizedQuery)) continue
      grouped.get(product.category).push(product)
    }

    return categories
      .map((category) => {
        const products = sortProducts(grouped.get(category) || [], sort)
        const previewProducts = hasActiveFilters ? products : products.slice(0, PRODUCT_PREVIEW_LIMIT)

        return {
          category,
          products,
          previewProducts,
          description: buildCategorySummary(category, products.length),
        }
      })
      .filter((section) => section.products.length > 0)
  }, [activeCategory, categories, hasActiveFilters, initialProducts, normalizedQuery, priceRange, sort])

  const matchingProductCount = useMemo(() => {
    return sections.reduce((total, section) => total + section.products.length, 0)
  }, [sections])

  const previewProductCount = useMemo(() => {
    return sections.reduce((total, section) => total + section.previewProducts.length, 0)
  }, [sections])

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
  ]

  const handleCategoryChange = (category) => {
    startTransition(() => {
      setActiveCategory(category)
    })
  }

  const handlePriceRangeChange = (event) => {
    const nextValue = event.target.value

    startTransition(() => {
      setPriceRange(nextValue)
    })
  }

  const handleSortChange = (event) => {
    const nextValue = event.target.value

    startTransition(() => {
      setSort(nextValue)
    })
  }

  const handleSearchChange = (event) => {
    const nextValue = event.target.value

    startTransition(() => {
      setSearchQuery(nextValue)
    })
  }

  const handleClearSearch = () => {
    startTransition(() => {
      setSearchQuery("")
    })
  }

  const handleSectionAction = (category) => {
    startTransition(() => {
      setActiveCategory((currentCategory) => (currentCategory === category ? null : category))
    })
  }

  const clearFilters = () => {
    startTransition(() => {
      setActiveCategory(null)
      setPriceRange("")
      setSort("")
      setSearchQuery("")
    })
  }

  const syncUrlState = useEffectEvent((nextCategory, nextPriceRange, nextSort, nextQuery) => {
    if (typeof window === "undefined") return

    const params = new URLSearchParams(window.location.search)
    const trimmedQuery = nextQuery.trim()

    if (nextCategory) {
      params.set("category", nextCategory)
    } else {
      params.delete("category")
    }

    if (nextPriceRange) {
      params.set("priceRange", nextPriceRange)
    } else {
      params.delete("priceRange")
    }

    if (nextSort) {
      params.set("sort", nextSort)
    } else {
      params.delete("sort")
    }

    if (trimmedQuery) {
      params.set("q", trimmedQuery)
    } else {
      params.delete("q")
    }

    const nextSearch = params.toString()
    const nextUrl = nextSearch ? `${pathname}?${nextSearch}` : pathname
    const currentUrl = `${window.location.pathname}${window.location.search}`

    if (currentUrl !== nextUrl) {
      window.history.replaceState(window.history.state, "", nextUrl)
    }
  })

  useEffect(() => {
    syncUrlState(activeCategory, priceRange, sort, searchQuery)
  }, [activeCategory, priceRange, searchQuery, sort, syncUrlState])

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbItems} />

      <section className={styles.filterPanel}>
        <div className={styles.filterPanelHeader}>
          <div>
            <span className={styles.overline}>Shop hub</span>
            <h2 className={styles.filterTitle}>Lọc nhanh theo nhu cầu, khoảng giá hoặc đi thẳng vào nhóm gear bạn đang thiếu.</h2>
          </div>
        </div>

        <div className={styles.controlsLayout}>
          <div className={styles.searchRow}>
            <label htmlFor="shop-search" className={styles.searchLabel}>Tìm kiếm theo keyword</label>
            <div className={styles.searchFieldWrap}>
              <input
                id="shop-search"
                type="search"
                name="q"
                autoComplete="off"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Ví dụ: audio interface, condenser, closed-back, SSD..."
                className={styles.searchField}
              />
              {searchQuery && (
                <button type="button" onClick={handleClearSearch} className={styles.clearSearch}>
                  Xóa
                </button>
              )}
            </div>
          </div>

          <div className={styles.selectGrid}>
            <div className={styles.selectGroup}>
              <label htmlFor="shop-price-range" className={styles.searchLabel}>Khoảng giá</label>
              <select
                id="shop-price-range"
                value={priceRange}
                onChange={handlePriceRangeChange}
                className={styles.selectField}
              >
                {SHOP_PRICE_RANGES.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.selectGroup}>
              <label htmlFor="shop-sort" className={styles.searchLabel}>Sắp xếp</label>
              <select
                id="shop-sort"
                value={sort}
                onChange={handleSortChange}
                className={styles.selectField}
              >
                {SHOP_SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <CategoryNav
          categories={categories}
          active={activeCategory}
          counts={totalCategoryCounts}
          onSelect={handleCategoryChange}
          ariaLabel="Lọc shop theo danh mục"
          forceVisible
        />

        <div className={styles.resultsBar} aria-live="polite">
          <div className={styles.resultsMeta}>
            <p className={styles.resultsCount}>{matchingProductCount} sản phẩm phù hợp</p>
            <p className={styles.resultsSummary}>
              {hasActiveFilters
                ? [
                    activeCategory ? `Danh mục: ${activeCategory}` : null,
                    priceRange && SHOP_PRICE_RANGE_LABELS[priceRange] ? `Giá: ${SHOP_PRICE_RANGE_LABELS[priceRange]}` : null,
                    sort && SHOP_SORT_LABELS[sort] ? `Sắp xếp: ${SHOP_SORT_LABELS[sort]}` : null,
                    normalizedQuery ? `Keyword: “${searchQuery.trim()}”` : null,
                  ].filter(Boolean).join(" · ")
                : `Đang hiển thị ${previewProductCount} gear preview trải đều trên ${sections.length} danh mục.`}
            </p>
          </div>

          {hasActiveFilters && (
            <button type="button" onClick={clearFilters} className={styles.resetButton}>
              Xóa bộ lọc
            </button>
          )}
        </div>
      </section>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeCategory || "all"}:${priceRange || "any"}:${sort || "default"}:${normalizedQuery || "browse"}`}
          className={styles.sectionStack}
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {sections.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>
                {catalogError || "Không có sản phẩm phù hợp với bộ lọc hiện tại."}
              </p>
              <p className={styles.empty}>
                {catalogError
                  ? "Catalog shop hiện chưa phản hồi ổn định. Hãy thử tải lại sau ít phút."
                  : "Thử đổi keyword, nới khoảng giá hoặc bỏ filter category để mở lại toàn bộ shop hub."}
              </p>
              {!catalogError && (
                <button type="button" onClick={clearFilters} className={styles.resetButton}>
                  Xem lại toàn bộ shop
                </button>
              )}
            </div>
          ) : (
            sections.map((section) => {
              const isCategoryActive = activeCategory === section.category
              const sectionId = getCategorySectionId(section.category)

              return (
                <section key={section.category} className={styles.categorySection} aria-labelledby={sectionId}>
                  <div className={styles.categorySectionHeader}>
                    <div className={styles.categoryCopy}>
                      <span className={styles.categoryEyebrow}>Danh mục</span>
                      <h3 id={sectionId} className={styles.categoryTitle}>{section.category}</h3>
                      <p className={styles.categorySubtext}>{section.description}</p>
                    </div>

                    <div className={styles.categoryActions}>
                      <p className={styles.categoryStats}>
                        Hiển thị <strong>{section.previewProducts.length}</strong> / <strong>{section.products.length}</strong> sản phẩm phù hợp
                      </p>
                    </div>
                  </div>

                  <ProductShelf
                    products={section.previewProducts}
                    ariaLabel={`Danh mục ${section.category} - vuốt ngang để xem gear preview`}
                    actionLabel={isCategoryActive ? "Bỏ lọc mục này" : "Chỉ xem mục này"}
                    onAction={() => handleSectionAction(section.category)}
                  />
                </section>
              )
            })
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
