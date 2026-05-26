/**
 * Fallback Renderer for 3D Components
 * Provides alternative content when WebGL is not available or fails
 */
"use client";

import { useEffect, useState } from 'react';

export function Canvas3DFallback({ children, fallback }) {
  const [showFallback, setShowFallback] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if WebGL is available
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      
      if (!gl) {
        setShowFallback(true);
        setError('WebGL not available');
      }
    } catch (e) {
      setShowFallback(true);
      setError(e.message);
    }
  }, []);

  if (showFallback) {
    return fallback || (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        color: '#888',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        fontSize: '12px',
      }}>
        3D content not available on this device
      </div>
    );
  }

  return children;
}

/**
 * Progressive Enhancement Component
 * Shows content while 3D is loading, then enhances with 3D when ready
 */
export function ProgressiveCanvas3D({ children, fallback, isMobile }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // On mobile, skip heavy 3D rendering
  if (isMobile) {
    return fallback || <div style={{ width: '100%', height: '100%' }} />;
  }

  return children;
}

export default Canvas3DFallback;
