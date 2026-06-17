import React from 'react'

const Spinner = ({ size = 24, color = '#6C63FF' }) => (
  <>
    <div style={{
      width: size, height: size,
      border: `2px solid rgba(108,99,255,0.2)`,
      borderTop: `2px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </>
)

export default Spinner
