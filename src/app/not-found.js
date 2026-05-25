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
          background: linear-gradient(135deg, #000000 0%, #160320 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: var(--font-inter);
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
          color: #a855f7;
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
          color: #a855f7;
        }
        .nf-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 44px;
          padding: 0 50px;
          border: 1px solid #a855f7;
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 500;
          background: transparent;
          color: white;
          text-decoration: none;
          transition: background 0.2s;
          color: #a855f7;
        }
        .nf-btn:hover {
          background: #a855f7;
          color: white;
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
          <div className="nf-title">
            <h1 className="nf-404-main glitch-text">404</h1>
            <h1 className="nf-404-shadow1 glitch-text-shadow">404</h1>
            <h1 className="nf-404-shadow2 glitch-text-shadow-2">404</h1>
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
