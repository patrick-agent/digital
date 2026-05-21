"use client"

import { useRef, useEffect, useState } from "react"
import PostCard from "./PostCard"
import styles from "./RelatedPosts.module.css"

export default function RelatedPosts({ posts }) {
  const sectionRef = useRef(null)
  const [gsapReady, setGsapReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [g, s] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
        const gsapInstance = g.default
        const ScrollTriggerInstance = s.default || s.ScrollTrigger
        if (!ScrollTriggerInstance) return
        gsapInstance.registerPlugin(ScrollTriggerInstance)
        if (!cancelled) setGsapReady(true)
      } catch (e) {
        console.error("GSAP load error:", e)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!gsapReady || !sectionRef.current) return

    const cards = sectionRef.current.querySelectorAll(`.${styles.card}`)
    if (!cards.length) return

    let gsapInstance, ScrollTriggerInstance
    const init = async () => {
      const g = await import("gsap")
      const s = await import("gsap/ScrollTrigger")
      gsapInstance = g.default
      ScrollTriggerInstance = s.default || s.ScrollTrigger
      if (!ScrollTriggerInstance) return

      gsapInstance.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      )
    }
    init()

    return () => ScrollTriggerInstance?.getAll?.()?.forEach((st) => st.kill())
  }, [gsapReady, posts])

  if (!posts || posts.length === 0) return null

  return (
    <section ref={sectionRef} className={styles.section}>
      <h2 className={styles.heading}>Related Posts</h2>
      <div className={styles.grid}>
        {posts.map((post) => (
          <div key={post.id} className={styles.card}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </section>
  )
}
