"use client";
import { useEffect, useRef, useState } from "react";

const MAX_CONTEXTS = 5;
let activeCount = 0;
const listeners = new Set();

function notifyListeners() {
  listeners.forEach(fn => fn());
}

export function requestContextSlot() {
  if (activeCount < MAX_CONTEXTS) {
    activeCount++;
    return true;
  }
  return false;
}

export function releaseContextSlot() {
  activeCount = Math.max(0, activeCount - 1);
  if (activeCount < MAX_CONTEXTS) {
    notifyListeners();
  }
}

export function useWebGLContextSlot(isActive = true) {
  const [hasSlot, setHasSlot] = useState(false);
  const granted = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (!isActive) {
      if (granted.current) {
        granted.current = false;
        releaseContextSlot();
        setHasSlot(false);
      }
      return;
    }

    if (!granted.current && requestContextSlot()) {
      granted.current = true;
      setHasSlot(true);
    }
    const listener = () => {
      if (mountedRef.current && !granted.current && requestContextSlot()) {
        granted.current = true;
        setHasSlot(true);
      }
    };
    listeners.add(listener);
    return () => {
      mountedRef.current = false;
      listeners.delete(listener);
      if (granted.current) {
        granted.current = false;
        releaseContextSlot();
        setHasSlot(false);
      }
    };
  }, [isActive]);

  return hasSlot;
}
