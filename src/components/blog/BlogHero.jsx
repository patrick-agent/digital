"use client"

import Link from "next/link"
import Image from "next/image"
import { postUrl } from "@/lib/post-utils"
import { formatBlogCategoryLabel } from "@/lib/blog/category-meta"
import styles from "./BlogHero.module.css"

export default function BlogHero({ featuredPost, totalPosts, categoriesCount }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroIntro}>
        <div className={styles.copy}>
          <span className={styles.kicker}>Tachy Notes</span>
          <h1 className={styles.headline}>Blog được tổ chức theo danh mục để đọc nhanh và đào sâu dễ hơn.</h1>
          <p className={styles.subtext}>
            Tìm theo keyword, lọc theo danh mục và đi thẳng tới archive riêng của từng mảng nội dung khi cần xem toàn bộ bài viết.
          </p>
        </div>

        <div className={styles.stats} aria-label="Blog summary">
          <div className={styles.statCard}>
            <span className={styles.statValue}>{totalPosts}</span>
            <span className={styles.statLabel}>Tổng số bài viết</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{categoriesCount}</span>
            <span className={styles.statLabel}>Danh mục riêng</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>10</span>
            <span className={styles.statLabel}>Preview mỗi mục</span>
          </div>
        </div>
      </div>

      {featuredPost && (
        <Link
          href={postUrl(featuredPost)}
          className={styles.featured}
        >
          <div className={styles.featuredImageWrapper}>
            {featuredPost.coverImage ? (
              <Image
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className={styles.featuredImage}
              />
            ) : (
              <div className={styles.featuredImagePlaceholder} />
            )}
            <div className={styles.featuredOverlay} />
          </div>
          <div className={styles.featuredContent}>
            <span className={styles.featuredBadge}>Bài nổi bật</span>
            <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
            {featuredPost.excerpt && (
              <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
            )}
            <div className={styles.featuredMeta}>
              <time dateTime={featuredPost.publishedAt}>
                {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              {featuredPost.category && (
                <span className={styles.featuredCategory}>{formatBlogCategoryLabel(featuredPost.category)}</span>
              )}
            </div>
          </div>
        </Link>
      )}

      <div className={styles.divider} />
    </section>
  )
}
