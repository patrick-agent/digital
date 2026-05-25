"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { CometCard } from "@/components/ui/comet-card"

import styles from "./ReleaseShelf3D.module.css"

type ShelfRelease = {
  id: string
  slug: string
  title: string
  type: string
  coverArt?: string
  streamingLinks?: Record<string, string>
}

interface ReleaseShelf3DProps {
  releases: ShelfRelease[]
}

export default function ReleaseShelf3D({ releases }: ReleaseShelf3DProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const total = releases.length

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % total)
  }

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  })

  const activeRelease = releases[activeIndex]

  return (
    <div className={styles.shelfContainer}>
      <div className={styles.carousel}>
        {releases.map((release, i) => {
          const offset = i - activeIndex
          const isActive = i === activeIndex
          const coverSrc = release.coverArt || `/images/releases/${release.slug}.jpg`

          return (
            <div
              key={release.id}
              className={styles.carouselCard}
              style={{
                transform: `translateX(${offset * 110}%) scale(${isActive ? 1 : 0.85})`,
                opacity: isActive ? 1 : 0.35,
                zIndex: isActive ? 10 : 1,
              }}
            >
              <CometCard>
                <button
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={styles.cardButton}
                  >
                  <div className={styles.cardImageWrapper}>
                    <Image
                      src={coverSrc}
                      alt={release.title}
                      fill
                      className={styles.cardImage}
                      sizes="360px"
                    />
                  </div>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardTitle}>{release.title}</span>
                    <span className={styles.cardType}>{release.type}</span>
                  </div>
                  </button>
                </CometCard>
            </div>
          )
        })}
      </div>
      {/* Navigation arrows */}
      <button
        className={`${styles.navBtn} ${styles.navBtnLeft}`}
        onClick={goPrev}
        aria-label="Previous release"
      >
        ←
      </button>
      <button
        className={`${styles.navBtn} ${styles.navBtnRight}`}
        onClick={goNext}
        aria-label="Next release"
      >
        →
      </button>
    </div>
  )
}
