"use client";

import { useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";
import { useLoading } from "@/context/LoadingContext";

export default function ProgressTracker() {
  const { progress: r3fProgress } = useProgress();
  const { set3DProgress, markReady } = useLoading();
  const readyRef = useRef(false);

  useEffect(() => {
    if (readyRef.current) return;
    set3DProgress(r3fProgress);

    if (r3fProgress >= 100) {
      readyRef.current = true;
      markReady();
    }
  }, [r3fProgress, set3DProgress, markReady]);

  return null;
}
