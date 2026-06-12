import { readMusic } from "@/lib/db"
import { buildPageMetadata, siteMetadata } from "@/lib/seo"
import ReleaseShelf3D from "@/components/artist/bio-music/ReleaseShelf3D"
import ReleaseCard from "@/components/artist/bio-music/ReleaseCard"
import SpotlightCard from "@/components/canvas/SpotlightCard"
import styles from "./page.module.css"

export const revalidate = 300

export const metadata = buildPageMetadata({
  title: "Nhạc Của Tachy | Singles, EP & Discography",
  description:
    "Nghe toàn bộ discography của Tachy gồm single, EP và các bản phát hành Indie RnB, Trapchill, Hip-hop trên nhiều nền tảng.",
  path: "/bio-music",
  keywords: ["Tachy music", "discography", "single", "EP", "indie RnB", "trapchill"],
})

export default async function BioMusicPage() {
  let releases = []
  try {
    const { data } = await readMusic({})
    releases = data || []
  } catch (error) {
    console.error("Error loading music:", error)
    releases = []
  }

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <span className={styles.overline}>Discography</span>
        <h1 className={styles.title}>All Releases</h1>
        <p className={styles.subtitle}>Every track, every story.</p>
      </section>

      {/* MusicAlbum JSON-LD */}
      {releases.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicAlbum",
              name: "Tachy Discography",
              byArtist: {
                "@type": "MusicGroup",
                name: "Tachy",
                url: "https://tachy.io.vn",
              },
              albumRelease: releases.map((r) => ({
                "@type": "MusicRelease",
                name: r.title,
                url: `${siteMetadata.siteUrl}/bio-music/${r.slug}`,
                image: r.coverArt,
                datePublished: r.publishedAt || r.createdAt,
              })),
            }),
          }}
        />
      )}

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
