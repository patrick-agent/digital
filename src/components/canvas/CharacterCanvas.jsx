"use client";
import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import CharacterModel from "./CharacterModel";
import PostProcessing from "./PostProcessing";
import { useCanvasOptimizer } from "@/hooks/useCanvasOptimizer";

function toNorm(clientX, clientY, rect) {
  return {
    x: ((clientX - rect.left) / rect.width) * 2 - 1,
    y: -(((clientY - rect.top) / rect.height) * 2 - 1),
  };
}

function calcScroll() {
  return Math.min(
    Math.max((window.scrollY || window.pageYOffset) / window.innerHeight, 0),
    1
  );
}

export default function CharacterCanvas() {
  const wrapRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const scrollTick = useRef(0);
  const { isMobile, isTablet, devicePixelRatio } = useCanvasOptimizer();

  useEffect(() => {
    setMounted(true);
    setScrollProgress(calcScroll());
  }, []);

  const onMouseMove = useCallback((e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (rect) setMousePos(toNorm(e.clientX, e.clientY, rect));
  }, []);

  const onMouseLeave = useCallback(() => setMousePos({ x: 0, y: 0 }), []);
  const onScroll = useCallback(() => {
    const now = performance.now();
    if (now - scrollTick.current < 100) return;
    scrollTick.current = now;
    setScrollProgress(calcScroll());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isMobile) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("mouseleave", onMouseLeave);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [mounted, onMouseMove, onMouseLeave, onScroll, isMobile]);

  if (!mounted) return null;

  return (
    <div
      ref={wrapRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        opacity: 1,
      }}
    >
      <Canvas
        camera={{
          position: isMobile ? [80, 45, 180] : isTablet ? [60, 50, 120] : [60, 50, 120],
          fov:      isMobile ? 20 :            isTablet ? 25            : 32,
          near: 0.1,
          far: 1000,
        }}
        onCreated={({ camera }) => {
          camera.lookAt(isMobile ? 0 : isTablet ? 0 : 10, isMobile ? 40 : isTablet ? 45 : 40, 0);
        }}
        gl={{ alpha: true, antialias: false }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={3} color="#ffffff" />
        <pointLight position={[5, 5, 5]} intensity={4} color="#c084fc" />
        <pointLight position={[-5, 3, 5]} intensity={2.5} color="#8b5cf6" />
        <directionalLight position={[0, 5, 5]} intensity={3} color="#ffffff" />

        <PostProcessing
          bloomIntensity={isMobile ? 0.6 : 1.0}
          bloom={true}
          noise={false}
          chromaticAberration={false}
          vignette={false}
        />
        <Suspense fallback={null}>
          <CharacterModel
            mousePos={isMobile ? { x: 0, y: 0 } : mousePos}
            scrollProgress={scrollProgress}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
