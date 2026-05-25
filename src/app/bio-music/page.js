import { readMusic } from "@/lib/db"
import ReleaseShelf3D from "@/components/artist/bio-music/ReleaseShelf3D"
import ReleaseCard from "@/components/artist/bio-music/ReleaseCard"
import SpotlightCard from "@/components/canvas/SpotlightCard"
import styles from "./page.module.css"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Bio Music — Tachy Artist",
  description:
    "All releases by Tachy — RnB, Trapchill & Hip-hop singles and EPs. Listen on Spotify, Apple Music, YouTube and more.",
  openGraph: {
    title: "Bio Music — Tachy Artist",
    description: "Discography of indie artist Tachy.",
    type: "website",
  },
}

export default async function BioMusicPage() {
  const { data: releases } = await readMusic({})

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <span className={styles.overline}>Discography</span>
        <h1 className={styles.title}>All Releases</h1>
        <p className={styles.subtitle}>Every track, every story.</p>
      </section>

      {/* 3D Release Shelf — hidden on mobile via CSS */}
      {releases.length > 0 && (
        <section className={styles.shelfSection}>
          <ReleaseShelf3D releases={releases} />
        </section>
      )}

      {/* Divider */}
      <div className={styles.divider}>
        <span className={styles.dividerLabel}>All Tracks</span>
      </div>

      {/* Grid fallback — visible on all sizes */}
      <section className={styles.gridSection}>
        {releases.length === 0 ? (
          <p className={styles.empty}>No releases yet. Check back soon!</p>
        ) : (
          <div className={styles.grid}>
            {releases.map((release) => (
              <SpotlightCard
                key={release.id}
                className="spotlight-card"
                spotlightColor="rgba(168, 85, 247, 0.2)"
              >
                <ReleaseCard release={release} />
              </SpotlightCard>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
