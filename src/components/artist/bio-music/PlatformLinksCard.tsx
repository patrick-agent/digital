"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import type { StreamingLinks } from "@/lib/data/releases"
import PlatformLink, { PLATFORM_CONFIGS } from "./PlatformLink"
import styles from "./PlatformLinksCard.module.css"

interface PlatformLinksCardProps {
  streamingLinks: StreamingLinks
}

export default function PlatformLinksCard({ streamingLinks }: PlatformLinksCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Filter platforms that have URLs
  const activePlatforms = PLATFORM_CONFIGS.filter(
    (p) => streamingLinks[p.key as keyof StreamingLinks]
  )

  // GSAP stagger animation on mount
  useEffect(() => {
    if (!cardRef.current) return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReducedMotion) return

    const rows = cardRef.current.querySelectorAll(`.${styles.rowWrapper}`)
    if (rows.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        }
      )
    }, cardRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className={styles.card} ref={cardRef}>
      {activePlatforms.map((platform) => (
        <div key={platform.key} className={styles.rowWrapper}>
          <PlatformLink
            platform={platform}
            url={streamingLinks[platform.key as keyof StreamingLinks]!}
          />
        </div>
      ))}
    </div>
  )
}
