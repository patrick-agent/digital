"use client"

import { useCallback } from "react"

export default function SkipLink({ href, children }) {
  const handleFocus = useCallback((e) => {
    e.target.style.top = "0"
  }, [])

  const handleBlur = useCallback((e) => {
    e.target.style.top = "-100%"
  }, [])

  return (
    <a
      href={href}
      style={{
        position: "fixed",
        top: "-100%",
        left: "50%",
        zIndex: 10000,
        transform: "translateX(-50%)",
        padding: "12px 24px",
        background: "var(--brand-primary)",
        color: "#fff",
        borderRadius: "0 0 8px 8px",
        fontWeight: 600,
        fontSize: "0.875rem",
        textDecoration: "none",
        outline: "none",
        transition: "top 0.2s ease",
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
    </a>
  )
}
