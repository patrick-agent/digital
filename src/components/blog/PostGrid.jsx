"use client"

import { useRef, useEffect, useState } from "react"
import PostCard from "./PostCard"
import styles from "./PostGrid.module.css"

export default function PostGrid({ posts, columns = 3, imageSizes, mobileCompact = false }) {
  const gridRef = useRef(null)
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
    if (!gsapReady || !gridRef.current) return

    const cards = gridRef.current.querySelectorAll(`.${styles.cardWrapper}`)
    if (!cards.length) return

    let gsapInstance
    let ScrollTriggerInstance

    const init = async () => {
      const g = await import("gsap")
      const s = await import("gsap/ScrollTrigger")
      gsapInstance = g.default
      ScrollTriggerInstance = s.default || s.ScrollTrigger
      if (!ScrollTriggerInstance) return

      cards.forEach((card, i) => {
        gsapInstance.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
            },
            delay: i * 0.1,
          }
        )
      })
    }

    init()

    return () => {
      ScrollTriggerInstance?.getAll?.().forEach((st) => st.kill())
    }
  }, [gsapReady, posts])

  return (
    <div
      ref={gridRef}
      className={styles.grid}
      style={{ "--columns": columns }}
    >
      {posts.map((post) => (
        <div key={post.id} className={styles.cardWrapper}>
          <PostCard post={post} imageSizes={imageSizes} mobileCompact={mobileCompact} />
        </div>
      ))}
    </div>
  )
}
