"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  YouTubeIcon,
  SpotifyIcon,
  AppleMusicIcon,
  AmazonMusicIcon,
  SoundCloudIcon,
} from "@/components/icons/SocialIcons";
import styles from "./StreamingBar.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PLATFORMS = [
  { name: "YouTube", href: "https://youtube.com/@TachyNgo", Icon: YouTubeIcon },
  { name: "Spotify", href: "https://open.spotify.com/artist/6k6IAy0p8zl0cfzBqGvX9G", Icon: SpotifyIcon },
  { name: "Apple Music", href: "https://music.apple.com/gb/artist/tachy/1818075133", Icon: AppleMusicIcon },
  { name: "Amazon Music", href: "https://music.amazon.com/artists/B0FBMQJR61/tachy", Icon: AmazonMusicIcon },
  { name: "SoundCloud", href: "https://soundcloud.com/tachy-ngo", Icon: SoundCloudIcon },
];

export default function StreamingBar() {
  const sectionRef = useRef(null);
  const logoRefs = useRef([]);

  const addToRefs = (el, index) => {
    logoRefs.current[index] = el;
  };

  useGSAP(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    logoRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.streamingBar}>
      <div className={styles.container}>
        <p className={styles.label}>Stream on</p>
        <div className={styles.logoRow}>
          {PLATFORMS.map((platform, i) => (
            <a
              key={platform.name}
              ref={(el) => addToRefs(el, i)}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.logoLink}
              title={platform.name}
              aria-label={`Listen on ${platform.name}`}
            >
              <platform.Icon size={32} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
