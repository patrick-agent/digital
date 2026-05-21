"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";
import styles from "./AboutSection.module.css";
import GlassPanel from "../ui/GlassPanel";
import SectionTitle from "../ui/SectionTitle";
import { useCanvasOptimizer } from "@/hooks/useCanvasOptimizer";

const AboutCharacterCanvas = dynamic(
  () => import("../canvas/AboutCharacterCanvas"),
  { ssr: false, loading: () => null }
);

const CHAR_CONFIG = {
  startPos: { x: 200, y: 20, z: 100 },
  startRot: { x: THREE.MathUtils.degToRad(-12), y: THREE.MathUtils.degToRad(35), z: THREE.MathUtils.degToRad(8.5) },
  startScale: { x: 0.7, y: 0.7, z: 0.7 },
  endPos: { x: 0, y: 35, z: 0 },
  endRot: { x: THREE.MathUtils.degToRad(-12), y: THREE.MathUtils.degToRad(35), z: THREE.MathUtils.degToRad(8.5) },
  endScale: { x: 0.7, y: 0.7, z: 0.7 },
};

const leftPanelData = [
  { label: "NAME", value: "TACHY aka Thành Ngô" },
  { label: "GENRES", value: "Hiphop • R&B • Poptimism" },
  { label: "YEAR OF BIRTH", value: "1996 - Scorpio ♏" },
];

const rightPanelData = [
  { label: "THE ROLES", value: "Artist • Producer • Composer" },
  { label: "THE TRACKS", value: "14+ Tracks & 1 EP. Released" },
  { label: "SKILLS", value: "All in One for Music Creation" },
];

export default function AboutSection() {
  const sectionRef = useRef(null);
  const characterRef = useRef(null);
  const boxRefs = useRef([]);
  const scrollTrackRef = useRef(null);
  const [gsapObj, setGsapObj] = useState({ gsap: null, ScrollTrigger: null, ready: false });
  const [charReady, setCharReady] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const { isMobile, isTablet } = useCanvasOptimizer();
  const isSmall = isMobile || isTablet;

  const autoScrollRef = useRef(null);
  const scrollPosRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);

  const startAutoScroll = useCallback(() => {
    if (autoScrollRef.current) return;
    const animate = () => {
      if (!isDraggingRef.current && scrollTrackRef.current) {
        scrollPosRef.current += 0.5;
        const maxScroll = scrollTrackRef.current.scrollWidth - scrollTrackRef.current.clientWidth;
        if (scrollPosRef.current > maxScroll) scrollPosRef.current = 0;
        scrollTrackRef.current.scrollLeft = scrollPosRef.current;
      }
      autoScrollRef.current = requestAnimationFrame(animate);
    };
    scrollTrackRef.current.scrollLeft = scrollPosRef.current;
    autoScrollRef.current = requestAnimationFrame(animate);
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  }, []);

  const handleTouchStart = useCallback((e) => {
    isDraggingRef.current = true;
    lastXRef.current = e.touches[0].clientX;
    stopAutoScroll();
  }, [stopAutoScroll]);

  const handleTouchMove = useCallback((e) => {
    if (!isDraggingRef.current || !scrollTrackRef.current) return;
    const dx = lastXRef.current - e.touches[0].clientX;
    scrollPosRef.current += dx;
    const maxScroll = scrollTrackRef.current.scrollWidth - scrollTrackRef.current.clientWidth;
    if (scrollPosRef.current < 0) scrollPosRef.current = 0;
    if (scrollPosRef.current > maxScroll) scrollPosRef.current = maxScroll;
    scrollTrackRef.current.scrollLeft = scrollPosRef.current;
    lastXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    startAutoScroll();
  }, [startAutoScroll]);

  useEffect(() => {
    if (!isSmall || !isAboutVisible || !scrollTrackRef.current) return;
    scrollPosRef.current = 0;
    const timer = setTimeout(() => startAutoScroll(), 500);
    return () => { clearTimeout(timer); stopAutoScroll(); };
  }, [isSmall, isAboutVisible, startAutoScroll, stopAutoScroll]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        setVisible(true);
        setIsAboutVisible(e.isIntersecting);
      },
      { threshold: 0, rootMargin: "200px 0px 0px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!sectionRef.current || isMobile) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
    });
  }, [isMobile]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [g, s] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        const gsapInstance = g.default;
        const ScrollTriggerInstance = s.default || s.ScrollTrigger;
        if (!ScrollTriggerInstance) return;
        gsapInstance.registerPlugin(ScrollTriggerInstance);
        if (!cancelled) setGsapObj({ gsap: gsapInstance, ScrollTrigger: ScrollTriggerInstance, ready: true });
      } catch (e) { console.error("GSAP error:", e); }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (characterRef.current?.current) { setCharReady(true); clearInterval(interval); }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!gsapObj.ready || !charReady || !sectionRef.current || isSmall) return;
    const { gsap, ScrollTrigger } = gsapObj;
    const group = characterRef.current?.current;
    if (!group) return;

    const ctx = gsap.context(() => {
      const heroEl = document.getElementById("hero-character");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "center center",
          scrub: 2.5,
          onEnter: () => { if (heroEl) gsap.to(heroEl, { opacity: 0, duration: 1 }); },
          onLeaveBack: () => { if (heroEl) gsap.to(heroEl, { opacity: 1, duration: 1 }); },
        },
      });

      tl.to(group.position, { ...CHAR_CONFIG.endPos, ease: "power2.out" }, 0);
      tl.to(group.rotation, { ...CHAR_CONFIG.endRot, ease: "power2.out" }, 0);
      tl.to(group.scale, { ...CHAR_CONFIG.endScale, ease: "power2.out" }, 0);

      boxRefs.current.forEach((box, i) => {
        if (!box) return;
        gsap.fromTo(box,
          { opacity: 0, x: i < 3 ? -50 : 50, filter: "blur(5px)" },
          {
            opacity: 1, x: 0, filter: "blur(0px)",
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: box,
              start: "top 85%",
              end: "top 60%",
              scrub: 1,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [gsapObj, charReady, isSmall]);

  const allPanels = [...leftPanelData, ...rightPanelData];

  return (
    <section
      id="about"
      className={styles.about}
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      <div className={styles.aboutBg}>
        <div className={styles.gradientOverlay} />
      </div>

      {isSmall && isAboutVisible && (
        <div className={styles.scrollTrackOverlay}>
          <div
            ref={scrollTrackRef}
            className={styles.scrollTrack}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className={styles.scrollTrackInner}>
              {allPanels.map((item, idx) => (
                <GlassPanel
                  key={idx}
                  ref={(el) => { boxRefs.current[idx] = el; }}
                  variant="dark"
                  glow
                  rotatingBorder
                  enableHover
                  className={styles.scrollCard}
                >
                  <div className={styles.cyberContent}>
                    <span className={styles.cyberLabel}>{item.label}</span>
                    <span className={styles.cyberValue}>{item.value}</span>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={styles.aboutContent}>
        <div className={styles.characterContainer}>
          <AboutCharacterCanvas
            ref={characterRef}
            mousePos={mousePos}
            isMobile={isMobile}
            sectionVisible={visible}
            initialPos={isSmall ? [CHAR_CONFIG.endPos.x, CHAR_CONFIG.endPos.y, CHAR_CONFIG.endPos.z] : [CHAR_CONFIG.startPos.x, CHAR_CONFIG.startPos.y, CHAR_CONFIG.startPos.z]}
            initialRot={[CHAR_CONFIG.startRot.x, CHAR_CONFIG.startRot.y, CHAR_CONFIG.startRot.z]}
            initialScale={[CHAR_CONFIG.startScale.x, CHAR_CONFIG.startScale.y, CHAR_CONFIG.startScale.z]}
          />
        </div>

        {!isSmall && (
          <div className={styles.uiOverlay}>
            <div className={styles.leftCol}>
              {leftPanelData.map((item, idx) => (
                <GlassPanel
                  key={idx}
                  ref={(el) => { boxRefs.current[idx] = el; }}
                  variant="dark"
                  glow
                  rotatingBorder
                  enableHover
                  style={{ minWidth: 180, maxWidth: 280, padding: "16px 24px" }}
                >
                  <div className={styles.cyberContent}>
                    <span className={styles.cyberLabel}>{item.label}</span>
                    <span className={styles.cyberValue}>{item.value}</span>
                  </div>
                </GlassPanel>
              ))}
            </div>

            <div className={styles.rightCol}>
              {rightPanelData.map((item, idx) => (
                <GlassPanel
                  key={idx + 3}
                  ref={(el) => { boxRefs.current[idx + 3] = el; }}
                  variant="dark"
                  glow
                  rotatingBorder
                  enableHover
                  style={{ minWidth: 180, maxWidth: 280, padding: "16px 24px" }}
                >
                  <div className={styles.cyberContent}>
                    <span className={styles.cyberLabel}>{item.label}</span>
                    <span className={styles.cyberValue}>{item.value}</span>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
