import React from 'react'

const StatCard = ({ icon, label, value, color = '#6C63FF', bg = 'rgba(108,99,255,0.15)' }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 24,
    transition: 'all 0.2s ease',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)' }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
  >
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 3,
      background: `linear-gradient(90deg, ${color}, transparent)`,
    }} />
    <div style={{
      width: 48, height: 48, borderRadius: 12,
      background: bg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: 22, marginBottom: 16,
    }}>
      {icon}
    </div>
    <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 6 }}>
      {value?.toLocaleString?.() ?? value}
    </div>
    <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {label}
    </div>
  </div>
)

export default StatCard
