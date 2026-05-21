// ============================================
// Scene3D — Main 3D Canvas Component
// Wraps React Three Fiber Canvas & all 3D objects
// ============================================
"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";

export default function Scene3D() {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#a855f7" />
        <pointLight position={[-10, -10, -5]} intensity={0.4} color="#6366f1" />

        {/* 3D Objects will be added here */}

        <Preload all />
      </Canvas>
    </div>
  );
}
