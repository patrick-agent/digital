"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import { siteMetadata } from "@/lib/seo"
import styles from "./ArticleHero.module.css"

export default function ArticleHero({ post }) {
  const parallaxRef = useRef(null)
  const gsapRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    const loadGSAP = async () => {
      try {
        const [g, s] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
        const gsapInstance = g.default
        const ScrollTriggerInstance = s.default || s.ScrollTrigger
        if (!ScrollTriggerInstance || !parallaxRef.current || cancelled) return
        gsapInstance.registerPlugin(ScrollTriggerInstance)

        gsapInstance.to(parallaxRef.current, {
          y: "25%",
          ease: "none",
          scrollTrigger: {
            trigger: parallaxRef.current.parentElement,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        })
        gsapRef.current = { gsap: gsapInstance, ScrollTrigger: ScrollTriggerInstance }
      } catch (e) {
        console.error("GSAP load error:", e)
      }
    }
    loadGSAP()
    return () => {
      cancelled = true
      gsapRef.current?.ScrollTrigger?.getAll?.()?.forEach((st) => st.kill())
    }
  }, [])

  const readTime = Math.max(1, Math.ceil((post.content?.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length || 0) / 200))

  return (
    <header className={styles.hero}>
      <div className={styles.imageContainer}>
        {post.coverImage ? (
          <div ref={parallaxRef} className={styles.parallaxLayer}>
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="100vw"
              className={styles.image}
              priority
            />
          </div>
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        {post.category && (
          <span className={styles.categoryBadge}>{post.category}</span>
        )}
        <h1 className={styles.title}>{post.title}</h1>
        {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
        <div className={styles.meta}>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span className={styles.readTime}>{readTime} min read</span>
        </div>
      </div>

      <div className={styles.glitchLine} />
    </header>
  )
}
