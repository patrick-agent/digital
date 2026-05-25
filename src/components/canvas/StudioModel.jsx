// ============================================
// StudioModel — Background GLB with Error Handling
// ============================================
"use client";

import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { createFallbackMaterial } from "@/lib/shader-utils";

export default function StudioModel() {
  const { scene } = useGLTF("/models/home-studio-1k.glb");

  useEffect(() => {
    if (!scene) return;

    // Fix shader-incompatible materials
    scene.traverse((node) => {
      if (node.isMesh && node.material) {
        try {
          // Validate material
          if (!node.material.color) {
            console.warn(`[Model] Material ${node.material.name} missing color`);
            node.material = createFallbackMaterial();
            return;
          }

          // For MeshPhongMaterial with shader issues, ensure proper config
          if (node.material.shininess < 0 || node.material.shininess > 100) {
            node.material.shininess = Math.max(0, Math.min(100, node.material.shininess));
          }

          // Ensure material can work with limited lights
          node.material.fog = true;
          node.material.lights = true;
          node.material.side = node.material.side || 1; // FrontSide

          // Log material info for debugging
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Model] Material: ${node.material.name}`, {
              type: node.material.type,
              color: node.material.color?.getHexString(),
              shininess: node.material.shininess,
            });
          }
        } catch (error) {
          console.error(`[Model] Failed to process material ${node.material.name}:`, error);
          node.material = createFallbackMaterial();
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}
