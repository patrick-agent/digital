"use client";

import { useRef, useCallback } from "react";

export default function NeonButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  style = {},
  ...props
}) {
  const btnRef = useRef(null);
  const magneticRef = useRef({ x: 0, y: 0 });

  const variants = {
    primary: {
      background: "linear-gradient(135deg, #a855f7, #6366f1)",
      color: "#fff",
      border: "none",
      glow: "rgba(168, 85, 247, 0.4)",
    },
    secondary: {
      background: "transparent",
      color: "#a855f7",
      border: "1px solid rgba(168, 85, 247, 0.3)",
      glow: "rgba(168, 85, 247, 0.2)",
    },
    ghost: {
      background: "rgba(255, 255, 255, 0.03)",
      color: "#a0a0b8",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      glow: "rgba(168, 85, 247, 0.1)",
    },
  };

  const sizes = {
    sm: { padding: "8px 20px", fontSize: "0.8rem" },
    md: { padding: "12px 28px", fontSize: "0.9rem" },
    lg: { padding: "16px 36px", fontSize: "1rem" },
  };

  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  const handleMouseMove = useCallback((e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    magneticRef.current = { x: x * 0.15, y: y * 0.15 };
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    btn.style.transform = "translate(0, 0)";
  }, []);

  const Tag = href ? "a" : "button";

  return (
    <Tag
      ref={btnRef}
      href={href}
      onClick={onClick}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 700,
        fontFamily: "var(--font-heading)",
        color: v.color,
        background: v.background,
        border: v.border,
        borderRadius: "9999px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        textDecoration: "none",
        transition: "box-shadow 0.3s ease, transform 0.1s ease",
        boxShadow: `0 4px 20px ${v.glow}`,
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {icon && <span style={{ display: "flex" }}>{icon}</span>}
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </Tag>
  );
}
