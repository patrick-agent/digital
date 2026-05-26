"use client";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CharacterModel({
  mousePos = { x: 0, y: 0 },
  scrollProgress = 0,
}) {
  const groupRef = useRef();
  const mixerRef = useRef(null);
  const smoothMouse = useRef({ x: 0, y: 0 });
  const smoothScroll = useRef(0);
  const headBoneRef = useRef(null);
  const neckBoneRef = useRef(null);

  const { scene, animations } = useGLTF("/models/Floating.glb");

  useEffect(() => {
    if (!scene) return;

    // Setup materials and find bones
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Clone materials to avoid mutating shared instance
        const applyMat = (mat) => {
          const m = mat.clone();
          m.emissive = new THREE.Color(0x220044);
          m.emissiveIntensity = 0.3;
          m.transparent = true;
          m.opacity = 1;
          return m;
        };
        child.material = Array.isArray(child.material)
          ? child.material.map(applyMat)
          : applyMat(child.material);
        child.castShadow = true;
        child.receiveShadow = true;
      }

      if (child.isBone) {
        if (child.name === "mixamorig_Head" || child.name === "mixamorigHead") headBoneRef.current = child;
        if (child.name === "mixamorig_Neck" || child.name === "mixamorigNeck") neckBoneRef.current = child;
      }
    });

    // Setup animation mixer with original scene (important!)
    if (animations?.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(scene);
      const action = mixerRef.current.clipAction(animations[0]);
      action.loop = THREE.LoopRepeat;
      action.clampWhenFinished = false;
      action.play();
    } else {
      console.warn("No animations found in model");
    }

    // Cleanup: stop animation when component unmounts
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
      headBoneRef.current = null;
      neckBoneRef.current = null;
    };
  }, [scene, animations]);

  useFrame((_, delta) => {
    // Limit delta to prevent jumps (especially on low-end devices)
    const safeDelta = Math.min(delta, 0.016 * 2);

    // 1. Update animation first
    if (mixerRef.current) mixerRef.current.update(safeDelta);

    // 2. Smooth mouse and scroll movements
    const spd = Math.min(safeDelta * 5, 1);
    smoothMouse.current.x += (mousePos.x - smoothMouse.current.x) * spd;
    smoothMouse.current.y += (mousePos.y - smoothMouse.current.y) * spd;
    smoothScroll.current += (scrollProgress - smoothScroll.current) * spd;

    const mx = smoothMouse.current.x;
    const my = smoothMouse.current.y;
    const sp = smoothScroll.current;

    // 3. Look-at effect with head/neck bones
    if (headBoneRef.current) {
      headBoneRef.current.rotation.y += mx * 0.4;
      headBoneRef.current.rotation.x -= my * 0.3;
    }
    if (neckBoneRef.current) {
      neckBoneRef.current.rotation.y += mx * 0.15;
      neckBoneRef.current.rotation.x -= my * 0.1;
    }

    // 4. Scroll effect
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(0, -200, sp);
      groupRef.current.position.y = THREE.MathUtils.lerp(0, -100, sp);
      groupRef.current.position.z = THREE.MathUtils.lerp(0, -100, sp);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        THREE.MathUtils.degToRad(8.5),
        THREE.MathUtils.degToRad(35),
        sp
      );

      groupRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];
          mats.forEach((m) => {
            m.opacity = THREE.MathUtils.lerp(1, 0, sp);
          });
        }
      });
    }
  });

  if (!scene) return null;

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      rotation={[
        THREE.MathUtils.degToRad(-20),
        THREE.MathUtils.degToRad(35),
        THREE.MathUtils.degToRad(0),
      ]}
      scale={0.7}
    >
      <primitive object={scene} />
    </group>
  );
}