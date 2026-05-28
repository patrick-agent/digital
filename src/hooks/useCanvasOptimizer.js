"use client";
import { useEffect, useRef, useState, useCallback } from "react";

function getDeviceType() {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function useCanvasOptimizer(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = "200px",
    pixelRatioCap = 1.5,
    mobilePixelRatioCap = 1,
    skipInitialVisibility = false,
  } = options;

  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(!skipInitialVisibility);
  const [devicePixelRatio, setDevicePixelRatio] = useState(1);
  const [frameloop, setFrameloop] = useState("always");
  const [deviceType, setDeviceType] = useState("desktop");

  useEffect(() => {
    const updateDevice = () => {
      setDeviceType(getDeviceType());
    };
    updateDevice();
    window.addEventListener("resize", updateDevice);
    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  useEffect(() => {
    const dpr = Math.min(
      window.devicePixelRatio,
      deviceType === "mobile" ? mobilePixelRatioCap : pixelRatioCap
    );
    setDevicePixelRatio(dpr);
  }, [pixelRatioCap, mobilePixelRatioCap, deviceType]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        setFrameloop(entry.isIntersecting ? "always" : "demand");
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const getResponsiveFov = useCallback((baseFov = 50) => {
    if (typeof window === "undefined") return baseFov;
    const width = window.innerWidth;
    if (width < 640) return baseFov + 15;
    if (width < 1024) return baseFov + 8;
    return baseFov;
  }, []);

  const getResponsiveParticleCount = useCallback((baseCount = 200) => {
    if (deviceType === "mobile") return Math.floor(baseCount * 0.25);
    if (deviceType === "tablet") return Math.floor(baseCount * 0.5);
    return baseCount;
  }, [deviceType]);

  const getPostProcessingConfig = useCallback(() => {
    if (deviceType === "mobile") {
      return {
        bloom: false,
        noise: false,
        chromaticAberration: false,
        vignette: true,
        vignetteDarkness: 0.6,
      };
    }
    if (deviceType === "tablet") {
      return {
        bloom: true,
        bloomIntensity: 0.5,
        noise: false,
        chromaticAberration: false,
        vignette: true,
        vignetteDarkness: 0.4,
      };
    }
    return {
      bloom: true,
      bloomIntensity: 1,
      noise: true,
      noiseOpacity: 0.03,
      chromaticAberration: true,
      chromaticOffset: 0.002,
      vignette: true,
      vignetteDarkness: 0.4,
    };
  }, [deviceType]);

  const isMobile = deviceType === "mobile";
  const isTablet = deviceType === "tablet";
  const isDesktop = deviceType === "desktop";

  return {
    containerRef,
    isVisible,
    devicePixelRatio: [1, devicePixelRatio],
    frameloop,
    getResponsiveFov,
    getResponsiveParticleCount,
    getPostProcessingConfig,
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
  };
}

export function useFpsMonitor() {
  const fpsRef = useRef(0);
  const framesRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    let rafId;
    const tick = () => {
      framesRef.current++;
      const now = performance.now();
      if (now - lastTimeRef.current >= 1000) {
        fpsRef.current = framesRef.current;
        framesRef.current = 0;
        lastTimeRef.current = now;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return fpsRef;
}
