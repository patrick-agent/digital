"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

const LoadingContext = createContext({
  isLoading: true,
  progress: 0,
  set3DProgress: () => {},
  markReady: () => {},
});

const MIN_LOAD_TIME = 2000;
const MAX_LOAD_TIME = 8000;

export function LoadingProvider({ children }) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [allReady, setAllReady] = useState(false);
  const [loaded3D, setLoaded3D] = useState(false);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  const updateProgress = useCallback((pct) => {
    setProgress((prev) => Math.max(prev, Math.min(pct, 95)));
  }, []);

  const set3DProgress = useCallback((pct) => {
    setProgress((prev) => Math.max(prev, Math.min(pct * 0.95, 95)));
  }, []);

  const markReady = useCallback(() => {
    setAllReady(true);
  }, []);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!allReady) return;

    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);

    setProgress(100);

    timerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, remaining);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [allReady]);

  useEffect(() => {
    const fallback = setTimeout(() => {
      setAllReady(true);
    }, MAX_LOAD_TIME);

    return () => clearTimeout(fallback);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, progress, set3DProgress, markReady }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
