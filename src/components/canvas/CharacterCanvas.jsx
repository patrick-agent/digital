"use client";
import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import CharacterModel from "./CharacterModel";
import GlowBackground from "./GlowBackground";
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
  const [show3D, setShow3D] = useState(undefined);
  const { isMobile, devicePixelRatio, getResponsiveFov } = useCanvasOptimizer();

  useEffect(() => {
    setMounted(true);
    setScrollProgress(calcScroll());
    if (typeof window === "undefined") return;
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 4;
    if (window.innerWidth < 768 || (cores <= 4 && memory <= 4)) {
      setShow3D(false);
    } else {
      setShow3D(true);
    }
  }, []);

  const onMouseMove = useCallback((e) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (rect) setMousePos(toNorm(e.clientX, e.clientY, rect));
  }, []);

  const onTouchMove = useCallback((e) => {
    if (isMobile) return;
    const t = e.touches[0];
    const rect = wrapRef.current?.getBoundingClientRect();
    if (t && rect) setMousePos(toNorm(t.clientX, t.clientY, rect));
  }, [isMobile]);

  const onMouseLeave = useCallback(() => setMousePos({ x: 0, y: 0 }), []);
  const onScroll = useCallback(() => setScrollProgress(calcScroll()), []);

  useEffect(() => {
    if (!mounted) return;
    if (!isMobile) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [mounted, onMouseMove, onTouchMove, onMouseLeave, onScroll, isMobile]);

  if (show3D === false || !mounted) return null;
  if (show3D === undefined) return null;

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
          position: [60, 55, 118.65],
          fov: getResponsiveFov(30),
          near: 0.1,
          far: 1000,
        }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 42, 0);
        }}
        gl={{ alpha: true, antialias: false }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
        dpr={[1, 1.5]}
      >
        <GlowBackground color="#a855f7" secondaryColor="#6366f1" intensity={0.6} radius={30} />
        <ambientLight intensity={2} color="#ffffff" />
        <pointLight position={[5, 5, 5]} intensity={3} color="#c084fc" />
        <pointLight position={[-5, 3, 5]} intensity={2} color="#8b5cf6" />
        <directionalLight position={[0, 5, 5]} intensity={2} color="#f0e6ff" />

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
