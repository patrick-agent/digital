"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import dynamic from "next/dynamic";
import "./glitch.css";

const AboutCanvas = dynamic(
  () => import("@/components/artist/about/AboutCanvas"),
  { ssr: false, loading: () => null }
);

export default function NotFound() {
  return (
    <>
      <style>{`
        .nf-root {
          position: fixed;
          inset: 0;
          background: linear-gradient(135deg, var(--bg-primary) 0%, #160320 100%);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: var(--font-body);
        }
        .nf-bg-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .nf-bg-canvas canvas {
          width: 100%;
          height: 100%;
        }
        .nf-scanlines {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .nf-content {
          position: relative;
          z-index: 10;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          max-width: 42rem;
          padding: 0 16px;
        }
        .nf-title {
          position: relative;
        }
        .nf-404-main {
          font-size: 8rem;
          font-weight: 900;
          user-select: none;
          color: transparent;
        }
        .nf-404-shadow1 {
          position: absolute;
          inset: 0;
          font-size: 8rem;
          font-weight: 900;
          user-select: none;
          color: var(--accent-primary);
        }
        .nf-404-shadow2 {
          position: absolute;
          inset: 0;
          font-size: 8rem;
          font-weight: 900;
          user-select: none;
          color: rgba(73, 2, 139, 0.9);
        }
        .nf-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .nf-msg-text {
          font-size: 1.25rem;
          font-weight: 200;
          color: #a0a0b8;
        }
        .nf-msg-sub {
          font-size: 0.875rem;
          font-weight: 200;
          color: var(--accent-primary);
        }
        .nf-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 44px;
          padding: 0 50px;
          border: 1px solid var(--accent-primary);
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 500;
          background: transparent;
          color: var(--text-primary);
          text-decoration: none;
          transition: background 0.2s;
          color: var(--accent-primary);
        }
        .nf-btn:hover {
          background: var(--accent-primary);
          color: var(--text-primary);
        }
        @media (min-width: 768px) {
          .nf-404-main,
          .nf-404-shadow1,
          .nf-404-shadow2 {
            font-size: 12rem;
          }
          .nf-msg-text {
            font-size: 1.5rem;
          }
          .nf-msg-sub {
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="nf-root">
        <div className="nf-bg-canvas">
          <AboutCanvas />
        </div>
        <div className="nf-scanlines">
          <div className="glitch-line glitch-line-1" />
          <div className="glitch-line glitch-line-2" />
        </div>
        <div className="nf-content">
          <div className="nf-title" role="img" aria-label="404">
            <h1 className="nf-404-main glitch-text" aria-hidden="true">404</h1>
            <h1 className="nf-404-shadow1 glitch-text-shadow" aria-hidden="true">404</h1>
            <h1 className="nf-404-shadow2 glitch-text-shadow-2" aria-hidden="true">404</h1>
          </div>
          <div className="nf-message">
            <p className="nf-msg-text glitch-message">This page not found !!!</p>
          </div>
          <div style={{ paddingTop: 16 }}>
            <Link href="/" className="nf-btn">
              <Home style={{ width: 16, height: 16 }} />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
