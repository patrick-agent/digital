"use client";

import { useEffect } from "react";

export default function PreloadModels() {
  useEffect(() => {
    const preload = async () => {
      try {
        const drei = await import("@react-three/drei");
        drei.useGLTF.preload("/models/Floating.glb");
        drei.useGLTF.preload("/models/Walking.glb");
        drei.useGLTF.preload("/models/pointing-to-the-right-hologram.glb");
        drei.useGLTF.preload("/models/wave-hiphop-dance.glb");
        drei.useGLTF.preload("/models/breakdance-freezes.glb");
        drei.useGLTF.preload("/models/rumba-dancing.glb");
        drei.useGLTF.preload("/models/bye.glb");
      } catch (err) {
        console.warn("Model preload failed:", err);
      }
    };
    preload();
  }, []);

  return null;
}
