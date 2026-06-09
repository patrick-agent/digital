"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import BlogHero from "./BlogHero"
import CategoryNav from "./CategoryNav"
import PostGrid from "./PostGrid"
import Breadcrumb from "./Breadcrumb"
import styles from "./BlogClient.module.css"

export default function BlogClient({ initialPosts, categories, featuredPost, initialActiveCategory = null, pageTitle }) {
  const [activeCategory, setActiveCategory] = useState(initialActiveCategory)

  const filteredPosts = useMemo(() => {
    if (!activeCategory) return initialPosts
    return initialPosts.filter((p) => p.category === activeCategory)
  }, [initialPosts, activeCategory])

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
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
            <PostGrid posts={filteredPosts} />

            {filteredPosts.length === 0 && (
              <p className={styles.empty}>
                No posts found in this category.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
