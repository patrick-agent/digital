// ============================================
// HeroCanvas — 3D Canvas for the Hero Section
// Loads the studio background (GLB) and character (FBX)
// ============================================
"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import StudioModel from "./StudioModel";
import CharacterModel from "./CharacterModel";

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.8} color="#d0c8e8" />
      <spotLight
        position={[0, 8, 2]}
        angle={0.6}
        penumbra={0.8}
        intensity={3}
        color="#a855f7"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight
        position={[-4, 4, 6]}
        angle={0.5}
        penumbra={1}
        intensity={1.5}
        color="#ffffff"
      />
      <pointLight position={[3, 2, -4]} intensity={1} color="#ec4899" />
      <pointLight position={[-2, -1, 3]} intensity={0.5} color="#06b6d4" />
      <directionalLight position={[0, 4, 5]} intensity={1.5} color="#f0e6ff" />
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#a855f7" wireframe opacity={0.5} transparent />
    </mesh>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 3.5], fov: 55, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={["#060608", 2, 10]} />
      <SceneLights />

      <Suspense fallback={<LoadingFallback />}>
        {/* We center the scene so the camera looks right at it */}
        <group position={[0, -0.5, 0]}>
          <StudioModel />
          <CharacterModel />
        </group>
        <Environment preset="night" />
      </Suspense>

      <OrbitControls
        enableZoom={true} // Allow zoom temporarily for testing if needed by user
        enablePan={true} // Allow pan temporarily
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
        target={[0, 0.5, 0]}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
}
