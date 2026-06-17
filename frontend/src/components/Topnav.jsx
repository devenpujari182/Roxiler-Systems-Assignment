import React from 'react'
import useAuth from '../hooks/useAuth'

const Topnav = ({ title }) => {
  const { user } = useAuth()

  const pageTitle = title || 'Dashboard'

  return (
    <div style={{
      height: 64,
      marginLeft: 'var(--sidebar-width, 260px)',
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,10,22,0.85)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
    }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
        {pageTitle}
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {user?.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6C63FF, #5048E5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: '#fff',
        }}>
          {user?.name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'U'}
        </div>
      </div>
    </div>
  )
}

export default Topnav
