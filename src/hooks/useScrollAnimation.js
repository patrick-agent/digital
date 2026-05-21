// ============================================
// useScrollAnimation — Custom hook for GSAP ScrollTrigger animations
// ============================================
"use client";

import { useEffect, useRef } from "react";

/**
 * Custom hook to set up GSAP ScrollTrigger animations
 * Will be expanded with specific animation logic in the content phase
 */
export function useScrollAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    // GSAP + ScrollTrigger setup will go here
    // Dynamic import to avoid SSR issues
    let ctx;
    const initGSAP = async () => {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.default;

      gsap.registerPlugin(ScrollTrigger);

      // Animation context for cleanup
      ctx = gsap.context(() => {
        // Animations will be added here
      }, containerRef);
    };

    initGSAP();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return containerRef;
}
