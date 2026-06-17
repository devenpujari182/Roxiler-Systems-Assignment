import React from 'react'
import useAuth from '../hooks/useAuth'
import { Link, useLocation } from 'react-router-dom'

const NAV = {
  ADMIN: [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/stores', label: 'Stores', icon: '🏪' },
    { path: '/admin/add-user', label: 'Add User', icon: '➕' },
    { path: '/admin/add-store', label: 'Add Store', icon: '🏬' },
    { path: '/admin/change-password', label: 'Change Password', icon: '🔐' },
  ],
  USER: [
    { path: '/stores', label: 'Browse Stores', icon: '🏪' },
    { path: '/user/change-password', label: 'Change Password', icon: '🔐' },
  ],
  STORE_OWNER: [
    { path: '/store-owner/dashboard', label: 'My Store', icon: '📊' },
    { path: '/store-owner/change-password', label: 'Change Password', icon: '🔐' },
  ],
}

const ROLE_BADGE = {
  ADMIN:       { bg: 'rgba(108,99,255,0.2)', color: '#8B85FF', border: '1px solid rgba(108,99,255,0.3)' },
  USER:        { bg: 'rgba(72,187,120,0.15)', color: '#68D391', border: '1px solid rgba(72,187,120,0.25)' },
  STORE_OWNER: { bg: 'rgba(246,173,85,0.15)', color: '#F6AD55', border: '1px solid rgba(246,173,85,0.25)' },
}

const initials = (name) =>
  name ? name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() : 'U'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const nav = NAV[user?.role] || []
  const badge = ROLE_BADGE[user?.role] || ROLE_BADGE.USER

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0,
      width: 'var(--sidebar-width, 260px)',
      background: 'linear-gradient(180deg, #12122A 0%, #0F0F1A 100%)',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', flexDirection: 'column', zIndex: 100, overflowY: 'auto',
    }}>
      {/* Brand */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #6C63FF, #5048E5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 4px 16px rgba(108,99,255,0.4)',
          }}>⭐</div>
          <div>
            <div style={{
              fontSize: 17, fontWeight: 800,
              background: 'linear-gradient(135deg, #a09aff, #6C63FF)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}>StoreRate</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              PLATFORM
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 10px' }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 8px', marginBottom: 6 }}>
          Navigation
        </p>
        {nav.map(item => {
          const active = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 10, marginBottom: 2,
                textDecoration: 'none', fontSize: 13.5,
                fontWeight: active ? 600 : 400,
                color: active ? '#fff' : 'var(--text-secondary)',
                background: active ? 'linear-gradient(135deg, rgba(108,99,255,0.85), rgba(80,72,229,0.85))' : 'transparent',
                boxShadow: active ? '0 4px 14px rgba(108,99,255,0.3)' : 'none',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(108,99,255,0.1)'; e.currentTarget.style.color = '#fff' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
            >
              <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: 10,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          marginBottom: 10,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6C63FF, #5048E5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {initials(user?.name)}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'User'}
            </p>
            <span style={{
              fontSize: 9.5, fontWeight: 700, padding: '1px 6px', borderRadius: 8,
              letterSpacing: '0.04em', textTransform: 'uppercase',
              background: badge.bg, color: badge.color, border: badge.border,
            }}>
              {user?.role?.replace('_', ' ')}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            width: '100%', padding: '9px 12px',
            background: 'transparent', border: '1px solid rgba(252,129,129,0.2)',
            borderRadius: 10, color: '#FC8181',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(252,129,129,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          🚪 Sign Out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
