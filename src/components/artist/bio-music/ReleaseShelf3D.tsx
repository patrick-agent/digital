"use client"

import { useRef, useState, useEffect, useMemo, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import styles from "./ReleaseShelf3D.module.css"

type ShelfRelease = {
  id: string
  slug: string
  title: string
  type: string
  coverArt?: string
  streamingLinks?: Record<string, string>
}

interface ReleaseShelf3DProps {
  releases: ShelfRelease[]
}

/* ─── Fallback colored material (no image) ─── */
function FallbackMaterial({ color, isActive }: { color: string; isActive: boolean }) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={isActive ? 0.3 : 0.05}
      transparent
      opacity={isActive ? 1 : 0.5}
      side={THREE.DoubleSide}
    />
  )
}

/* ─── Card with texture image ─── */
function TexturedCard({
  release,
  index,
  activeIndex,
  total,
  onClick,
}: {
  release: ShelfRelease
  index: number
  activeIndex: number
  total: number
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const targetX = useRef(0)
  const targetZ = useRef(0)
  const targetScale = useRef(1)
  const isActive = index === activeIndex

  const angleSpread = Math.PI * 0.6
  const radius = 4
  const angle = total > 1
    ? -angleSpread / 2 + (index / (total - 1)) * angleSpread
    : 0

  const baseX = Math.sin(angle) * radius
  const baseZ = -Math.cos(angle) * radius + radius

  // Load texture from cover art URL
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [textureError, setTextureError] = useState(false)

  useEffect(() => {
    if (!release.coverArt) {
      setTexture(null)
      setTextureError(false)
      return
    }
    setTextureError(false)
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = "anonymous"
    loader.load(
      release.coverArt,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        setTexture(tex)
      },
      undefined,
      () => setTextureError(true)
    )
  }, [release.coverArt])

  useEffect(() => {
    targetX.current = isActive ? 0 : baseX
    targetZ.current = isActive ? 0.5 : baseZ
    targetScale.current = isActive ? 1.15 : 0.8
  }, [isActive, baseX, baseZ])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX.current, delta * 3)
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ.current, delta * 3)
    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale.current, delta * 3)
    meshRef.current.scale.set(s, s, s)
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, isActive ? 0 : -angle * 0.3, delta * 3)
  })

  const fallbackColor = useMemo(() => {
    const colors = ["#a855f7", "#6366f1", "#ec4899", "#06b6d4", "#f59e0b"]
    return colors[index % colors.length]
  }, [index])

  const hasImage = texture && !textureError

  return (
    <mesh
      ref={meshRef}
      position={[baseX, 0, baseZ]}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      onPointerOver={() => { document.body.style.cursor = "pointer" }}
      onPointerOut={() => { document.body.style.cursor = "auto" }}
    >
      <planeGeometry args={[1.8, 1.8]} />
      {hasImage ? (
        <meshStandardMaterial
          map={texture}
          emissive="#ffffff"
          emissiveIntensity={isActive ? 0.15 : 0.02}
          transparent
          opacity={isActive ? 1 : 0.5}
          side={THREE.DoubleSide}
        />
      ) : (
        <FallbackMaterial color={fallbackColor} isActive={isActive} />
      )}
    </mesh>
  )
}

/* ─── 3D Card wrapper (chooses textured vs fallback) ─── */
function ReleaseCard3D(props: {
  release: ShelfRelease
  index: number
  activeIndex: number
  total: number
  onClick: () => void
}) {
  return <TexturedCard {...props} />
}

/* ─── Scene content ─── */
function ShelfScene({
  releases: releasesList,
  activeIndex,
  onCardClick,
}: {
  releases: ShelfRelease[]
  activeIndex: number
  onCardClick: (index: number) => void
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 3, 2]} intensity={2} color="#a855f7" />
      <pointLight position={[-3, 2, -2]} intensity={1} color="#ec4899" />
      <pointLight position={[3, 2, -2]} intensity={1} color="#6366f1" />

      {releasesList.map((release, i) => (
        <ReleaseCard3D
          key={release.id}
          release={release}
          index={i}
          activeIndex={activeIndex}
          total={releasesList.length}
          onClick={() => onCardClick(i)}
        />
      ))}
    </>
  )
}

/* ─── Main exported component ─── */
export default function ReleaseShelf3D({ releases }: ReleaseShelf3DProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const total = releases.length

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % total)
  }

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  })

  const activeRelease = releases[activeIndex]

  return (
    <div className={styles.shelfContainer}>
      <div className={styles.canvasWrapper}>
        <Canvas
          camera={{ position: [0, 1.5, 4], fov: 50, near: 0.1, far: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <ShelfScene
              releases={releases}
              activeIndex={activeIndex}
              onCardClick={setActiveIndex}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* HTML overlay for active release info */}
      <div className={styles.overlay}>
        <div className={styles.overlayContent}>
          <span className={styles.overlayType}>{activeRelease.type}</span>
          <h3 className={styles.overlayTitle}>{activeRelease.title}</h3>
          <a href={`/bio-music/${activeRelease.slug}`} className={styles.overlayBtn}>
            Listen
          </a>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        className={`${styles.navBtn} ${styles.navBtnLeft}`}
        onClick={goPrev}
        aria-label="Previous release"
      >
        ←
      </button>
      <button
        className={`${styles.navBtn} ${styles.navBtnRight}`}
        onClick={goNext}
        aria-label="Next release"
      >
        →
      </button>

      {/* Dots indicator */}
      <div className={styles.dots}>
        {releases.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to release ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
