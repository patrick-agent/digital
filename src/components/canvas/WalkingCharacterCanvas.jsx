// ============================================
// WalkingCharacterCanvas — Overlay 3D Canvas for Walking Character
// ============================================
"use client";

import { Suspense, useMemo, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useFBX } from "@react-three/drei";
import * as THREE from "three";
import GlowBackground from "./GlowBackground";

function WalkingCharacterModel() {
  const groupRef = useRef();
  const mixerRef = useRef(null);
  const fbx = useFBX("/models/Walking.fbx");

  const character = useMemo(() => {
    try {
      return fbx.clone(true);
    } catch (e) {
      console.error("Error cloning walking character:", e);
      return null;
    }
  }, [fbx]);

  useEffect(() => {
    if (!character) return;

    try {
      character.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.emissive = new THREE.Color(0x333333);
            child.material.emissiveIntensity = 0.2;
          }
        }
      });

      if (fbx.animations && fbx.animations.length > 0) {
        mixerRef.current = new THREE.AnimationMixer(character);
        const action = mixerRef.current.clipAction(fbx.animations[0]);
        action.loop = THREE.LoopRepeat;
        action.clampWhenFinished = false;
        action.play();
        console.log("✓ Walking animation playing:", fbx.animations[0].name);
      } else {
        console.warn("No animations found in Walking FBX");
      }
    } catch (e) {
      console.error("Error setting up walking character:", e);
    }
  }, [character, fbx]);

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  if (!character) return null;

  // Use same position as CharacterModel: [100, 75, 175] scaled down
  const position = [100, 75, 175];
  const rotation = [
    THREE.MathUtils.degToRad(0),
    THREE.MathUtils.degToRad(27.5),
    THREE.MathUtils.degToRad(8.5)
  ];

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
    >
      <primitive object={character} />
    </group>
  );
}

export default function WalkingCharacterCanvas() {
  return (
    <Canvas
      camera={{
        position: [60, 55, 118.65],
        fov: 30,
        near: 0.1,
        far: 1000
      }}
      onCreated={({ camera }) => {
        camera.lookAt(0, 42, 0);
      }}
      style={{ background: "transparent" }}
    >
      <GlowBackground color="#a855f7" secondaryColor="#6366f1" intensity={0.4} radius={25} />
      <ambientLight intensity={0.6} color="#a78bfa" />
      <pointLight position={[2, 1.5, 2]} intensity={1} color="#c084fc" />
      <pointLight position={[-2, 1, 1]} intensity={0.7} color="#8b5cf6" />

      <Suspense fallback={null}>
        <WalkingCharacterModel />
      </Suspense>
    </Canvas>
  );
}