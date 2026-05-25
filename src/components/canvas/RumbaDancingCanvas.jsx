"use client";

import React, { forwardRef, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useCanvasOptimizer } from '@/hooks/useCanvasOptimizer';
import PostProcessing from './PostProcessing';

function RumbaModel() {
  const { scene, animations } = useGLTF('/models/rumba-dancing.glb');
  const mixerRef = useRef(null);

  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
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
      <pointLight position={[-30, 50, -40]} intensity={2.5} color="#c084fc" distance={100} decay={1.5} />
      <pointLight position={[30, 50, -40]} intensity={2.5} color="#a855f7" distance={100} decay={1.5} />
      <pointLight position={[0, 100, -35]} intensity={2} color="#e879f9" distance={80} decay={1.5} />
      <pointLight position={[0, 20, -40]} intensity={1.2} color="#9333ea" distance={70} decay={1.5} />
    </>
  );
}

const RumbaDancingCanvas = forwardRef(({
  initialPos = [0, 0, 0],
  initialRot = [0, 0, 0],
  initialScale = [1, 1, 1],
  isMobile = false,
  sectionVisible = false
}, ref) => {
  const groupRef = useRef();
  const { containerRef, devicePixelRatio, getResponsiveFov } = useCanvasOptimizer({ threshold: 0 });

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {sectionVisible && <Canvas
        shadows={!isMobile}
        camera={{ position: [0, 78, 90], fov: getResponsiveFov(100), near: 0.1, far: 1000 }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 80, 0);
        }}
        style={{ background: 'transparent', pointerEvents: 'auto', width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: !isMobile, powerPreference: 'high-performance' }}
        dpr={devicePixelRatio}
      >
        <CharacterRimLights />
        <ambientLight intensity={1.5} color="#ffffff" />
        <pointLight position={[30, 80, 30]} intensity={isMobile ? 1.2 : 2.5} color="#c084fc" />
        <pointLight position={[-30, 50, -30]} intensity={2} color="#9333ea" />
        <directionalLight position={[0, 100, 80]} intensity={isMobile ? 1.5 : 2.5} color="#ffffff" castShadow={!isMobile} />
        {!isMobile && (
          <spotLight
            position={[0, 90, 0]}
            angle={Math.PI / 5}
            penumbra={1}
            intensity={1.8}
            color="#c084fc"
            castShadow
          />
        )}
        <group ref={groupRef} position={initialPos} rotation={initialRot} scale={initialScale}>
          <RumbaModel />
        </group>
        {!isMobile && (
          <PostProcessing
            bloomIntensity={1.5}
            noiseOpacity={0.015}
            vignetteDarkness={0.5}
            bloom={true}
            noise={false}
            chromaticAberration={false}
            vignette={false}
          />
        )}
      </Canvas>}
    </div>
  );
});

RumbaDancingCanvas.displayName = 'RumbaDancingCanvas';
export default RumbaDancingCanvas;
