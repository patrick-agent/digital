"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import styles from "./HeroAbout.module.css";

gsap.registerPlugin(useGSAP);

const AboutCanvas = dynamic(() => import("./AboutCanvas"), { ssr: false, loading: () => null });

export default function HeroAbout() {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const overlineRef = useRef(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.set([overlineRef.current, headingRef.current], { clearProps: "all" });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      overlineRef.current,
      { opacity: 0, y: 20, filter: "blur(6px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6 }
    );

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 40, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
      "-=0.3"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className={styles.hero}>
      <div className={styles.canvasBg}>
        <AboutCanvas />
      </div>
      <div className={styles.heroContent}>
        <span ref={overlineRef} className={styles.overline}>
          Artist Introductions
        </span>
        <h1 ref={headingRef} className={styles.heading}>
          Get to know about Tachy
        </h1>
      </div>
    </section>
  );
}
