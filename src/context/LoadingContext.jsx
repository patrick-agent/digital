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
  const committedRef = useRef(false);

  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  const set3DProgress = useCallback((pct) => {
    setProgress((prev) => Math.max(prev, Math.min(pct * 0.95, 95)));
  }, []);

  const markReady = useCallback(() => {
    if (committedRef.current) return;
    committedRef.current = true;

    const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
    const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);

    setProgress(100);
    startTimeRef.current = null;

    timerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, remaining);
  }, []);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    const fallback = setTimeout(() => {
      if (!committedRef.current) {
        markReady();
      }
    }, MAX_LOAD_TIME);

    return () => clearTimeout(fallback);
  }, [markReady]);

  return (
    <LoadingContext.Provider value={{ isLoading, progress, set3DProgress, markReady }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
