"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./Footer.module.css";
import {
  FacebookIcon, InstagramIcon, YouTubeIcon, TikTokIcon,
  SpotifyIcon, AppleMusicIcon, AmazonMusicIcon
} from "../icons/SocialIcons";

const FooterEffects = dynamic(
  () => import("./FooterEffects"),
  { ssr: false, loading: () => null }
);

const ICON_MAP = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  YouTube: YouTubeIcon,
  TikTok: TikTokIcon,
  Spotify: SpotifyIcon,
  "Apple Music": AppleMusicIcon,
  "Amazon Music": AmazonMusicIcon,
};

const SOCIAL_LINKS = [
  { name: "Facebook", url: "https://facebook.com/tachy.ngo/" },
  { name: "Instagram", url: "https://instagram.com/tachy.ngo/" },
  { name: "YouTube", url: "https://youtube.com/@TachyNgo" },
  { name: "TikTok", url: "https://tiktok.com/@tachy.ngo" },
  { name: "Spotify", url: "https://open.spotify.com/artist/6k6IAy0p8zl0cfzBqGvX9G" },
  { name: "Apple Music", url: "https://music.apple.com/gb/artist/tachy/1818075133" },
  { name: "Amazon Music", url: "https://music.amazon.com/artists/B0FBMQJR61/tachy" },
];

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Music", href: "#music" },
  { label: "Latest EP.", href: "#latest-ep" },
];

const SERVICES = [
  { label: "Another Me", href: "/digital" },
  { label: "Blog", href: "/blog" },
  { label: "About Tachy", href: "/about" },
  { label: "Shop", href: "/shop" },
  { label: "Bio Music", href: "/bio-music" },
  { label: "Terms & Condition", href: "/terms" },
  { label: "Contact Me", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
];

function ShootingStars() {
  return (
    <div className={styles.shootingStars}>
      {[...Array(20)].map((_, i) => (
        <div key={i} className={styles.shootingStar} style={{ '--i': i }} />
      ))}
    </div>
  );
}

export default function Footer() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer} ref={sectionRef}>
      <div className={styles.divider} />
      <div className={styles.starsLayer}>
        {visible && <ShootingStars />}
      </div>
      {visible && (
        <FooterEffects
          canvasClassName={styles.canvasLayer}
          modelClassName={styles.modelLayer}
        />
      )}
      <div className={styles.content}>
        <div className={styles.brand}>
          <h3 className={styles.brandName}>TACHY</h3>
          <p className={styles.brandTagline}>
            Tachy không chỉ là một nghệ sĩ Indie, mà còn là Music Producer độc lập với niềm đam mê khám phá chất âm mới. Từ phòng thu cá nhân, Tachy tự viết, tự thu và phát hành nhạc, mang đến trải nghiệm rất riêng cho người nghe yêu thích dòng RnB, Indie Poptimism, Chillout và Hip-hop.
          </p>
          <p className={styles.brandTagline}>
            Với triết lý “âm nhạc là sự thật của cảm xúc”, các tác phẩm của nghệ sĩ Indie Tachy thường mang màu sắc sâu lắng, mộng mị nhưng vẫn hiện đại và giàu sáng tạo.
          </p>
        </div>
        <div className={styles.topSection}>
          <div className={styles.linkColumn}>
            <h4>Navigation</h4>
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href}>{link.label}</a>
            ))}
          </div>
          <div className={styles.linkColumn}>
            <h4>Others</h4>
            <div className={styles.othersGrid}>
              {SERVICES.map((link) => (
                <a key={link.label} href={link.href}>{link.label}</a>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.bottomSection}>
          <div className={styles.socialIcons}>
            {SOCIAL_LINKS.map((link) => {
              const IconComponent = ICON_MAP[link.name];
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  title={link.name}
                >
                  <IconComponent size={20} />
                </a>
              );
            })}
          </div>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} <span>TACHY</span>. All rights reserved.
          </p>
          <button className={styles.backToTop} onClick={scrollToTop} title="Back to top">
            &#8593;
          </button>
        </div>
      </div>
    </footer>
  );
}
