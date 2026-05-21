"use client"

import {
  SiSpotify,
  SiYoutube,
  SiApplemusic,
  SiSoundcloud,
  SiTidal,
  SiYoutubemusic,
} from "react-icons/si"
import { AmazonMusicIcon, DeezerIcon } from "./PlatformIcons"
import styles from "./PlatformLink.module.css"

export interface PlatformConfig {
  key: string
  name: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  brandColor: string
}

// DB field name → platform config mapping
export const PLATFORM_CONFIGS: PlatformConfig[] = [
  { key: "spotify", name: "Spotify", icon: SiSpotify, label: "▶ PLAY", brandColor: "#1DB954" },
  { key: "youtube", name: "YouTube", icon: SiYoutube, label: "SUBSCRIBE", brandColor: "#FF0000" },
  { key: "apple", name: "Apple Music", icon: SiApplemusic, label: "▶ PLAY", brandColor: "#FA243C" },
  { key: "apple_music", name: "Apple Music", icon: SiApplemusic, label: "▶ PLAY", brandColor: "#FA243C" },
  { key: "amazon_music", name: "Amazon Music", icon: AmazonMusicIcon, label: "▶ PLAY", brandColor: "#25D1DA" },
  { key: "youtube_music", name: "YouTube Music", icon: SiYoutubemusic, label: "▶ PLAY", brandColor: "#FF0000" },
  { key: "soundcloud", name: "SoundCloud", icon: SiSoundcloud, label: "▶ PLAY", brandColor: "#FF5500" },
  { key: "tidal", name: "Tidal", icon: SiTidal, label: "▶ PLAY", brandColor: "#000000" },
  { key: "deezer", name: "Deezer", icon: DeezerIcon, label: "▶ PLAY", brandColor: "#A238FF" },
]

interface PlatformLinkProps {
  platform: PlatformConfig
  url: string
}

export default function PlatformLink({ platform, url }: PlatformLinkProps) {
  const Icon = platform.icon

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.row}
      style={{ "--brand-color": platform.brandColor } as React.CSSProperties}
    >
      <div className={styles.left}>
        <Icon size={22} className={styles.icon} style={{ color: platform.brandColor }} />
        <span className={styles.name}>{platform.name}</span>
      </div>
      <span className={styles.action}>{platform.label}</span>
    </a>
  )
}
