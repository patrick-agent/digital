"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { getLoadingTimeout } from "@/lib/deviceDetection";

const LoadingContext = createContext({
  isLoading: true,
  progress: 0,
  set3DProgress: () => {},
  markReady: () => {},
  loadingError: null,
});

const MIN_LOAD_TIME = 2000;

export function LoadingProvider({ children }) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const committedRef = useRef(false);

  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  const maxLoadTimeRef = useRef(getLoadingTimeout());

  const set3DProgress = useCallback((pct) => {
    setProgress((prev) => Math.max(prev, Math.min(pct * 0.95, 95)));
  }, []);

  const markReady = useCallback((error = null) => {
    if (committedRef.current) return;
    committedRef.current = true;

    if (error) {
      setLoadingError(error);
    }

    const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
    const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);

    setProgress(100);
    startTimeRef.current = null;

    timerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, remaining);
  }, []);

  // Safety fallback: force loading to end after timeout
  useEffect(() => {
    const fallback = setTimeout(() => {
      if (!committedRef.current) {
        console.warn("Loading timeout exceeded, forcing completion");
        markReady(new Error("Loading timeout exceeded"));
      }
    }, maxLoadTimeRef.current);

    return () => clearTimeout(fallback);
  }, [markReady]);

  // Handle WebGL context loss
  useEffect(() => {
    const handleContextLoss = () => {
      const error = new Error("WebGL context lost - device may not support 3D rendering");
      setLoadingError(error);
      if (!committedRef.current) {
        markReady(error);
      }
    };

    const handleContextRestore = () => {
      setLoadingError(null);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("webglcontextlost", handleContextLoss);
      window.addEventListener("webglcontextrestored", handleContextRestore);

      return () => {
        window.removeEventListener("webglcontextlost", handleContextLoss);
        window.removeEventListener("webglcontextrestored", handleContextRestore);
      };
    }
  }, [markReady]);

  // Initialize start time
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  return (
    <LoadingContext.Provider
      value={{ isLoading, progress, set3DProgress, markReady, loadingError }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
