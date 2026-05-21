"use client"

import Link from "next/link"
import Image from "next/image"
import styles from "./BlogHero.module.css"

export default function BlogHero({ featuredPost }) {
  return (
    <section className={styles.hero}>
      <div className={styles.glitchWrapper}>
        <h1 className={styles.headline} data-text="Blog">
          Blog
        </h1>
      </div>
      <p className={styles.subtext}>
        Tutorials, insights, and stories about 3D art, music production, and the creative process.
      </p>

      {featuredPost && (
        <Link
          href={`/blog/${featuredPost.category}/${featuredPost.slug}`}
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
            <span className={styles.featuredBadge}>Featured</span>
            <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
            {featuredPost.excerpt && (
              <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
            )}
            <div className={styles.featuredMeta}>
              <time dateTime={featuredPost.publishedAt}>
                {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              {featuredPost.category && (
                <span className={styles.featuredCategory}>{featuredPost.category}</span>
              )}
            </div>
          </div>
        </Link>
      )}

      <div className={styles.divider} />
    </section>
  )
}
