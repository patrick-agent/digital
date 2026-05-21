// ============================================
// BackgroundEffects — Animated background particles and effects
// ============================================
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Floating particles that follow mouse slightly
function FloatingParticles({ count = 200 }) {
  const mesh = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      const size = Math.random() * 0.05 + 0.02;
      const speed = Math.random() * 0.5 + 0.1;
      temp.push({ x, y, z, size, speed, originalY: y });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!mesh.current) return;
    
    const time = state.clock.getElapsedTime();
    
    particles.forEach((particle, i) => {
      // Floating animation
      const yOffset = Math.sin(time * particle.speed + i) * 0.5;
      
      dummy.position.set(
        particle.x,
        particle.originalY + yOffset,
        particle.z
      );
      dummy.scale.setScalar(particle.size);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
    </instancedMesh>
  );
}

// Grid floor with glow effect
function GridFloor() {
  return (
    <group position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <gridHelper args={[50, 50, "#4a1a6b", "#2d1b4e"]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial 
          color="#1a0a2e" 
          transparent 
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}

// Glowing orbs in background
function GlowingOrbs() {
  const orbs = useMemo(() => [
    { position: [-8, 5, -10], color: "#a855f7", size: 2 },
    { position: [10, 3, -15], color: "#ec4899", size: 1.5 },
    { position: [0, 8, -20], color: "#3b82f6", size: 3 },
    { position: [-12, -2, -8], color: "#8b5cf6", size: 1 },
  ], []);

  return (
    <>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position}>
          <sphereGeometry args={[orb.size, 32, 32]} />
          <meshBasicMaterial 
            color={orb.color} 
            transparent 
            opacity={0.3}
          />
        </mesh>
      ))}
    </>
  );
}

// Animated wave rings
function WaveRings() {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.z = time * 0.1;
  });

  return (
    <group ref={groupRef} position={[0, 0, -15]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2 + i * 2, 2.1 + i * 2, 64]} />
          <meshBasicMaterial 
            color="#a855f7" 
            transparent 
            opacity={0.2 - i * 0.04}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function BackgroundEffects() {
  return (
    <>
      <FloatingParticles count={150} />
      <GridFloor />
      <GlowingOrbs />
      <WaveRings />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 10, 0]} intensity={1} color="#a855f7" />
      <pointLight position={[10, 5, 5]} intensity={0.5} color="#ec4899" />
    </>
  );
}