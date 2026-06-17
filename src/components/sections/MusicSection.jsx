// ============================================
// MusicSection — Main Player & Playlist layout
// ============================================
"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import AuroraBackground from "./AuroraBackground";
import styles from "./MusicSection.module.css";
import GlassPanel from "../ui/GlassPanel";
import SectionTitle from "../ui/SectionTitle";
import { useCanvasOptimizer } from "@/hooks/useCanvasOptimizer";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { seededBetween } from "@/lib/seeded-random";

const PointingCharacterCanvas = dynamic(
  () => import("../canvas/PointingCharacterCanvas"),
  { ssr: false, loading: () => null }
);

const degToRad = (deg) => (deg * Math.PI) / 180;

const CHAR_CONFIG = {
  startPos: { x: 0, y: 200, z: 0 },
  startRot: { x: degToRad(-20), y: degToRad(35), z: degToRad(8.5) },
  startScale: { x: 0.7, y: 0.7, z: 0.7 },
  endPos: { x: 0, y: 50, z: 0 },
  endRot: { x: degToRad(-20), y: degToRad(35), z: degToRad(8.5) },
  endScale: { x: 0.7, y: 0.7, z: 0.7 },
};

function ShootingStars() {
  const stars = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      '--x': `${seededBetween(i * 5 + 1, 5, 95)}%`,
      '--y': `${-seededBetween(i * 5 + 2, 5, 15)}%`,
      '--dur': `${seededBetween(i * 5 + 3, 2, 5)}s`,
      '--delay': `${seededBetween(i * 5 + 4, 0, 5)}s`,
      '--trail': `${seededBetween(i * 5 + 5, 40, 120)}px`,
    }));
  }, []);

  return (
    <div className={styles.shootingStars}>
      {stars.map((style, i) => (
        <div
          key={i}
          className={styles.shootingStar}
          style={style}
        />
      ))}
    </div>
  );
}

const YOUTUBE_VIDEOS = [
  { id: "1", title: "Can't Stop", videoId: "CAu8rI13xLw" },
  { id: "2", title: "TSUNAMI", videoId: "YhW7aRSlKBw" },
  { id: "3", title: "Let's Get Drunk", videoId: "s3jAl1SoFrg" },
  { id: "4", title: "Like Me", videoId: "jOj4mX9GRyg" },
  { id: "5", title: "Not Me", videoId: "PiOO2f42TmQ" },
  { id: "6", title: "Gặp Rồi Mình Yêu", videoId: "H1vZtfOFJUA" },
  { id: "7", title: "Ngày Không Em?", videoId: "MSG0rFcRDaI" },
  { id: "8", title: "Anh Đã Quen Với Cô Đơn", videoId: "agadGhsQSTU" },
  { id: "9", title: "Quay Về Bên Nhau", videoId: "ro62Fhrgu24" },
  { id: "10", title: "Như Ngày Đầu", videoId: "gz_MiXIBVuM" },
  { id: "11", title: "Chỉ Là Mơ (#CLM)", videoId: "pa9jfobLUYk" },
  { id: "12", title: "Tôi Đi", videoId: "vmdOfay7s34" },
  { id: "13", title: "Yêu Em Đến Già", videoId: "eIozInVSZ6Y" },
];

export default function MusicSection() {
  const sectionRef = useRef(null);
  const characterRef = useRef(null);
  const characterWrapperRef = useRef(null);
  const rightColRef = useRef(null);
  const [gsapObj, setGsapObj] = useState({ gsap: null, ScrollTrigger: null, ready: false });
  const [charReady, setCharReady] = useState(false);
  const [activeVideo, setActiveVideo] = useState(YOUTUBE_VIDEOS[0]);
  const [visible, setVisible] = useState(false);
  const { isMobile, isTablet } = useCanvasOptimizer();
  const isSmall = isMobile || isTablet;
  const reducedMotion = usePrefersReducedMotion();

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
    let cancelled = false;
    const load = async () => {
      try {
        const [g, s] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        const gsapInstance = g.default;
        const ScrollTriggerInstance = s.default || s.ScrollTrigger;
        if (!ScrollTriggerInstance) return;
        gsapInstance.registerPlugin(ScrollTriggerInstance);
        if (!cancelled) setGsapObj({ gsap: gsapInstance, ScrollTrigger: ScrollTriggerInstance, ready: true });
      } catch (e) { console.error(e); }
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
    if (!gsapObj.ready || !charReady || !sectionRef.current || reducedMotion) return;
    const { gsap, ScrollTrigger } = gsapObj;
    const group = characterRef.current?.current;
    if (!group) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top top",
          scrub: 0.5,
        },
      });

      if (characterWrapperRef.current) {
        tl.set(characterWrapperRef.current, { opacity: 1, x: 0 });
      }

      tl.set(group.position, { ...CHAR_CONFIG.endPos }, 0);
      tl.set(group.rotation, { ...CHAR_CONFIG.endRot }, 0);
      tl.set(group.scale, { ...CHAR_CONFIG.endScale }, 0);

      if (rightColRef.current) {
        tl.set(rightColRef.current, { opacity: 1, x: 0, filter: "blur(0px)" });
      }
    });

    return () => ctx.revert();
  }, [gsapObj, charReady, reducedMotion]);

  return (
    <section id="music" className={styles.music} ref={sectionRef}>
      <AuroraBackground isMobile={isMobile} />

      <div className={styles.starsLayer}>
        {visible && <ShootingStars />}
      </div>

      <div className={styles.musicContent}>
        <div className={styles.characterWrapper} ref={characterWrapperRef}>
          {!isSmall && <GlassPanel
            variant="dark"
            glow
            style={{
              position: "absolute",
              top: "15%",
              left: "45%",
              transform: "translateX(-50%)",
              width: 280,
              padding: "15px 20px",
              zIndex: 10,
              textAlign: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "0.85rem",
              lineHeight: 1.5,
            }}
          >
            Đây là những sản phẩm của Tachy đã phát hành chính thức, mời các đồng âm thưởng thức cùng mình nhé!
          </GlassPanel>}

          {!isSmall && <div className={styles.characterContainer}>
            <PointingCharacterCanvas
              ref={characterRef}
              isMobile={isMobile}
              sectionVisible={visible}
              initialPos={[CHAR_CONFIG.startPos.x, CHAR_CONFIG.startPos.y, CHAR_CONFIG.startPos.z]}
              initialRot={[CHAR_CONFIG.startRot.x, CHAR_CONFIG.startRot.y, CHAR_CONFIG.startRot.z]}
              initialScale={[CHAR_CONFIG.startScale.x, CHAR_CONFIG.startScale.y, CHAR_CONFIG.startScale.z]}
            />
          </div>}
        </div>

        <div className={styles.rightColumn} ref={rightColRef}>
          <SectionTitle
            label="Khám phá các tác phẩm của Tachy"
            subtitle="Music"
            align="left"
          />

          <GlassPanel variant="elevated" style={{ width: "100%", marginBottom: 25, overflow: "hidden", padding: 0 }}>
            <div className={styles.mainPlayer}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?rel=0&modestbranding=1`}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </GlassPanel>

          <div className={styles.playlistPanel}>
            <h3 className={styles.playlistTitle}>ALL TRACKS</h3>
            <div className={styles.playlist}>
              {YOUTUBE_VIDEOS.map((video, index) => (
                <div
                  key={video.id}
                  role="button"
                  tabIndex={0}
                  className={`${styles.trackItem} ${activeVideo.id === video.id ? styles.activeTrack : ""}`}
                  onClick={() => setActiveVideo(video)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveVideo(video); } }}
                >
                  <span className={styles.trackNumber}>{(index + 1).toString().padStart(2, '0')}</span>
                  <div className={styles.trackInfo}>
                    <span className={styles.trackName}>{video.title}</span>
                    <span className={styles.trackDate}>{video.date}</span>
                  </div>
                  <span className={styles.trackDuration}>{video.duration}</span>
                  {activeVideo.id === video.id && (
                    <div className={styles.playingBars}>
                      <span /><span /><span />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.scrollFade} />
          </div>
        </div>
      </div>
    </section>
  );
}
