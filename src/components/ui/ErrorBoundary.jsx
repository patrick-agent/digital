'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({ error, reset, title = "Something went wrong" }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '16px',
      padding: '24px',
      textAlign: 'center',
      background: 'var(--bg, #0a0a0f)',
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: 'rgba(239,68,68,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
      }}>
        !
      </div>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#fff',
        fontFamily: 'var(--font-body)',
      }}>
        {title}
      </h2>
      <p style={{
        fontSize: '0.875rem',
        color: 'rgba(255,255,255,0.5)',
        maxWidth: 400,
        fontFamily: 'var(--font-body)',
      }}>
        {error?.message || 'An unexpected error occurred'}
      </p>
      {reset && (
        <button
          onClick={reset}
          style={{
            marginTop: 8,
            padding: '8px 24px',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 999,
            background: 'transparent',
            color: '#fff',
            fontSize: '0.875rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
        >
          Try again
        </button>
      )}
    </div>
  )
}
