"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useCanvasOptimizer } from "@/hooks/useCanvasOptimizer";

function FloatingShape({ type, position, color, rotationSpeed, floatSpeed, scale }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x += rotationSpeed * 0.01;
    meshRef.current.rotation.y += rotationSpeed * 0.015;
    meshRef.current.position.y = position[1] + Math.sin(t * floatSpeed) * 0.3;
  });

  const geometryMap = {
    icosahedron: <icosahedronGeometry args={[1, 1]} />,
    torusKnot: <torusKnotGeometry args={[0.6, 0.2, 64, 8]} />,
    octahedron: <octahedronGeometry args={[0.8, 0]} />,
  };

  return (
    <Float speed={floatSpeed} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometryMap[type]}
        <meshPhysicalMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          transparent
          opacity={0.35}
          wireframe
        />
      </mesh>
    </Float>
  );
}

const SHAPES = [
  { type: "icosahedron", position: [-3, 1, -2], color: "#a855f7", rotationSpeed: 0.3, floatSpeed: 0.5, scale: 1.5 },
  { type: "torusKnot", position: [2.5, -0.5, -3], color: "#6366f1", rotationSpeed: 0.2, floatSpeed: 0.4, scale: 1.2 },
  { type: "octahedron", position: [0, 1.5, -4], color: "#ec4899", rotationSpeed: 0.25, floatSpeed: 0.6, scale: 1.3 },
];

function AboutScene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#a855f7" />
      <pointLight position={[-3, 2, 3]} intensity={1.5} color="#6366f1" />
      <pointLight position={[0, -2, 2]} intensity={1} color="#ec4899" />
      {SHAPES.map((shape, i) => (
        <FloatingShape key={i} {...shape} />
      ))}
    </>
  );
}

export default function AboutCanvas() {
  const { containerRef, devicePixelRatio } = useCanvasOptimizer({ threshold: 0 });

  return (
    <div ref={containerRef} className="about-canvas-wrapper">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60, near: 0.1, far: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        dpr={devicePixelRatio}
        style={{ pointerEvents: "none" }}
      >
        <AboutScene />
      </Canvas>
    </div>
  );
}
