"use client";

import React, { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useCanvasOptimizer } from '@/hooks/useCanvasOptimizer';
import PostProcessing from './PostProcessing';
import ParticleField from './ParticleField';
import FloatingGeometries from './FloatingGeometries';

function WaveModel() {
  const { scene, animations } = useGLTF('/models/wave-hiphop-dance.glb');
  const mixerRef = useRef(null);

  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        if (child.material) {
          child.material.fog = false;
          child.material.side = THREE.DoubleSide;
          child.material.emissive = new THREE.Color(0x440088);
          child.material.emissiveIntensity = 0.15;
        }
      }
    });
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
    scene.position.y += size.y / 2;

    if (animations && animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(scene);
      animations.forEach((clip) => {
        mixerRef.current.clipAction(clip).play();
      });
    }
    return () => {
      if (mixerRef.current) mixerRef.current.stopAllAction();
    };
  }, [scene, animations]);

  useFrame((state, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta);
  });

  if (!scene) return null;
  return <primitive object={scene} />;
}

function CharacterRimLights() {
  return (
    <>
      <pointLight position={[-30, 50, -40]} intensity={2.5} color="#fff" distance={100} decay={1.5} />
      <pointLight position={[30, 50, -40]} intensity={2.5} color="#fff" distance={100} decay={1.5} />
      <pointLight position={[0, 100, -35]} intensity={2} color="#fff" distance={80} decay={1.5} />
      <pointLight position={[0, 20, -40]} intensity={1.2} color="#fff" distance={70} decay={1.5} />
    </>
  );
}

const WaveCharacterCanvas = forwardRef(({
  initialPos = [0, 0, 0],
  initialRot = [0, 0, 0],
  initialScale = [1, 1, 1],
  isMobile = false,
  sectionVisible = false
}, ref) => {
  const groupRef = useRef();
  useImperativeHandle(ref, () => ({ get current() { return groupRef.current; } }), []);
  const { containerRef, devicePixelRatio, getResponsiveFov, getResponsiveParticleCount } = useCanvasOptimizer({ threshold: 0 });
  const particleCount = getResponsiveParticleCount(70);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {sectionVisible && <Canvas
        shadows={false}
        camera={{ position: [-80, 100, 110], fov: getResponsiveFov(45), near: 0.1, far: 1000 }}
        onCreated={({ camera }) => {
          camera.lookAt(10, 55, 0);
        }}
        style={{ background: 'transparent', pointerEvents: 'auto', width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: !isMobile, powerPreference: 'high-performance' }}
        dpr={devicePixelRatio}
      >
        <ParticleField count={particleCount} color="#06b6d4" spread={16} size={0.03} opacity={0.25} mouseReactive={!isMobile} />
        {!isMobile && <FloatingGeometries count={5} color="#ec4899" spread={14} size={0.2} />}
        <CharacterRimLights />
        <ambientLight intensity={2.5} color="#ffffff" />
        <pointLight position={[30, 80, 30]} intensity={isMobile ? 1.2 : 2.5} color="#fff" />
        <pointLight position={[-30, 50, -30]} intensity={2} color="#fff" />
        <directionalLight position={[0, 100, 80]} intensity={isMobile ? 1.5 : 2.5} color="#ffffff" />
        {!isMobile && (
          <spotLight
            position={[0, 90, 0]}
            angle={Math.PI / 5}
            penumbra={1}
            intensity={1.8}
            color="#f6b3ff"
          />
        )}
        <group ref={groupRef} position={initialPos} rotation={initialRot} scale={initialScale}>
          <WaveModel />
        </group>
        {!isMobile && (
          <PostProcessing
            bloomIntensity={2}
            noiseOpacity={1}
            vignetteDarkness={5}
            bloom={true}
            noise={false}
            chromaticAberration={true}
            vignette={false}
          />
        )}
      </Canvas>}
    </div>
  );
});

WaveCharacterCanvas.displayName = 'WaveCharacterCanvas';
export default WaveCharacterCanvas;
