import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function ByeModel() {
  const { scene, animations } = useGLTF('/models/bye.glb');
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

  return <primitive object={scene} />;
}

const CAM_TARGET = [95, 95, 0];

function Scene() {
  const groupRef = useRef();

  return (
    <>
      <ambientLight intensity={3} color="#ffffff" />
      <directionalLight position={[15, 40, 30]} intensity={4.5} color="#ffffff" />
      <directionalLight position={[-15, 10, -20]} intensity={1.5} color="#c084fc" />
      <hemisphereLight args={['#d8b4fe', '#1a0f2e', 1.5]} />
      <group ref={groupRef} position={[0, 0, 0]} scale={[0.9, 0.9, 0.9]}>
        <Suspense fallback={null}>
          <ByeModel />
        </Suspense>
      </group>
    </>
  );
}

export default function ByeCharacterCanvas() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', minHeight: '200px' }}>
      <Canvas
        camera={{ position: [25, 80, 150], fov: 35, near: 0.1, far: 1000 }}
        onCreated={({ camera }) => {
          camera.lookAt(...CAM_TARGET);
        }}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0
        }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
