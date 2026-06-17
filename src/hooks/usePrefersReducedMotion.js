"use client"

import { useSyncExternalStore } from "react"

function subscribe(onStoreChange) {
  if (typeof window === "undefined") return () => {}

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
  const handler = () => onStoreChange()

  mediaQuery.addEventListener("change", handler)
  return () => mediaQuery.removeEventListener("change", handler)
}

function getSnapshot() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getServerSnapshot() {
  return false
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
