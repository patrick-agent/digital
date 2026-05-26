"use client";

import { Suspense, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useCanvasOptimizer } from "@/hooks/useCanvasOptimizer";
import TeleportBeam from "./TeleportBeam";
import GlowBackground from "./GlowBackground";
import ParticleField from "./ParticleField";
import FloatingGeometries from "./FloatingGeometries";


function HologramBase() {
  const gridRef = useRef();

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.material.transparent = true;
      gridRef.current.material.opacity = 0.1;
    }
  }, []);

  useFrame((_, delta) => {
    if (gridRef.current) {
      gridRef.current.position.z += delta * 12;
      if (gridRef.current.position.z > 5) {
        gridRef.current.position.z = 0;
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
        <ringGeometry args={[25, 27, 64]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -2, 0]}>
        <cylinderGeometry args={[25, 30, 4, 64]} />
        <meshStandardMaterial color="#0f0a1a" metalness={0.8} roughness={0.2} transparent opacity={0.9} />
      </mesh>
      <group position={[0, -2.1, 0]}>
        <gridHelper ref={gridRef} args={[600, 120, '#c084fc', '#581c87']} />
      </group>
      <TeleportBeam color="#c084fc" height={55} radius={26} />
    </group>
  );
}

function CharacterModel({ mousePos }) {
  const { scene, animations } = useGLTF("/models/Walking.glb");
  const mixerRef = useRef(null);
  const smoothMouse = useRef({ x: 0, y: 0 });
  const headBoneRef = useRef(null);
  const neckBoneRef = useRef(null);

  useEffect(() => {
    if (!scene) return;
    try {
      scene.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.fog = false;
            child.material.emissive = new THREE.Color(0x440088);
            child.material.emissiveIntensity = 0.15;
          }
        }
        if (child.name === "mixamorigHead" || child.name === "mixamorig_Head") headBoneRef.current = child;
        if (child.name === "mixamorigNeck" || child.name === "mixamorig_Neck") neckBoneRef.current = child;
      });
      if (animations?.length) {
        mixerRef.current = new THREE.AnimationMixer(scene);
        mixerRef.current.clipAction(animations[0]).setLoop(THREE.LoopRepeat).play();
      }
    } catch (e) { console.error(e); }
    return () => { if (mixerRef.current) mixerRef.current.stopAllAction(); };
  }, [scene, animations]);

  useFrame((_, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta);
    const spd = Math.min(delta * 5, 1);
    smoothMouse.current.x += (mousePos?.x - smoothMouse.current.x) * spd || 0;
    smoothMouse.current.y += (mousePos?.y - smoothMouse.current.y) * spd || 0;
    if (headBoneRef.current) {
      headBoneRef.current.rotation.y += smoothMouse.current.x * 0.5;
      headBoneRef.current.rotation.x -= smoothMouse.current.y * 0.3;
    }
    if (neckBoneRef.current) {
      neckBoneRef.current.rotation.y += smoothMouse.current.x * 0.2;
      neckBoneRef.current.rotation.x -= smoothMouse.current.y * 0.1;
    }
  });

  if (!scene) return null;
  return <primitive object={scene} />;
}

const AboutCharacterCanvas = forwardRef(({ mousePos, initialPos = [0, 0, 0], initialRot = [0, 0, 0], initialScale = [1, 1, 1], isMobile = false, sectionVisible = false }, ref) => {
  const groupRef = useRef();
  useImperativeHandle(ref, () => ({ get current() { return groupRef.current; } }), []);
  const { containerRef, devicePixelRatio, getResponsiveParticleCount, isMobile: hookIsMobile, isTablet } = useCanvasOptimizer({ threshold: 0 });
  const particleCount = getResponsiveParticleCount(80);

  const fov = hookIsMobile ? 30 : isTablet ? 22 : 30;

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {sectionVisible && <Canvas
        camera={{
          position: [115, 125, 150],
          fov,
          near: 0.1,
          far: 1000,
        }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 70, 0);
        }}
        style={{ background: "transparent", pointerEvents: "none" }}
        gl={{ alpha: true, antialias: !isMobile, powerPreference: "high-performance" }}
        dpr={devicePixelRatio}
      >
        <fog attach="fog" args={['#0f0a1a', 200, 350]} />
        <ambientLight intensity={1.5} color="#ffffff" />
        <pointLight position={[5, 5, 5]} intensity={2.5} color="#c084fc" />
        <pointLight position={[-5, 3, 5]} intensity={3} color="#ffffff" />
        <directionalLight position={[0, 5, 5]} intensity={4} color="#ffffff" />
        <ParticleField count={particleCount} color="#a855f7" spread={20} size={0.03} opacity={0.3} mouseReactive={!isMobile} />
        {!isMobile && <FloatingGeometries count={6} color="#6366f1" spread={12} size={0.25} />}
        <GlowBackground color="#a855f7" secondaryColor="#6366f1" intensity={0.8} radius={30} />
        <Suspense fallback={null}>
          <group ref={groupRef} position={initialPos} rotation={initialRot} scale={initialScale}>
            <CharacterModel mousePos={isMobile ? { x: 0, y: 0 } : mousePos} />
            <HologramBase />
          </group>
        </Suspense>
      </Canvas>}
    </div>
  );
});

AboutCharacterCanvas.displayName = 'AboutCharacterCanvas';
export default AboutCharacterCanvas;
