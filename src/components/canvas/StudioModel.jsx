// ============================================
// StudioModel — Background GLB
// ============================================
"use client";

import { useGLTF } from "@react-three/drei";

export default function StudioModel() {
  const { scene } = useGLTF("/models/home-studio-1k.glb");

  // Preserve original materials and textures
  // The model has its own materials which will display correctly
  return <primitive object={scene} />;
}
