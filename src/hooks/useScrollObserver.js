"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useScrollObserver(sectionIds = []) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || "");
  const [sectionProgress, setSectionProgress] = useState({});
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          const ratio = Math.min(entry.intersectionRatio * 2, 1);

          setSectionProgress((prev) => ({
            ...prev,
            [id]: ratio,
          }));

          if (ratio > 0.3) {
            setActiveSection(id);
          }
        });
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: "-80px 0px 0px 0px",
      }
    );

    observerRef.current = observer;

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  const getSectionOpacity = useCallback(
    (id) => {
      const progress = sectionProgress[id] || 0;
      return Math.min(Math.max((progress - 0.1) / 0.4, 0), 1);
    },
    [sectionProgress]
  );

  return { activeSection, sectionProgress, getSectionOpacity };
}

export function useScrollProgress() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("down");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrollDirection(current > lastScrollY.current ? "down" : "up");
      lastScrollY.current = current;
      setScrollY(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getNormalizedScroll = useCallback(() => {
    const docEl = document.documentElement;
    const scrollTop = window.scrollY;
    const scrollHeight = docEl.scrollHeight - window.innerHeight;
    return scrollHeight > 0 ? scrollTop / scrollHeight : 0;
  }, []);

  return { scrollY, scrollDirection, getNormalizedScroll };
}
