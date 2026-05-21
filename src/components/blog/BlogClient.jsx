"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import BlogHero from "./BlogHero"
import CategoryNav from "./CategoryNav"
import PostGrid from "./PostGrid"
import Breadcrumb from "./Breadcrumb"
import styles from "./BlogClient.module.css"

const POSTS_PER_PAGE = 9

export default function BlogClient({ initialPosts, categories, featuredPost, totalPosts, initialActiveCategory = null, pageTitle }) {
  const [activeCategory, setActiveCategory] = useState(initialActiveCategory)
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)

  const filteredPosts = useMemo(() => {
    if (!activeCategory) return initialPosts
    return initialPosts.filter((p) => p.category === activeCategory)
  }, [initialPosts, activeCategory])

  const displayedPosts = filteredPosts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPosts.length

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setVisibleCount(POSTS_PER_PAGE)
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + POSTS_PER_PAGE)
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    ...(initialActiveCategory ? [{ label: initialActiveCategory, href: `/blog/${initialActiveCategory}` }] : []),
  ]

  return (
    <div className={styles.page}>
      {pageTitle ? (
        <div className={styles.categoryHeader}>
          <h1 className={styles.categoryTitle}>{pageTitle}</h1>
          <p className={styles.categorySubtext}>
            Articles filed under <strong>{activeCategory || initialActiveCategory}</strong>
          </p>
          <div className={styles.divider} />
        </div>
      ) : (
        <BlogHero featuredPost={featuredPost} />
      )}

      <div className={styles.container}>
        <Breadcrumb items={breadcrumbItems} />

        <CategoryNav
          categories={categories}
          active={activeCategory}
          onSelect={handleCategoryChange}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory || "all"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PostGrid posts={displayedPosts} />

            {displayedPosts.length === 0 && (
              <p className={styles.empty}>
                No posts found in this category.
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {hasMore && (
          <div className={styles.loadMoreWrapper}>
            <button onClick={handleLoadMore} className={styles.loadMore}>
              Load More Posts
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
