"use client";

import { useRef, useEffect, useState } from "react";

export default function SectionTransition({ id, children, className = "", style = {} }) {
  const sectionRef = useRef(null);
  const [opacity, setOpacity] = useState(0);
  const [translateY, setTranslateY] = useState(40);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = Math.min(entry.intersectionRatio * 1.5, 1);
        const smoothRatio = Math.min(Math.max((ratio - 0.05) / 0.45, 0), 1);
        setOpacity(smoothRatio);
        setTranslateY(40 * (1 - smoothRatio));
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i * 0.05) }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={className}
      style={{
        willChange: "opacity, transform",
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: "opacity 0.1s ease, transform 0.1s ease",
        ...style,
      }}
    >
      {children}
    </section>
  );
}
