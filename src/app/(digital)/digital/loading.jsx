'use client'

import { useEffect, useState } from 'react'

export default function DigitalLoading() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50)
    return () => clearTimeout(t)
  }, [])

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0f',
      gap: '24px',
    }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.1)',
        borderTopColor: '#7c6fea',
        animation: 'am-spin 0.8s linear infinite',
      }} />
      <p style={{
        fontFamily: 'var(--am-font-display, sans-serif)',
        fontSize: 14,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
      }}>
        Loading
      </p>
      <style>{`@keyframes am-spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
