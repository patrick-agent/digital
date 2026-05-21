"use client";

import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";

const LoadingContext = createContext({
  isLoading: true,
  progress: 0,
  setReady: () => {},
});

const MAX_LOAD_TIME = 4000;

export function LoadingProvider({ children }) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const startedRef = useRef(false);

  const onLoad = useCallback(() => {
    setModelsLoaded(true);
    setProgress(100);
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let checking = true;
    let attempts = 0;

    const checkModels = () => {
      if (!checking) return;
      attempts++;

      const canvas = document.querySelector("canvas");
      const fbxModels = document.querySelectorAll("[data-fbx]");

      const allFbx = document.querySelectorAll('[class*="character"]');

      if (attempts > MAX_LOAD_TIME / 100) {
        onLoad();
        return;
      }

      setProgress(Math.min(attempts * 8, 90));

      if (canvas) {
        onLoad();
      } else {
        setTimeout(checkModels, 100);
      }
    };

    setTimeout(checkModels, 500);

    const fallbackTimer = setTimeout(onLoad, MAX_LOAD_TIME);

    return () => {
      checking = false;
      clearTimeout(fallbackTimer);
    };
  }, [onLoad]);

  return (
    <LoadingContext.Provider value={{ isLoading, progress, setReady: onLoad }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
