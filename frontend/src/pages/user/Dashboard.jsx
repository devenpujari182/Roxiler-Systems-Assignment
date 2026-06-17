import React from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import useAuth from '../../hooks/useAuth'

const UserDashboard = () => {
  const { user } = useAuth()
  return (
    <DashboardLayout title="Dashboard">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
          Hello, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Ready to explore and rate stores?</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {[
          { to: '/stores', icon: '🏪', label: 'Browse Stores', desc: 'Discover and rate stores in our platform', color: '#6C63FF' },
          { to: '/user/change-password', icon: '🔐', label: 'Change Password', desc: 'Update your account security password', color: '#48BB78' },
        ].map(a => (
          <Link key={a.to} to={a.to} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: 24, transition: 'all 0.2s', borderLeft: `3px solid ${a.color}`,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ fontSize: 26, marginBottom: 12 }}>{a.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{a.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  )
}

export default UserDashboard
