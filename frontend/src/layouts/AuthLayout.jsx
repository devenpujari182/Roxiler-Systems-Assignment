import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '45vw',
          height: '45vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(72,187,120,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Grid pattern overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(108,99,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108,99,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }}
      />

      {/* Auth card */}
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          position: 'relative',
          zIndex: 1,
          animation: 'slideInUp 0.4s ease',
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #6C63FF, #5048E5)',
              fontSize: 26,
              marginBottom: 14,
              boxShadow: '0 8px 32px rgba(108,99,255,0.4)',
              animation: 'glow 3s ease-in-out infinite',
            }}
          >
            ⭐
          </div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #8B85FF, #6C63FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              marginBottom: 6,
            }}
          >
            StoreRate
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Discover and rate your favorite stores
          </p>
        </div>

        {/* Glass card */}
        <div
          style={{
            background: 'rgba(22, 33, 62, 0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 20,
            padding: '36px 32px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {children}
        </div>

        <p
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: 'var(--text-muted)',
            marginTop: 20,
          }}
        >
          © 2024 StoreRate. All rights reserved.
        </p>
      </div>

      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 8px 32px rgba(108,99,255,0.4); }
          50% { box-shadow: 0 8px 48px rgba(108,99,255,0.7); }
        }
      `}</style>
    </div>
  )
}

export default AuthLayout
