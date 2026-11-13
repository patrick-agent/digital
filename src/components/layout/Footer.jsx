"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./Footer.module.css";
import {
  FacebookIcon, InstagramIcon, YouTubeIcon, TikTokIcon,
  SpotifyIcon, AppleMusicIcon, AmazonMusicIcon
} from "../icons/SocialIcons";
import { enabledItems, mergeSiteSettings } from "@/lib/site-defaults";

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

const SOCIAL_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  spotify: "Spotify",
  appleMusic: "Apple Music",
  amazonMusic: "Amazon Music",
};

function ShootingStars() {
  return (
    <div className={styles.shootingStars}>
      {[...Array(20)].map((_, i) => (
        <div key={i} className={styles.shootingStar} style={{ '--i': i }} />
      ))}
    </div>
  );
}

export default function Footer({ settings }) {
  const siteSettings = mergeSiteSettings(settings);
  const footer = siteSettings.footer;
  const socialLinks = Object.entries(siteSettings.socialLinks)
    .map(([key, url]) => ({ name: SOCIAL_LABELS[key] || key, url }))
    .filter((link) => link.url && ICON_MAP[link.name]);
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
          <h3 className={styles.brandName}>{footer.brandName}</h3>
          {footer.paragraphs.map((paragraph, index) => (
            <p key={index} className={styles.brandTagline}>{paragraph}</p>
          ))}
        </div>
        <div className={styles.topSection}>
          <div className={styles.linkColumn}>
            <h4>Navigation</h4>
            {enabledItems(footer.navigationLinks).map((link) => (
              <a key={link.label} href={link.href}>{link.label}</a>
            ))}
          </div>
          <div className={styles.linkColumn}>
            <h4>Others</h4>
            <div className={styles.othersGrid}>
              {enabledItems(footer.otherLinks).map((link) => (
                <a key={link.label} href={link.href}>{link.label}</a>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.bottomSection}>
          <div className={styles.socialIcons}>
            {socialLinks.map((link) => {
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
            &copy; {new Date().getFullYear()} <span>{footer.copyrightName}</span>. All rights reserved.
          </p>
          <button className={styles.backToTop} onClick={scrollToTop} title="Back to top">
            &#8593;
          </button>
        </div>
      </div>
    </footer>
  );
}
