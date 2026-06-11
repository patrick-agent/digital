"use client";

import React, { forwardRef, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useCanvasOptimizer } from '@/hooks/useCanvasOptimizer';
import GlowBackground from './GlowBackground';

function MouseParticles() {
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const count = 80;
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        ),
        speed: 0.5 + Math.random() * 1.5,
        size: 0.05 + Math.random() * 0.1,
      });
    }
    particlesRef.current = arr;
  }, []);

  useFrame((state, delta) => {
    mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.08;
    mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.08;
    const particles = particlesRef.current;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.position.x += (mouseRef.current.x * 8 - p.position.x) * 0.002 * p.speed;
      p.position.y += (mouseRef.current.y * 4 - p.position.y) * 0.002 * p.speed;
      p.position.z += Math.sin(state.clock.elapsedTime * p.speed) * 0.01;
    }
  });

  return (
    <group>
      {Array.from({ length: 80 }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#c084fc" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function BreakdanceModel() {
  const { scene, animations } = useGLTF('/models/breakdance-freezes.glb');
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

function RotatingLightRing() {
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={ringRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[18, 0.1, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[22, 0.08, 16, 100]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

const BreakdanceCharacterCanvas = forwardRef(({
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
        camera={{ position: [0, 35, 110], fov: getResponsiveFov(45), near: 0.1, far: 1000 }}
        onCreated={({ camera }) => {
          camera.lookAt(50, 70, 0);
        }}
        style={{ background: 'transparent', pointerEvents: 'auto', width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: !isMobile, powerPreference: 'high-performance' }}
        dpr={devicePixelRatio}
      >
        <GlowBackground color="#c084fc" secondaryColor="#a200ff" intensity={0.3} radius={10} />
        {!isMobile && <MouseParticles />}
        <RotatingLightRing />
        <ambientLight intensity={3} color="#ffffff" />
        <pointLight position={[50, 100, 50]} intensity={isMobile ? 2 : 3} color="#c084fc" />
        <pointLight position={[-50, 60, -50]} intensity={0.5} color="#fff" />
        <directionalLight position={[0, 150, 100]} intensity={isMobile ? 1.5 : 3} color="#ffffff" castShadow={!isMobile} />
        {!isMobile && (
          <spotLight
            position={[0, 120, 0]}
            angle={Math.PI / 6}
            penumbra={1}
            intensity={2}
            color="#e5cbff"
            castShadow
          />
        )}
        <group ref={groupRef} position={initialPos} rotation={initialRot} scale={initialScale}>        
          <BreakdanceModel />
        </group>
      </Canvas>}
    </div>
  );
});

BreakdanceCharacterCanvas.displayName = 'BreakdanceCharacterCanvas';
export default BreakdanceCharacterCanvas;
