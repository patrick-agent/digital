"use client"

import Image from "next/image"
import Link from "next/link"
import styles from "./ReleaseCard.module.css"

interface ReleaseCardProps {
  release: {
    id: string
    slug: string
    title: string
    type: string
    coverArt?: string
    releaseDate?: string
  }
}

export default function ReleaseCard({ release }: ReleaseCardProps) {
  const coverSrc = release.coverArt || `/images/releases/${release.slug}.jpg`

  return (
    <Link href={`/bio-music/${release.slug}`} className={styles.card}>
      <div className={styles.coverWrapper}>
        {release.coverArt ? (
          <Image
            src={coverSrc}
            alt={release.title}
            fill
            className={styles.cover}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className={styles.coverPlaceholder}>
            <span className={styles.coverPlaceholderText}>{release.title}</span>
          </div>
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.title}>{release.title}</span>
        <div className={styles.meta}>
          <span className={styles.typeBadge}>{release.type}</span>
        </div>
        <span className={styles.listenBtn}>Listen</span>
      </div>
    </Link>
  )
}
