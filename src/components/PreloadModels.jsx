"use client";

import { useEffect, useRef } from "react";
import { getDeviceType, getLoadingTimeout } from "@/lib/deviceDetection";
import { useLoading } from "@/context/LoadingContext";

/**
 * Device-aware model preloader
 * Only loads models appropriate for the device's capabilities
 * Prevents memory issues on mobile/tablet devices
 */
export default function PreloadModels() {
  const { set3DProgress } = useLoading();
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const preload = async () => {
      try {
        const deviceType = getDeviceType();
        abortControllerRef.current = new AbortController();

        // Define models to preload based on device
        const modelsByDevice = {
          desktop: [
            "/models/Floating.glb",
            "/models/Walking.glb",
            "/models/pointing-to-the-right-hologram.glb",
            "/models/wave-hiphop-dance.glb",
            "/models/breakdance-freezes.glb",
            "/models/rumba-dancing.glb",
            "/models/bye.glb",
          ],
          tablet: [
            "/models/Floating.glb",
            "/models/Walking.glb",
            "/models/breakdance-freezes.glb",
          ],
          mobile: [
            "/models/Floating.glb",
          ],
        };

        const modelsToLoad = modelsByDevice[deviceType] || modelsByDevice.mobile;
        const drei = await import("@react-three/drei");

        // Preload models with progress tracking
        let loadedCount = 0;
        for (const model of modelsToLoad) {
          if (abortControllerRef.current?.signal.aborted) break;

          try {
            drei.useGLTF.preload(model);
            loadedCount++;
            set3DProgress((loadedCount / modelsToLoad.length) * 0.9);
          } catch (err) {
            console.warn(`Failed to preload ${model}:`, err.message);
          }
        }

        set3DProgress(0.95);
      } catch (err) {
        console.warn("Model preload initialization failed:", err.message);
      }
    };

    preload();

    // Cleanup: abort pending preloads if component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [set3DProgress]);

  return null;
}
