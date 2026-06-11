"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import BlogHero from "./BlogHero"
import CategoryNav from "./CategoryNav"
import PostGrid from "./PostGrid"
import Breadcrumb from "./Breadcrumb"
import styles from "./BlogClient.module.css"
import { useReducedMotion } from "framer-motion"

export default function BlogClient({ initialPosts, categories, featuredPost, initialActiveCategory = null, pageTitle, categoryDescriptions = {} }) {
  const [activeCategory, setActiveCategory] = useState(initialActiveCategory)
  const reducedMotion = useReducedMotion()

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
            {categoryDescriptions[activeCategory || initialActiveCategory] || (
              <>Articles filed under <strong>{activeCategory || initialActiveCategory}</strong></>
            )}
          </p>
          <div className={styles.divider} />
        </div>
      ) : (
        <BlogHero featuredPost={featuredPost} />
      )}

      <div className={styles.container}>
        <Breadcrumb items={breadcrumbItems} />

        {pageTitle && (
          <CategoryNav
            categories={categories}
            active={activeCategory}
            onSelect={handleCategoryChange}
          />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory || "all"}
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -20 }}
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
