import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { FBXLoader } from 'three-stdlib';
import * as THREE from 'three';

function ByeModel() {
  const [model, setModel] = useState(null);
  const mixerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loader = new FBXLoader();
    loader.load(
      '/models/bye.fbx',
      (fbx) => {
        if (cancelled) return;

        fbx.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.fog = false;
              child.material.side = THREE.DoubleSide;
            }
          }
        });

        const box = new THREE.Box3().setFromObject(fbx);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        fbx.position.sub(center);
        fbx.position.y += size.y / 2;

        if (fbx.animations && fbx.animations.length > 0) {
          mixerRef.current = new THREE.AnimationMixer(fbx);
          fbx.animations.forEach((clip) => {
            mixerRef.current.clipAction(clip).play();
          });
        }

        setModel(fbx);
      },
      undefined,
      (err) => {
        console.warn('bye.fbx load failed:', err);
      }
    );

    return () => {
      cancelled = true;
      if (mixerRef.current) mixerRef.current.stopAllAction();
    };
  }, []);

  useFrame((state, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta);
  });

  if (!model) return null;
  return <primitive object={model} />;
}

function Scene() {
  const groupRef = useRef();

  return (
    <>
      <ambientLight intensity={2} color="#ffffff" />
      <directionalLight position={[15, 40, 30]} intensity={3} color="#ffffff" />
      <directionalLight position={[-15, 10, -20]} intensity={1.5} color="#c084fc" />
      <hemisphereLight args={['#d8b4fe', '#1a0f2e', 1]} />
      <group ref={groupRef} position={[-65, -80, 0]} scale={[0.8, 0.8, 0.8]}>
        <ByeModel />
      </group>
    </>
  );
}

export default function ByeCharacterCanvas() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', minHeight: '200px' }}>
      <Canvas
        camera={{ position: [-45, 0, 160], fov: 25, near: 0.1, far: 1000 }}
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
