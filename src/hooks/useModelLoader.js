/**
 * Model Optimization Hook
 * Provides device-aware model loading strategies and caching
 */
"use client";

import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Configuration for different device tiers
 */
const DEVICE_CONFIGS = {
  mobile: {
    modelQuality: 'low',
    pixelRatio: 1,
    modelSuffix: '-low',
    disablePostProcessing: true,
    maxGeometries: 100,
  },
  tablet: {
    modelQuality: 'medium',
    pixelRatio: 1.5,
    modelSuffix: '-medium',
    disablePostProcessing: false,
    maxGeometries: 200,
  },
  desktop: {
    modelQuality: 'high',
    pixelRatio: 2,
    modelSuffix: '',
    disablePostProcessing: false,
    maxGeometries: 500,
  },
};

/**
 * Cache for loaded models
 */
const modelCache = new Map();
const loadingPromises = new Map();

/**
 * Get device tier based on screen size and capabilities
 */
function getDeviceTier() {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  const dpr = window.devicePixelRatio;
  const memory = (navigator.deviceMemory || 8);
  
  // Mobile: small screen or low memory
  if (width < 640 || memory < 4) return 'mobile';
  
  // Tablet: medium screen
  if (width < 1024) return 'tablet';
  
  return 'desktop';
}

/**
 * Custom hook for optimized model loading
 * @param {string} modelPath - Path to the model file
 * @param {Object} options - Configuration options
 * @returns {Object} Model loading state and utilities
 */
export function useModelLoader(modelPath, options = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [model, setModel] = useState(null);
  const [deviceTier, setDeviceTier] = useState('desktop');
  const cacheKeyRef = useRef(null);
  const controllerRef = useRef(new AbortController());

  const {
    useCache = true,
    autoOptimize = true,
    onProgress = null,
  } = options;

  // Update device tier on mount and window resize
  useEffect(() => {
    const updateDeviceTier = () => {
      setDeviceTier(getDeviceTier());
    };

    updateDeviceTier();
    window.addEventListener('resize', updateDeviceTier);
    return () => window.removeEventListener('resize', updateDeviceTier);
  }, []);

  // Generate optimized model path
  const getOptimizedPath = useCallback((path) => {
    if (!autoOptimize) return path;

    const config = DEVICE_CONFIGS[deviceTier];
    const pathWithoutExt = path.replace(/\.[^.]+$/, '');
    const ext = path.match(/\.[^.]+$/)?.[0] || '';

    // Return path with quality suffix if available
    if (config.modelSuffix) {
      return `${pathWithoutExt}${config.modelSuffix}${ext}`;
    }
    return path;
  }, [deviceTier, autoOptimize]);

  // Load model with caching and progress tracking
  const loadModel = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const optimizedPath = getOptimizedPath(modelPath);
    cacheKeyRef.current = optimizedPath;

    // Check cache first
    if (useCache && modelCache.has(optimizedPath)) {
      setModel(modelCache.get(optimizedPath));
      setIsLoading(false);
      return;
    }

    // Check if already loading
    if (loadingPromises.has(optimizedPath)) {
      try {
        const cachedModel = await loadingPromises.get(optimizedPath);
        setModel(cachedModel);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
      return;
    }

    // Create loading promise
    const loadPromise = (async () => {
      try {
        const response = await fetch(optimizedPath, {
          signal: controllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load model: ${response.statusText}`);
        }

        // Track progress if callback provided
        if (onProgress) {
          const reader = response.body.getReader();
          const contentLength = +response.headers.get('content-length');
          let receivedLength = 0;

          const chunks = [];
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            chunks.push(value);
            receivedLength += value.length;
            onProgress(receivedLength / contentLength);
          }

          const blob = new Blob(chunks);
          return blob;
        } else {
          return await response.blob();
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          throw err;
        }
      }
    })();

    loadingPromises.set(optimizedPath, loadPromise);

    try {
      const modelBlob = await loadPromise;
      
      // Cache the loaded model
      if (useCache) {
        modelCache.set(optimizedPath, modelBlob);
      }

      setModel(modelBlob);
      setIsLoading(false);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
        setIsLoading(false);
      }
    } finally {
      loadingPromises.delete(optimizedPath);
    }
  }, [modelPath, getOptimizedPath, useCache, onProgress]);

  // Load model on mount and when path changes
  useEffect(() => {
    loadModel();

    return () => {
      // Cancel ongoing requests on unmount
      controllerRef.current.abort();
    };
  }, [loadModel]);

  const config = DEVICE_CONFIGS[deviceTier];

  return {
    model,
    isLoading,
    error,
    deviceTier,
    config,
    modelUrl: cacheKeyRef.current,
    retry: loadModel,
  };
}

/**
 * Clear the model cache
 */
export function clearModelCache() {
  modelCache.clear();
  loadingPromises.clear();
}

/**
 * Get current device tier
 */
export function getCurrentDeviceTier() {
  return getDeviceTier();
}

/**
 * Get device configuration
 */
export function getDeviceConfig() {
  const tier = getDeviceTier();
  return DEVICE_CONFIGS[tier];
}

/**
 * Preload a model in background
 */
export async function preloadModel(modelPath) {
  const tier = getDeviceTier();
  const config = DEVICE_CONFIGS[tier];
  
  const pathWithoutExt = modelPath.replace(/\.[^.]+$/, '');
  const ext = modelPath.match(/\.[^.]+$/)?.[0] || '';
  const optimizedPath = `${pathWithoutExt}${config.modelSuffix}${ext}`;

  if (modelCache.has(optimizedPath)) {
    return modelCache.get(optimizedPath);
  }

  try {
    const response = await fetch(optimizedPath);
    const blob = await response.blob();
    modelCache.set(optimizedPath, blob);
    return blob;
  } catch (err) {
    console.warn(`Failed to preload model: ${modelPath}`, err);
    return null;
  }
}
