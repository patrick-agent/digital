"use client"

import { useRef, useCallback } from "react"
import Image from "next/image"
import { postUrl } from "@/lib/post-utils"
import styles from "./PostCard.module.css"

export default function PostCard({ post, featured = false }) {
  const cardRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8
    card.style.setProperty("--rotate-x", `${rotateX}deg`)
    card.style.setProperty("--rotate-y", `${rotateY}deg`)
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty("--rotate-x", "0deg")
    card.style.setProperty("--rotate-y", "0deg")
  }, [])

  const readTime = post.readTime || Math.max(1, Math.ceil((post.content?.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length || 0) / 200))

  return (
    <a
      href={postUrl(post)}
      className={`${styles.card} ${featured ? styles.featured : ""}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.imageWrapper}>
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"}
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
        <div className={styles.imageOverlay} />
      </div>
      <div className={styles.content}>
        {post.category && (
          <span className={styles.categoryBadge}>{post.category}</span>
        )}
        <h3 className={styles.title}>{post.title}</h3>
        {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
        <div className={styles.meta}>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
          <span className={styles.readTime}>{readTime} min read</span>
        </div>
      </div>
    </a>
  )
}
