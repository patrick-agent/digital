import { notFound } from "next/navigation"
import Image from "next/image"
import { readMusic, readMusicItem } from "@/lib/db"
import PlatformLinksCard from "@/components/artist/bio-music/PlatformLinksCard"
import LightPillar from "@/components/ui/LightPillar"
import {
  SpotifyIcon,
  YouTubeIcon,
  AppleMusicIcon,
} from "@/components/icons/SocialIcons"
import styles from "./page.module.css"

export const revalidate = 300

export async function generateStaticParams() {
  const { data } = await readMusic({ limit: 1000 })
  return data
    .filter((release) => release.status === "published")
    .map((release) => ({ slug: release.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const release = await readMusicItem(slug)
  if (!release) return {}
  return {
    title: `${release.title} — Tachy Artist`,
    description:
      release.description ??
      `Listen to ${release.title} by Tachy on all platforms.`,
    openGraph: {
      title: `${release.title} — Tachy`,
      images: [release.coverArt],
      type: "website",
    },
  }
}

export default async function BioMusicDetailPage({ params }) {
  const { slug } = await params
  const release = await readMusicItem(slug)

  if (!release) {
    notFound()
  }

  return (
    <div className={styles.page}>
      {/* 3D Background accent */}
      <div style={{ opacity: 0.5 }}>
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={0.8}
          rotationSpeed={0.2}
          glowAmount={0.008}
          pillarWidth={3.0}
          pillarHeight={0.4}
          noiseIntensity={0.3}
          mixBlendMode="screen"
          pillarRotation={45}
        />
      </div>

      <div className={styles.content}>
        {/* Cover Art */}
        <div className={styles.coverBlock}>
          {release.coverArt ? (
            <Image
              src={release.coverArt}
              alt={release.title}
              width={280}
              height={280}
              priority
              sizes="280px"
              className={styles.coverImage}
              style={{ width: 280, height: 280, borderRadius: 'var(--radius-xl)', objectFit: 'cover', boxShadow: '0 8px 40px rgba(168, 85, 247, 0.15)' }}
            />
          ) : (
            <div className={styles.coverPlaceholder}>
              <span className={styles.coverPlaceholderText}>{release.title}</span>
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className={styles.trackInfo}>
          <h1 className={styles.trackTitle}>{release.title}</h1>
          <p className={styles.artistName}>Tachy</p>
          <p className={styles.chooseText}>Choose your music service</p>
        </div>

        {/* Social Icons Row */}
        <div className={styles.socialRow}>
          <a
            href="https://open.spotify.com/artist/6k6IAy0p8zl0cfzBqGvX9G"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
            aria-label="Spotify"
          >
            <SpotifyIcon size={20} />
          </a>
          <a
            href="https://youtube.com/@TachyNgo"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
            aria-label="YouTube"
          >
            <YouTubeIcon size={20} />
          </a>
          <a
            href="https://music.apple.com/gb/artist/tachy/1818075133"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
            aria-label="Apple Music"
          >
            <AppleMusicIcon size={20} />
          </a>
        </div>

        {/* Platform Links Card */}
        <div className={styles.linksWrapper}>
          <PlatformLinksCard streamingLinks={release.streamingLinks || {}} />
        </div>

        {/* Back Link */}
        <div className={styles.backWrapper}>
          <a href="/bio-music" className={styles.backLink}>
            ← Back to all releases
          </a>
        </div>

        {/* Footer note */}
        <p className={styles.footerNote}>
          © Tachy Artist — All rights reserved
        </p>
      </div>
    </div>
  )
}
