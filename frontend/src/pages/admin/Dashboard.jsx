import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatCard from '../../components/StatCard'
import { getDashboard } from '../../services/adminService'
import Spinner from '../../components/Spinner'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard()
      .then(res => setStats(res.data.data))
      .catch(() => setError('Failed to load dashboard stats.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout title="Admin Dashboard">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
          📊 Admin Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Platform-wide overview and quick actions
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Spinner size={40} />
        </div>
      ) : error ? (
        <div style={{ padding: '14px 18px', background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.3)', borderRadius: 12, color: '#FC8181' }}>
          {error}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 36 }}>
            <StatCard icon="👥" label="Total Users" value={stats?.totalUsers ?? 0} color="#6C63FF" bg="rgba(108,99,255,0.15)" />
            <StatCard icon="🏪" label="Total Stores" value={stats?.totalStores ?? 0} color="#00D4FF" bg="rgba(0,212,255,0.12)" />
            <StatCard icon="⭐" label="Total Ratings" value={stats?.totalRatings ?? 0} color="#FFD060" bg="rgba(255,208,96,0.12)" />
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom: 10 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 16 }}>⚡ Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
              {[
                { to: '/admin/users', icon: '👥', label: 'Manage Users', desc: 'View, filter and manage all users', color: '#6C63FF' },
                { to: '/admin/stores', icon: '🏪', label: 'Manage Stores', desc: 'View stores and their ratings', color: '#00D4FF' },
                { to: '/admin/add-user', icon: '➕', label: 'Add New User', desc: 'Create a user with any role', color: '#48BB78' },
                { to: '/admin/add-store', icon: '🏬', label: 'Add New Store', desc: 'Register a new store', color: '#F6AD55' },
              ].map(a => (
                <Link key={a.to} to={a.to} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14, padding: 20, transition: 'all 0.2s',
                    borderLeft: `3px solid ${a.color}`,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 10 }}>{a.icon}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{a.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  )
}

export default AdminDashboard
