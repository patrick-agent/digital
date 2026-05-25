"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BorderGlow from "@/components/canvas/BorderGlow";
import styles from "./BioSection.module.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CHECKLIST = [
  "I'm an Indie Artist",
  "I'm a Music Producer",
  "The genre of music I am pursuing is RnB, Trapchill & Hip-hop",
];

const BIO_COPY =
  "I'm an independent artist creating music from the ground up — writing, producing, and recording everything on my own. My sound is rooted in RnB, Hip-hop, and Trapchill, blending smooth melodies with hard-hitting beats and raw emotion. I'm not signed to any label or agency — just driven by a deep passion for music and a desire to connect through honest, self-made sound. Every track I make is a piece of my journey — real, unfiltered, and always evolving. Whether you're here to vibe, reflect, or just get lost in the music, thank you for listening. Welcome to my world.";

export default function BioSection() {
  const sectionRef = useRef(null);
  const photoRef = useRef(null);
  const frameRef = useRef(null);
  const contentRefs = useRef([]);

  const addToRefs = (el, index) => {
    contentRefs.current[index] = el;
  };

  useGSAP(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    if (photoRef.current) {
      gsap.fromTo(
        photoRef.current,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0 0 0 0)",
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: photoRef.current,
            start: "top 80%",
          },
        }
      );
    }

    if (frameRef.current) {
      gsap.fromTo(
        frameRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: frameRef.current,
            start: "top 80%",
          },
        }
      );
    }

    contentRefs.current.forEach((el) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.bioSection}>
      <div className={styles.bioContainer}>
        <div className={styles.bioLeft}>
          <div ref={frameRef} className={styles.photoFrame}>
            <BorderGlow
              glowColor="268 100 76"
              backgroundColor="transparent"
              borderRadius={16}
              glowRadius={40}
              glowIntensity={1.2}
              coneSpread={25}
              animated
              colors={['#c084fc', '#f472b6', '#38bdf8']}
              fillOpacity={0.4}
            >
              <div ref={photoRef} className={styles.photoWrapper}>
                <Image
                  src="/images/tachy-about.jpg"
                  alt="Tachy - Artist Photo"
                  width={400}
                  height={500}
                  className={styles.photo}
                  priority
                />
              </div>
            </BorderGlow>
          </div>
        </div>

        <div className={styles.bioRight}>
          <span
            ref={(el) => addToRefs(el, 0)}
            className={styles.overline}
          >
            Artist Introductions
          </span>

          <h2
            ref={(el) => addToRefs(el, 1)}
            className={styles.heading}
          >
            Get to know about Tachy
          </h2>

          <p
            ref={(el) => addToRefs(el, 2)}
            className={styles.bodyCopy}
          >
            {BIO_COPY}
          </p>

          <ul
            ref={(el) => addToRefs(el, 3)}
            className={styles.checklist}
          >
            {CHECKLIST.map((item, i) => (
              <li key={i} className={styles.checkItem}>
                <span className={styles.checkIcon} />
                {item}
              </li>
            ))}
          </ul>

          <div ref={(el) => addToRefs(el, 4)} className={styles.ctaWrapper}>
            <a
              href="https://youtube.com/@TachyNgo"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaButton}
            >
              SUBSCRIBE ME ON YOUTUBE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
