"use client";

import { useEffect, useState, useRef } from "react";
import { useLoading } from "@/context/LoadingContext";

export default function LoadingScreen() {
  const { isLoading, progress } = useLoading();
  const [fadeOut, setFadeOut] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!isLoading) {
      setFadeOut(true);
      const t = setTimeout(() => setRevealed(true), 800);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  useEffect(() => {
    if (revealed || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h, particles = [];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const isMobile = w < 640;
      particles = Array.from({ length: isMobile ? 20 : 40 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
      }));
    }
    resize();
    window.addEventListener("resize", resize);

    let running = true;
    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.4);
      grad.addColorStop(0, "rgba(168, 85, 247, 0.05)");
      grad.addColorStop(1, "rgba(6, 6, 8, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(168, 85, 247, 0.15)";
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(draw);
    }
    animRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [revealed]);

  if (revealed) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#060608",
        opacity: fadeOut ? 0 : 1,
        visibility: fadeOut ? "hidden" : "visible",
        transition: "opacity 0.6s ease, visibility 0.6s ease",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />

      {/* Logo with rotation */}
      <div
        style={{
          position: "relative",
          width: 80,
          height: 80,
          marginBottom: 32,
          animation: "ls-spin 2s linear infinite",
        }}
      >
        <img
          src="/logo.png"
          alt="Tachy"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 200,
          height: 3,
          background: "rgba(255,255,255,0.06)",
          borderRadius: 3,
          overflow: "hidden",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: `${Math.max(progress, 3)}%`,
            height: "100%",
            background: "linear-gradient(90deg, #a855f7, #ec4899)",
            borderRadius: 3,
            transition: "width 0.3s ease",
            boxShadow: "0 0 12px rgba(168,85,247,0.5)",
          }}
        />
      </div>

      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(0.7rem, 0.9vw, 0.8rem)",
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
        }}
      >
        Loading... {Math.round(progress)}%
      </p>

      <style>{`
        @keyframes ls-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
