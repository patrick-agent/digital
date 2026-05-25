'use client'

export default function LoadingSpinner({ text = "Loading" }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: '24px',
      background: 'var(--bg, #0a0a0f)',
    }}>
      <div className="spinner-ring" />
      <p style={{
        fontFamily: 'var(--font-inter, sans-serif)',
        fontSize: 14,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
      }}>
        {text}
      </p>
      <style>{`
        .spinner-ring {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.1);
          border-top-color: #a855f7;
          animation: ls-spin 0.8s linear infinite;
        }
        @keyframes ls-spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}
