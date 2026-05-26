"use client";
import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import CharacterModel from "./CharacterModel";
import PostProcessing from "./PostProcessing";
import { useCanvasOptimizer } from "@/hooks/useCanvasOptimizer";
import { useLoading } from "@/context/LoadingContext";
import * as THREE from "three";

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

/**
 * Optimized Character Canvas with device-aware rendering
 * Includes memory management and error recovery for mobile devices
 */
export default function CharacterCanvas() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const scrollTick = useRef(0);
  const { isMobile, isTablet, devicePixelRatio } = useCanvasOptimizer();
  const { markReady } = useLoading();

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

  // Handle WebGL context loss
  const handleContextLoss = useCallback(() => {
    console.warn("Canvas WebGL context lost");
    setContextLost(true);
    // Try to recover
    setTimeout(() => setContextLost(false), 1000);
  }, []);

  const handleContextRestore = useCallback(() => {
    console.log("Canvas WebGL context restored");
    setContextLost(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("webglcontextlost", handleContextLoss);
      canvas.addEventListener("webglcontextrestored", handleContextRestore);
    }

    if (!isMobile) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("mouseleave", onMouseLeave);
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (canvas) {
        canvas.removeEventListener("webglcontextlost", handleContextLoss);
        canvas.removeEventListener("webglcontextrestored", handleContextRestore);
      }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [mounted, onMouseMove, onMouseLeave, onScroll, isMobile, handleContextLoss, handleContextRestore]);

  if (!mounted || contextLost) {
    return (
      <div
        ref={wrapRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          opacity: contextLost ? 0.5 : 1,
          backgroundColor: contextLost ? "rgba(0,0,0,0.3)" : "transparent",
        }}
      >
        {contextLost && (
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontSize: "12px",
          }}>
            Recovering...
          </div>
        )}
      </div>
    );
  }

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
        ref={canvasRef}
        camera={{
          position: isMobile ? [80, 45, 180] : isTablet ? [60, 50, 120] : [60, 50, 120],
          fov:      isMobile ? 20 :            isTablet ? 25            : 32,
          near: 0.1,
          far: 1000,
        }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(isMobile ? 0 : isTablet ? 0 : 10, isMobile ? 40 : isTablet ? 45 : 40, 0);

          // Memory optimization for mobile
          if (isMobile) {
            gl.setPixelRatio(1);
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }
        }}
        gl={{ 
          alpha: true, 
          antialias: !isMobile,
          powerPreference: "low-power",
          failIfMajorPerformanceCaveat: true,
          preserveDrawingBuffer: false,
        }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
        dpr={[1, isTablet ? 1.5 : 1]}
      >
        <ambientLight intensity={3} color="#ffffff" />
        <pointLight position={[5, 5, 5]} intensity={4} color="#c084fc" />
        <pointLight position={[-5, 3, 5]} intensity={2.5} color="#8b5cf6" />
        <directionalLight position={[0, 5, 5]} intensity={3} color="#ffffff" />

        <PostProcessing
          bloomIntensity={isMobile ? 1 : 0.8}
          bloom={!isMobile}
          noise={!isMobile}
          chromaticAberration={false}
          vignette={!isMobile}
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
