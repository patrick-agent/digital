"use client";
import { Suspense, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useFBX } from "@react-three/drei";
import * as THREE from "three";
import { useCanvasOptimizer } from "@/hooks/useCanvasOptimizer";
import TeleportBeam from "./TeleportBeam";
import GlowBackground from "./GlowBackground";
import ParticleField from "./ParticleField";
import FloatingGeometries from "./FloatingGeometries";

useFBX.preload("/models/pointing-to-the-right-hologram.fbx");
useFBX.preload("/models/Walking.fbx");

function SoundwaveBase() {
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();

  useFrame((_, delta) => {
    if (ring1.current) ring1.current.rotation.z += delta * 0.8;
    if (ring2.current) ring2.current.rotation.z -= delta * 0.5;
    if (ring3.current) ring3.current.rotation.z += delta * 0.2;
  });

  return (
    <group position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <circleGeometry args={[18, 64]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.1} />
      </mesh>
      <mesh ref={ring1}>
        <ringGeometry args={[20, 21.5, 64]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.8} />
      </mesh>
      <mesh ref={ring2}>
        <ringGeometry args={[25, 26, 64]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring3}>
        <ringGeometry args={[30, 30.5, 64]} />
        <meshBasicMaterial color="#7e22ce" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function PointingModel() {
  const fbx = useFBX("/models/pointing-to-the-right-hologram.fbx");
  const fallbackFbx = useFBX("/models/Walking.fbx");
  const mixerRef = useRef(null);

  useEffect(() => {
    if (!fbx) return;
    try {
      fbx.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) child.material.fog = false;
        }
      });
      const animSource = fbx.animations?.length ? fbx : (fallbackFbx?.animations?.length ? fallbackFbx : null);
      if (animSource) {
        mixerRef.current = new THREE.AnimationMixer(animSource);
        const action = mixerRef.current.clipAction(animSource.animations[0]);
        action.setLoop(THREE.LoopRepeat);
        action.play();
      }
    } catch (e) { console.error(e); }
    return () => { if (mixerRef.current) mixerRef.current.stopAllAction(); };
  }, [fbx, fallbackFbx]);

  useFrame((_, delta) => { if (mixerRef.current) mixerRef.current.update(delta); });
  if (!fbx) return null;
  return <primitive object={fbx} />;
}

const PointingCharacterCanvas = forwardRef(({ initialPos = [0, 0, 0], initialRot = [0, 0, 0], initialScale = [1, 1, 1], isMobile = false, sectionVisible = false }, ref) => {
  const groupRef = useRef();
  useImperativeHandle(ref, () => ({ get current() { return groupRef.current; } }), []);
  const { containerRef, devicePixelRatio, getResponsiveFov, getResponsiveParticleCount } = useCanvasOptimizer({ threshold: 0 });
  const particleCount = getResponsiveParticleCount(60);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {sectionVisible && <Canvas
        camera={{ position: [55, 125, 125], fov: getResponsiveFov(45), near: 0.1, far: 1000 }}
        onCreated={({ camera }) => { camera.lookAt(0, 90, 0); }}
        style={{ background: "transparent", pointerEvents: "none" }}
        gl={{ alpha: true, antialias: !isMobile, powerPreference: "high-performance" }}
        dpr={devicePixelRatio}
      >
        <ambientLight intensity={0.9} color="#ffffff" />
        <ParticleField count={particleCount} color="#ec4899" spread={18} size={0.035} opacity={0.25} mouseReactive={!isMobile} />
        {!isMobile && <FloatingGeometries count={4} color="#a855f7" spread={10} size={0.2} />}
        <pointLight position={[5, 5, 5]} intensity={isMobile ? 1.5 : 2.5} color="#c084fc" />
        <pointLight position={[-5, 3, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[0, 5, 5]} intensity={isMobile ? 1.5 : 2.5} color="#ffffff" />
        <GlowBackground color="#ec4899" secondaryColor="#a855f7" intensity={isMobile ? 0.3 : 0.6} radius={20} />
        <Suspense fallback={null}>
          <group ref={groupRef} position={initialPos} rotation={initialRot} scale={initialScale}>
            <PointingModel />
            <SoundwaveBase />
            <TeleportBeam color="#a855f7" height={60} radius={2.5} />
          </group>
        </Suspense>
      </Canvas>}
    </div>
  );
});

PointingCharacterCanvas.displayName = 'PointingCharacterCanvas';
export default PointingCharacterCanvas;
