"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useVisibilityLoader(options = {}) {
  const { rootMargin = "200px", threshold = 0, once = false } = options;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let mounted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!mounted) return;
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasBeenVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, [rootMargin, threshold]);

  const getVisibilityStyle = useCallback(
    (fadeIn = true) => ({
      opacity: isVisible || hasBeenVisible ? 1 : 0,
      transition: fadeIn ? "opacity 0.3s ease" : "none",
    }),
    [isVisible, hasBeenVisible]
  );

  return { ref, isVisible, hasBeenVisible, getVisibilityStyle };
}

export function getDeviceType() {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState("desktop");

  useEffect(() => {
    const update = () => setDeviceType(getDeviceType());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return deviceType;
}
