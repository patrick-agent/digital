"use client";

import { useEffect } from "react";

export default function PreloadModels() {
  useEffect(() => {
    const preload = async () => {
      try {
        const drei = await import("@react-three/drei");
        drei.useFBX.preload("/models/Floating.fbx");
        drei.useFBX.preload("/models/Walking.fbx");
        drei.useFBX.preload("/models/pointing-to-the-right-hologram.fbx");
        drei.useFBX.preload("/models/wave-hiphop-dance.fbx");
        drei.useFBX.preload("/models/breakdance-freezes.fbx");
        drei.useFBX.preload("/models/rumba-dancing.fbx");
        drei.useFBX.preload("/models/bye.fbx");
        console.log("✓ Models preloaded");
      } catch (err) {
        console.warn("Model preload failed:", err);
      }
    };
    preload();
  }, []);

  return null;
}
