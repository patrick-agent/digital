"use client";
import { useFBX, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Preload the model at app startup
useFBX.preload("/models/Floating.fbx");

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

  // Load trực tiếp file FBX - đã preload nên sẽ nhanh
  const fbx = useFBX("/models/Floating.fbx");

  useEffect(() => {
    if (!fbx) return;

    // Quét qua toàn bộ model để cài đặt Material và tìm Xương (Bones)
    fbx.traverse((child) => {
      // Cài đặt Material (Da thịt) giống như ý bạn
      if (child.isMesh && child.material) {
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

      // Tìm và lưu lại Xương Đầu và Xương Cổ
      if (child.name === "mixamorigHead") headBoneRef.current = child;
      if (child.name === "mixamorigNeck") neckBoneRef.current = child;
    });

    // Cài đặt và Play Animation (Chuyển động Floating)
    if (fbx.animations?.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(fbx);
      const action = mixerRef.current.clipAction(fbx.animations[0]);
      action.loop = THREE.LoopRepeat;
      action.clampWhenFinished = false;
      action.play();
      console.log("✓ Animation đang chạy:", fbx.animations[0].name);
    } else {
      console.warn("Không tìm thấy Animation trong file FBX này");
    }

    // Xóa mixer khi component unmount
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
    };
  }, [fbx]);

  useFrame((_, delta) => {
    // 1. Cập nhật Animation TRƯỚC
    if (mixerRef.current) mixerRef.current.update(delta);

    // 2. Làm mượt chuyển động chuột và cuộn trang
    const spd = Math.min(delta * 5, 1);
    smoothMouse.current.x += (mousePos.x - smoothMouse.current.x) * spd;
    smoothMouse.current.y += (mousePos.y - smoothMouse.current.y) * spd;
    smoothScroll.current += (scrollProgress - smoothScroll.current) * spd;

    const mx = smoothMouse.current.x;
    const my = smoothMouse.current.y;
    const sp = smoothScroll.current;

    // 3. Xoay xương đầu/cổ SAU khi animation đã update
    // Thay vì dùng BaseEuler, ta cộng trực tiếp góc chuột vào góc của animation (Giúp đầu vừa trôi nổi vừa nhìn theo chuột)
    if (headBoneRef.current) {
      headBoneRef.current.rotation.y += mx * 0.4;
      headBoneRef.current.rotation.x -= my * 0.3;
    }
    if (neckBoneRef.current) {
      neckBoneRef.current.rotation.y += mx * 0.15;
      neckBoneRef.current.rotation.x -= my * 0.1;
    }

    // 4. Hiệu ứng khi Scroll (Giữ nguyên của bạn)
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

  if (!fbx) return null;

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
      {/* Đưa thẳng fbx vào, không dùng character clone nữa */}
      <primitive object={fbx} />
    </group>
  );
}