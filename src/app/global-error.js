"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: '16px',
          padding: '24px',
          textAlign: 'center',
          background: '#0a0a0f',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>500</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>
            Something went wrong on our end.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '8px 24px',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 999,
              background: 'transparent',
              color: '#fff',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
