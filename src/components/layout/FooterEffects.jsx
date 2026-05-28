"use client";

import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import ParticleField from "../canvas/ParticleField";
import { useCanvasOptimizer } from "@/hooks/useCanvasOptimizer";

const ByeCharacterCanvas = dynamic(
  () => import("../canvas/ByeCharacterCanvas"),
  { ssr: false, loading: () => null }
);

function ParticleBackground({ isMobile }) {
  const { devicePixelRatio, isVisible } = useCanvasOptimizer({ threshold: 0 });
  const particleCount = isMobile ? 30 : 60;

  return (
    <Canvas
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      camera={{ position: [0, 0, 10], fov: 60, near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      dpr={devicePixelRatio}
      frameloop={isVisible ? "always" : "demand"}
    >
      <ambientLight intensity={0.5} />
      <ParticleField
        count={particleCount}
        color="#a855f7"
        spread={18}
        size={0.025}
        opacity={0.12}
        mouseReactive={!isMobile}
      />
    </Canvas>
  );
}

export default function FooterEffects({ canvasClassName, modelClassName }) {
  const { isMobile } = useCanvasOptimizer();

  return (
    <>
      <div className={canvasClassName}>
        <ParticleBackground isMobile={isMobile} />
      </div>
      <div className={modelClassName}>
        <ByeCharacterCanvas />
      </div>
    </>
  );
}
