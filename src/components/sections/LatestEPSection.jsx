"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AuroraBackground from "./AuroraBackground";
import styles from "./LatestEPSection.module.css";
import GlassPanel from "../ui/GlassPanel";
import SectionTitle from "../ui/SectionTitle";
import { useCanvasOptimizer } from "@/hooks/useCanvasOptimizer";

const WaveCharacterCanvas = dynamic(
  () => import("../canvas/WaveCharacterCanvas"),
  { ssr: false, loading: () => null }
);

const degToRad = (deg) => (deg * Math.PI) / 180;

const SECTION_CONFIG = {
  startPos: { x: 0, y: 0, z: 0 },
  startRot: { x: 0, y: 0, z: 0 },
  startScale: { x: 0.7, y: 0.7, z: 0.7 },
  endPos: { x: 0, y: 0, z: 0 },
  endScale: { x: 0.7, y: 0.7, z: 0.7 },
  spinRotation: 360,
};

const PLATFORMS = [
  {
    id: "spotify",
    title: "Spotify",
    embed: `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/album/1ttXbT6etaDkC20aNikzvw?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`,
  },
  {
    id: "soundcloud",
    title: "SoundCloud",
    embed: `<iframe width="100%" height="150" scrolling="no" frameborder="no" loading="lazy" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A2034733239&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>`,
  },
  {
    id: "apple",
    title: "Apple Music",
    embed: `<iframe allow="encrypted-media *;" frameborder="0" height="150" loading="lazy" style="width:100%;border-radius:12px" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/gb/album/the-love-ep/1819560384"></iframe>`,
  },
  {
    id: "amazon",
    title: "Amazon Music",
    embed: `<iframe id="AmazonMusicEmbedB0FCMVJD1C" src="https://music.amazon.com/embed/B0FCMVJD1C/?id=o9xGnAdU8V&marketplaceId=ATVPDKIKX0DER&musicTerritory=US" width="100%" height="352px" frameBorder="0" loading="lazy" style="border-radius:20px;max-width:100%"></iframe>`,
  },
];

export default function LatestEPSection() {
  const sectionRef = useRef(null);
  const characterRef = useRef(null);
  const characterWrapperRef = useRef(null);
  const [gsapObj, setGsapObj] = useState({ gsap: null, ScrollTrigger: null, ready: false });
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
    if (!gsapObj.ready || !charReady || !sectionRef.current) return;
    const { gsap, ScrollTrigger } = gsapObj;
    const group = characterRef.current?.current;
    if (!group) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top 50%",
          scrub: 2,
        },
      });

      if (characterWrapperRef.current) {
        tl.fromTo(characterWrapperRef.current,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 1, ease: "power2.out", immediateRender: false },
          0
        );
      }

      const startRotY = group.rotation.y;
      const spinRad = degToRad(SECTION_CONFIG.spinRotation);

      tl.to(group.position, { x: SECTION_CONFIG.endPos.x, duration: 2, ease: "power3.inOut" }, 0);
      tl.to(group.rotation, { y: startRotY + spinRad, duration: 2, ease: "power3.inOut" }, 0);
      tl.to(group.scale, { ...SECTION_CONFIG.endScale, duration: 2, ease: "power3.inOut" }, 0);
    });

    return () => ctx.revert();
  }, [gsapObj, charReady]);

  return (
    <section id="latest-ep" className={styles.latestEp} ref={sectionRef}>
      <AuroraBackground isMobile={isMobile} />

      <div className={styles.content}>
        <div className={styles.leftColumn}>
          <SectionTitle
            label="Explore Tachy's Latest EP."
            subtitle="Latest Release"
            align="left"
          />

          <div className={styles.embedsContainer}>
            {PLATFORMS.map((platform) => (
              <GlassPanel key={platform.id} variant="dark" hoverEffect={false} style={{ overflow: "hidden", padding: 0 }}>
                <div
                  className={styles.embedFrame}
                  dangerouslySetInnerHTML={{ __html: platform.embed }}
                />
              </GlassPanel>
            ))}
          </div>
        </div>

        {!isSmall && <div className={styles.rightColumn}>
          <div className={styles.characterWrapper} ref={characterWrapperRef}>
            <div className={styles.characterContainer}>
              <WaveCharacterCanvas
                ref={characterRef}
                isMobile={isMobile}
                sectionVisible={visible}
                initialPos={[SECTION_CONFIG.startPos.x, SECTION_CONFIG.startPos.y, SECTION_CONFIG.startPos.z]}
                initialRot={[SECTION_CONFIG.startRot.x, SECTION_CONFIG.startRot.y, SECTION_CONFIG.startRot.z]}
                initialScale={[SECTION_CONFIG.startScale.x, SECTION_CONFIG.startScale.y, SECTION_CONFIG.startScale.z]}
              />
            </div>
          </div>
        </div>}
      </div>
    </section>
  );
}
