"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./DonationSection.module.css";
import GlassPanel from "../ui/GlassPanel";
import { Canvas } from "@react-three/fiber";
import ParticleField from "../canvas/ParticleField";
import FloatingGeometries from "../canvas/FloatingGeometries";
import { useCanvasOptimizer } from "@/hooks/useCanvasOptimizer";

const BreakdanceCharacterCanvas = dynamic(
  () => import("../canvas/BreakdanceCharacterCanvas"),
  { ssr: false, loading: () => null }
);

const degToRad = (deg) => (deg * Math.PI) / 180;

const SECTION_CONFIG = {
  startPos: { x: -130, y: 30, z: -50 },
  startRot: { x: 0, y: degToRad(45), z: 0 },
  startScale: { x: 1.0, y: 1.0, z: 1.0 },
};

function BackgroundLayers({ isMobile }) {
  const { devicePixelRatio, isVisible, getResponsiveParticleCount } = useCanvasOptimizer({ threshold: 0 });
  const particleCount = getResponsiveParticleCount(100);
  const geoCount = isMobile ? 3 : 7;

  return (
    <Canvas
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      dpr={devicePixelRatio}
      frameloop={isVisible ? "always" : "demand"}
    >
      <ambientLight intensity={0.5} />
      <ParticleField count={particleCount} color="#00ffff" spread={22} size={0.025} opacity={0.2} mouseReactive={!isMobile} />
      {!isMobile && <FloatingGeometries count={geoCount} color="#a855f7" spread={16} size={0.2} />}
    </Canvas>
  );
}

export default function DonationSection() {
  const sectionRef = useRef(null);
  const characterRef = useRef(null);
  const [charReady, setCharReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const { isMobile, isTablet } = useCanvasOptimizer();
  const isSmall = isMobile || isTablet;

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (characterRef.current?.current) { setCharReady(true); clearInterval(interval); }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="donation" className={styles.donation} ref={sectionRef}>
      <div className={styles.bgAmbientGlow}></div>
      {!isMobile && <div className={styles.cyberGrid}></div>}
      {visible && <BackgroundLayers isMobile={isMobile} />}

      {!isSmall && <div className={styles.canvasLayer}>
        <BreakdanceCharacterCanvas
          ref={characterRef}
          isMobile={isMobile}
          sectionVisible={visible}
          initialPos={[SECTION_CONFIG.startPos.x, SECTION_CONFIG.startPos.y, SECTION_CONFIG.startPos.z]}
          initialRot={[SECTION_CONFIG.startRot.x, SECTION_CONFIG.startRot.y, SECTION_CONFIG.startRot.z]}
          initialScale={[SECTION_CONFIG.startScale.x, SECTION_CONFIG.startScale.y, SECTION_CONFIG.startScale.z]}
        />
      </div>}

      {!isMobile && <div className={styles.scanline}></div>}

      <div className={styles.contentLayer}>
        <div className={styles.rightContainer}>
          <GlassPanel variant="dark" glow style={{ padding: "40px 30px" }}>
            <h2 className={styles.title}>Buying for Tachy<br />a cup of Coffee</h2>
            <p className={styles.subtitle}>
              Every coffee fuels more happiness for the artist.
            </p>

            <div className={styles.cryptoContainer}>
              <div className={styles.cryptoCard}>
                <div className={styles.cryptoIcon}>
                  <div className={styles.iconOverlay}>
                    <svg version="1.1" viewBox="0 0 336 336" width="48" height="48">
                      <defs>
                        <linearGradient id="momoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#A50064" />
                          <stop offset="100%" stopColor="#D4145A" />
                        </linearGradient>
                        <linearGradient id="momoOverlay" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#c084fc" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#7c3aed" stopOpacity="1" />
                        </linearGradient>
                      </defs>
                      <circle cx="168" cy="168" r="168" fill="url(#momoGrad)" />
                      <circle cx="168" cy="168" r="168" fill="url(#momoOverlay)" />
                      <g fill="#FFFFFF">
                        <path d="M224.8,159c23.5,0,42.5-19,42.5-42.5c0-23.5-19-42.5-42.5-42.5c-23.5,0-42.5,19-42.5,42.5 C182.3,140,201.3,159,224.8,159z M224.8,98.4c10,0,18.1,8.1,18.1,18.1c0,10-8.1,18.1-18.1,18.1c-10,0-18.1-8.1-18.1-18.1 C206.7,106.5,214.8,98.4,224.8,98.4z" />
                        <path d="M138.2,74c-7.2,0-13.8,2.4-19.1,6.4c-5.3-4-12-6.4-19.1-6.4C82.3,74,68,88.3,68,105.9V159h24.4v-53.4 c0-4,3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2V159h24.4v-53.4c0-4,3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2V159H170v-53.1 C170,88.3,155.8,74,138.2,74z" />
                        <path d="M224.8,177.4c-23.5,0-42.5,19-42.5,42.5c0,23.5,19,42.5,42.5,42.5c23.5,0,42.5-19,42.5-42.5 C267.3,196.4,248.3,177.4,224.8,177.4z M224.8,238c-10,0-18.1-8.1-18.1-18.1c0-10,8.1-18.1,18.1-18.1c10,0,18.1,8.1,18.1,18.1 C242.9,229.9,234.8,238,224.8,238z" />
                        <path d="M138.2,177.4c-7.2,0-13.8,2.4-19.1,6.4c-5.3-4-12-6.4-19.1-6.4c-17.6,0-31.9,14.3-31.9,31.9v53.2h24.4V209 c0-4,3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2v53.4h24.4V209c0-4,3.2-7.2,7.2-7.2c4,0,7.2,3.2,7.2,7.2v53.4H170v-53.2 C170,191.7,155.8,177.4,138.2,177.4z" />
                      </g>
                    </svg>
                  </div>
                </div>
                <div className={styles.cryptoInfo}>
                  <h4>Momo</h4>
                  <p className={styles.cryptoAddress}>PSP2602318300000389</p>
                  <button className={styles.copyBtn}>Copy</button>
                </div>
              </div>

              <div className={styles.cryptoCard}>
                <div className={styles.cryptoIcon}>
                  <div className={styles.iconOverlay}>
                    <img src="/images/ZaloPay_logo.webp" alt="Zalo Pay" width={33} height={33} style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
                  </div>
                </div>
                <div className={styles.cryptoInfo}>
                  <h4>Zalo Pay</h4>
                  <p className={styles.cryptoAddress}>99ZP25001M64593732</p>
                  <button className={styles.copyBtn}>Copy</button>
                </div>
              </div>
            </div>

            <div className={styles.qrContainer}>
              <div className={styles.qrCode}>
                <img src="/images/vietcombank-qr.png" alt="Vietcombank QR" className={styles.qrImage} />
              </div>
            </div>

            <div className={styles.socialLinks}>
              <a href="https://facebook.com/tachy.ngo/" className={styles.socialLink}>Facebook</a>
              <a href="https://instagram.com/tachy.ngo/" className={styles.socialLink}>Instagram</a>
              <a href="https://youtube.com/@TachyNgo" className={styles.socialLink}>Youtube</a>
            </div>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
}
