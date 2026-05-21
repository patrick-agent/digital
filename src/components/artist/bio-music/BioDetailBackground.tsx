"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"
import styles from "./BioDetailBackground.module.css"

function FloatingRing() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.x = t * 0.08
    meshRef.current.rotation.y = t * 0.05
    meshRef.current.position.y = Math.sin(t * 0.3) * 0.15
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1.2, 0.02, 16, 64]} />
      <meshStandardMaterial
        color="#a855f7"
        emissive="#a855f7"
        emissiveIntensity={0.4}
        transparent
        opacity={0.12}
      />
    </mesh>
  )
}

function FloatingSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.position.x = Math.sin(t * 0.2) * 0.3 + 2.5
    meshRef.current.position.y = Math.cos(t * 0.15) * 0.4 - 0.5
    meshRef.current.rotation.y = t * 0.1
  })

  return (
    <mesh ref={meshRef} position={[2.5, -0.5, -1]}>
      <icosahedronGeometry args={[0.15, 1]} />
      <meshStandardMaterial
        color="#ec4899"
        emissive="#ec4899"
        emissiveIntensity={0.3}
        transparent
        opacity={0.1}
        wireframe
      />
    </mesh>
  )
}

export default function BioDetailBackground() {
  return (
    <div className={styles.bgContainer}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50, near: 0.1, far: 20 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[2, 2, 2]} intensity={0.5} color="#a855f7" />
        <FloatingRing />
        <FloatingSphere />
      </Canvas>
    </div>
  )
}
