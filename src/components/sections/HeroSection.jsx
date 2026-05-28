"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./HeroSection.module.css";

const GradientBlinds = dynamic(
  () => import("../canvas/GradientBlinds"),
  { ssr: false, loading: () => null }
);

const CharacterCanvas = dynamic(
  () => import("../canvas/CharacterCanvas"),
  { ssr: false, loading: () => null }
);

export default function HeroSection() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const [enableHeroEffects, setEnableHeroEffects] = useState(false);
  const [enableCharacter, setEnableCharacter] = useState(false);

  useEffect(() => {
    const textEl = textRef.current;
    if (!textEl) return;
    const children = textEl.querySelectorAll("[data-animate]");
    children.forEach((child, i) => {
      child.style.animationDelay = `${0.2 + i * 0.15}s`;
    });
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowNetwork = ["slow-2g", "2g", "3g"].includes(connection?.effectiveType);

    if (reduceMotion || isMobile || isSlowNetwork) return;

    const timer = window.setTimeout(() => {
      setEnableHeroEffects(true);
      setEnableCharacter(true);
    }, 500);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className={styles.hero} ref={sectionRef}>
      <div className={styles.heroFullScreenCanvas}>
        {enableHeroEffects && (
          <GradientBlinds
            gradientColors={['#FF9FFC', '#5227FF']}
            angle={0}
            noise={0.3}
            blindCount={20}
            blindMinWidth={50}
            spotlightRadius={0.5}
            spotlightSoftness={1}
            spotlightOpacity={1}
            mouseDampening={0.15}
            distortAmount={0}
            shineDirection="left"
            mixBlendMode="lighten"
          />
        )}
      </div>

      <div className={styles.heroInner}>
        <div className={styles.textContent} ref={textRef}>
          <div className={styles.tagline} data-animate>
            <span className={styles.tagDot} />
            Artist &bull; Producer &bull; Digital Marketer
          </div>

          <h1 className={styles.headline} data-animate>
            Welcome to{" "}
            <span className={styles.headlineAccent}>
              Tachy&apos;s
              <svg className={styles.headlineUnderline} viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M2 8 Q50 2, 100 8 T198 6" stroke="url(#underlineGrad)" strokeWidth="3" fill="none" strokeLinecap="round" />
                <defs>
                  <linearGradient id="underlineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </span>{" "}
            World
          </h1>

          <p className={styles.subheadline} data-animate>
            Listen to Tachy&apos;s latest track on{" "}
            <span className={styles.platformHighlight}>Spotify</span>,{" "}
            <span className={styles.platformHighlight}>Youtube</span>,{" "}
            <span className={styles.platformHighlight}>Apple Music</span>,...
          </p>

          <div className={styles.ctaGroup} data-animate>
            <a href="#music" className={styles.ctaPrimary}>
              <span className={styles.ctaText}>Kh&aacute;m ph&aacute; h&agrave;nh tr&igrave;nh</span>
              <span className={styles.ctaArrow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </a>

            <div className={styles.socialHint}>
              <div className={styles.scrollIndicator}>
                <div className={styles.scrollDot} />
              </div>
              <span>Cuộn để kh&aacute;m ph&aacute;</span>
            </div>
          </div>
        </div>

        {enableCharacter && (
          <div id="hero-character" className={styles.characterOverlay}>
            <CharacterCanvas />
          </div>
        )}
      </div>
    </section>
  );
}
