"use client";

import { forwardRef } from "react";

const GlassPanel = forwardRef(({
  children,
  className = "",
  variant = "default",
  glow = false,
  cyberBorder = false,
  rotatingBorder = false,
  hoverEffect = true,
  enableHover = false,
  style = {},
  ...props
}, ref) => {
  const variants = {
    default: {
      background: "rgba(18, 18, 30, 0.4)",
      borderColor: "rgba(255, 255, 255, 0.06)",
    },
    elevated: {
      background: "rgba(16, 16, 28, 0.6)",
      borderColor: "rgba(255, 255, 255, 0.08)",
    },
    dark: {
      background: "rgba(6, 6, 8, 0.6)",
      borderColor: "rgba(255, 255, 255, 0.04)",
    },
  };

  const v = variants[variant] || variants.default;

  return (
    <div
      ref={ref}
      className={`${className} ${cyberBorder ? "cyber-border-panel" : ""} ${rotatingBorder ? "rotating-border-panel" : ""} ${enableHover ? "hover-glow-panel" : ""}`}
      style={{
        background: v.background,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: cyberBorder || rotatingBorder
          ? "1px solid transparent"
          : `1px solid ${v.borderColor}`,
        borderRadius: "16px",
        boxShadow: cyberBorder || rotatingBorder
          ? (glow
            ? `0 0 25px rgba(168, 85, 247, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
            : `inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.4)`)
          : (glow
            ? `0 0 30px rgba(168, 85, 247, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)`
            : `inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.4)`),
        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        ...style,
      }}
      {...props}
    >
      {rotatingBorder && (
        <div
          className="scanning-line"
          style={{
            position: "absolute",
            inset: "0",
            borderRadius: "16px",
            padding: "1px",
            background: "linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.9) 25%, rgba(168,85,247,0.95) 50%, rgba(168,85,247,0.9) 75%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "scanBorder 2s linear infinite",
            pointerEvents: "none",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      )}
      {cyberBorder && (
        <div
          className="cyber-border-overlay"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "16px",
            padding: "1px",
            background: "linear-gradient(135deg, rgba(168,85,247,0.9) 0%, rgba(99,102,241,0.7) 50%, rgba(168,85,247,0.9) 100%)",
            WebkitBackgroundClip: "text",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
            opacity: 0.6,
            transition: "opacity 0.4s ease",
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
});

GlassPanel.displayName = "GlassPanel";
export default GlassPanel;
