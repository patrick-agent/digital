"use client"

import { startTransition, useDeferredValue, useEffect, useEffectEvent, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import BlogHero from "./BlogHero"
import CategoryNav from "./CategoryNav"
import PostShelf from "./PostShelf"
import Breadcrumb from "./Breadcrumb"
import { formatBlogCategoryLabel, getBlogCategoryHref, getBlogCategoryMeta } from "@/lib/blog/category-meta"
import styles from "./BlogClient.module.css"

function normalizeSearchValue(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function matchesSearch(post, query) {
  if (!query) return true

  const haystack = normalizeSearchValue([
    post.title,
    post.excerpt,
    post.category,
    formatBlogCategoryLabel(post.category),
    ...(post.tags || []),
  ].filter(Boolean).join(" "))

  return haystack.includes(query)
}

export default function BlogClient({ initialPosts, categories, featuredPost, initialActiveCategory = null, initialSearchQuery = "" }) {
  const [activeCategory, setActiveCategory] = useState(initialActiveCategory)
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const reducedMotion = useReducedMotion()
  const pathname = usePathname()
  const deferredQuery = useDeferredValue(searchQuery)

  const normalizedQuery = useMemo(() => normalizeSearchValue(deferredQuery), [deferredQuery])

  const categoryLabels = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = formatBlogCategoryLabel(category)
      return acc
    }, {})
  }, [categories])

  const totalCategoryCounts = useMemo(() => {
    const counts = {}

    for (const category of categories) {
      counts[category] = 0
    }

    for (const post of initialPosts) {
      if (!post.category || !Object.hasOwn(counts, post.category)) continue
      counts[post.category] += 1
    }

    return counts
  }, [categories, initialPosts])

  const sections = useMemo(() => {
    const grouped = new Map(categories.map((category) => [category, []]))

    for (const post of initialPosts) {
      if (!post.category || !grouped.has(post.category)) continue
      if (activeCategory && post.category !== activeCategory) continue
      if (!matchesSearch(post, normalizedQuery)) continue
      grouped.get(post.category).push(post)
    }

    return categories
      .map((category) => {
        const posts = grouped.get(category) || []
        const categoryMeta = getBlogCategoryMeta(category)

        return {
          category,
          label: categoryMeta.label,
          description: categoryMeta.description,
          posts,
          previewPosts: posts.slice(0, 10),
        }
      })
      .filter((section) => section.posts.length > 0)
  }, [activeCategory, categories, initialPosts, normalizedQuery])

  const matchingPostCount = useMemo(() => {
    return sections.reduce((total, section) => total + section.posts.length, 0)
  }, [sections])

  const previewPostCount = useMemo(() => {
    return sections.reduce((total, section) => total + section.previewPosts.length, 0)
  }, [sections])

  const hasActiveFilters = Boolean(activeCategory || normalizedQuery)

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ]

  const handleCategoryChange = (category) => {
    startTransition(() => {
      setActiveCategory(category)
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

  const clearFilters = () => {
    startTransition(() => {
      setActiveCategory(null)
      setSearchQuery("")
    })
  }

  const syncUrlState = useEffectEvent((nextCategory, nextQuery) => {
    if (typeof window === "undefined") return

    const params = new URLSearchParams(window.location.search)
    const trimmedQuery = nextQuery.trim()

    if (nextCategory) {
      params.set("category", nextCategory)
    } else {
      params.delete("category")
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
    syncUrlState(activeCategory, searchQuery)
  }, [activeCategory, searchQuery, syncUrlState])

  return (
    <div className={styles.page}>
      <BlogHero
        featuredPost={featuredPost}
        totalPosts={initialPosts.length}
        categoriesCount={categories.length}
      />

      <div className={styles.container}>
        <Breadcrumb items={breadcrumbItems} />

        <section className={styles.filterPanel}>
          <div className={styles.filterPanelHeader}>
            <div>
              <span className={styles.overline}>Blog hub</span>
              <h2 className={styles.filterTitle}>Lọc nhanh theo keyword hoặc đi thẳng vào danh mục bạn cần.</h2>
            </div>
            <p className={styles.filterDescription}>
              Mỗi danh mục bên dưới là 10 bài preview mới nhất. Bấm vào nút <strong>Xem thêm</strong> sẽ mở đầy đủ bài viết của danh mục đó.
            </p>
          </div>

          <div className={styles.searchRow}>
            <label htmlFor="blog-search" className={styles.searchLabel}>Tìm kiếm theo keyword</label>
            <div className={styles.searchFieldWrap}>
              <input
                id="blog-search"
                type="search"
                name="q"
                autoComplete="off"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Ví dụ: mix vocal, audio interface, home studio…"
                className={styles.searchField}
              />
              {searchQuery && (
                <button type="button" onClick={handleClearSearch} className={styles.clearSearch}>
                  Xóa
                </button>
              )}
            </div>
          </div>

          <CategoryNav
            categories={categories}
            active={activeCategory}
            counts={totalCategoryCounts}
            labels={categoryLabels}
            onSelect={handleCategoryChange}
          />

          <div className={styles.resultsBar} aria-live="polite">
            <div className={styles.resultsMeta}>
              <p className={styles.resultsCount}>{matchingPostCount} bài phù hợp</p>
              <p className={styles.resultsSummary}>
                {hasActiveFilters
                  ? [
                      activeCategory ? `Danh mục: ${formatBlogCategoryLabel(activeCategory)}` : null,
                      normalizedQuery ? `Keyword: “${searchQuery.trim()}”` : null,
                    ].filter(Boolean).join(" · ")
                  : `Đang hiển thị ${previewPostCount} bài preview mới nhất trải đều trên ${sections.length} danh mục.`}
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
            key={`${activeCategory || "all"}:${normalizedQuery || "browse"}`}
            className={styles.sectionStack}
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {sections.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>Không có bài viết phù hợp với bộ lọc hiện tại.</p>
                <p className={styles.empty}>Thử đổi keyword hoặc bỏ filter category để mở lại toàn bộ blog hub.</p>
                <button type="button" onClick={clearFilters} className={styles.resetButton}>
                  Xem lại toàn bộ bài viết
                </button>
              </div>
            ) : (
              sections.map((section) => (
                <section key={section.category} className={styles.categorySection} aria-labelledby={`blog-category-${section.category}`}>
                  <div className={styles.categorySectionHeader}>
                    <div className={styles.categoryCopy}>
                      <span className={styles.categoryEyebrow}>Danh mục</span>
                      <h3 id={`blog-category-${section.category}`} className={styles.categoryTitle}>{section.label}</h3>
                      <p className={styles.categorySubtext}>{section.description}</p>
                    </div>

                    <div className={styles.categoryActions}>
                      <p className={styles.categoryStats}>
                        Hiển thị <strong>{section.previewPosts.length}</strong> / <strong>{section.posts.length}</strong> bài phù hợp
                      </p>
                    </div>
                  </div>

                  <PostShelf
                    posts={section.previewPosts}
                    ariaLabel={`Danh mục ${section.label} - vuốt ngang để xem bài viết preview`}
                    archiveHref={getBlogCategoryHref(section.category)}
                  />
                </section>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
