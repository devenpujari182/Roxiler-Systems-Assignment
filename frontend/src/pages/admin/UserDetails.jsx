import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import DashboardLayout from '../../layouts/DashboardLayout'
import Spinner from '../../components/Spinner'
import RatingStars from '../../components/RatingStars'
import { getUserById } from '../../services/adminService'

const ROLE_STYLE = {
  ADMIN:       { bg: 'rgba(108,99,255,0.18)', color: '#8B85FF', border: '1px solid rgba(108,99,255,0.35)' },
  USER:        { bg: 'rgba(72,187,120,0.15)', color: '#68D391', border: '1px solid rgba(72,187,120,0.25)' },
  STORE_OWNER: { bg: 'rgba(246,173,85,0.15)', color: '#F6AD55', border: '1px solid rgba(246,173,85,0.25)' },
}

const InfoRow = ({ label, value }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: 14, color: 'var(--text-primary)', wordBreak: 'break-word' }}>{value || '—'}</div>
  </div>
)

const UserDetails = () => {
  const { id } = useParams()
  const [user, setUser]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserById(id)
      .then(res => {
        // Backend returns { data: { user: {...} } } or { data: { user: {...}, store: {...}, avg_store_rating: ... } }
        const payload = res.data.data
        // getUserById wraps it in { user } key
        setUser(payload.user || payload)
      })
      .catch(() => toast.error('Failed to load user details.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <DashboardLayout title="User Details">
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><Spinner size={40} /></div>
    </DashboardLayout>
  )

  if (!user) return (
    <DashboardLayout title="User Details">
      <div style={{ textAlign: 'center', padding: 60, color: '#FC8181' }}>
        <div style={{ fontSize: 36 }}>⚠</div>
        <div style={{ marginTop: 12 }}>User not found.</div>
      </div>
    </DashboardLayout>
  )

  const rs = ROLE_STYLE[user.role] || ROLE_STYLE.USER

  return (
    <DashboardLayout title="User Details">
      <div style={{ marginBottom: 20 }}>
        <Link to="/admin/users" style={{ color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none' }}>
          ← Back to Users
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 24, alignItems: 'start' }}>
        {/* User Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6C63FF, #5048E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700, color: '#fff',
              marginBottom: 14, boxShadow: '0 6px 24px rgba(108,99,255,0.4)',
            }}>
              {user.name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?'}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{user.name}</h2>
            <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', ...rs }}>
              {user.role?.replace('_', ' ')}
            </span>
          </div>

          <InfoRow label="📧 Email" value={user.email} />
          <InfoRow label="📍 Address" value={user.address} />
          <InfoRow label="🆔 User ID" value={`#${user.id}`} />
          <InfoRow label="📅 Joined" value={user.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null} />
        </div>

        {/* Role-specific info */}
        <div>
          {user.role === 'STORE_OWNER' && user.store && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 18 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 16 }}>🏪 Assigned Store</h3>
              <InfoRow label="Store Name" value={user.store.name} />
              <InfoRow label="Store Email" value={user.store.email} />
              <InfoRow label="Address" value={user.store.address} />
              {user.avg_store_rating != null && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    Average Rating
                  </div>
                  <RatingStars value={user.avg_store_rating} size={20} />
                </div>
              )}
            </div>
          )}

          {/* Account Summary */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 16 }}>📋 Account Details</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Role</div>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', ...rs }}>
                  {user.role?.replace('_', ' ')}
                </span>
              </div>
              <div style={{ background: 'rgba(72,187,120,0.08)', border: '1px solid rgba(72,187,120,0.2)', borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Status</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#68D391' }}>✓ Active</div>
              </div>
            </div>

            {user.role === 'USER' && (
              <div style={{ marginTop: 16, padding: '14px 18px', background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
                ℹ This user can browse stores and submit ratings.
              </div>
            )}
            {user.role === 'ADMIN' && (
              <div style={{ marginTop: 16, padding: '14px 18px', background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
                🛡 This user has full administrative access.
              </div>
            )}
            {user.role === 'STORE_OWNER' && !user.store && (
              <div style={{ marginTop: 16, padding: '14px 18px', background: 'rgba(252,129,129,0.07)', border: '1px solid rgba(252,129,129,0.2)', borderRadius: 12, fontSize: 13, color: '#FC8181' }}>
                ⚠ No store is currently assigned to this user.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UserDetails
