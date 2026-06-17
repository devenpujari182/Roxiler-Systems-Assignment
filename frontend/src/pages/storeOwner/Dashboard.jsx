import React, { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../layouts/DashboardLayout'
import Pagination from '../../components/Pagination'
import Spinner from '../../components/Spinner'
import RatingStars from '../../components/RatingStars'
import { getOwnerDashboard } from '../../services/storeOwnerService'

const StoreOwnerDashboard = () => {
  const [data, setData]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [page, setPage]           = useState(1)
  const [limit]                   = useState(10)
  const [sortBy, setSortBy]       = useState('r.created_at')
  const [sortOrder, setSortOrder] = useState('DESC')
  const [search, setSearch]       = useState('')
  const [searchInput, setSearchInput] = useState('')

  // data.pagination.total is what the backend returns
  const total      = data?.pagination?.total ?? 0
  const totalPages = data ? Math.ceil(total / limit) : 0

  const load = useCallback(() => {
    setLoading(true)
    const params = { page, limit, sortBy, sortOrder, search }
    getOwnerDashboard(params)
      .then(res => setData(res.data.data))
      .catch(err => {
        // 404 means no store assigned yet — show graceful message
        if (err.response?.status !== 404) toast.error('Failed to load dashboard.')
        else setData({ noStore: true })
      })
      .finally(() => setLoading(false))
  }, [page, limit, sortBy, sortOrder, search])

  useEffect(() => { load() }, [load])

  const handleSort = (col) => {
    if (sortBy === col) setSortOrder(o => o === 'ASC' ? 'DESC' : 'ASC')
    else { setSortBy(col); setSortOrder('ASC') }
    setPage(1)
  }

  const SortIcon = ({ col }) => sortBy === col
    ? <span style={{ color: '#6C63FF', marginLeft: 4 }}>{sortOrder === 'ASC' ? '↑' : '↓'}</span>
    : <span style={{ color: 'rgba(255,255,255,0.2)', marginLeft: 4 }}>⇅</span>

  const thStyle = (col) => ({
    padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)',
    cursor: col ? 'pointer' : 'default', userSelect: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  })

  return (
    <DashboardLayout title="Store Dashboard">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 6 }}>📊 My Store Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Overview of your store's performance and customer ratings</p>
      </div>

      {loading && !data ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={40} /></div>
      ) : data?.noStore ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏪</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 10 }}>No Store Assigned</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 360, margin: '0 auto' }}>
            Your account doesn't have a store assigned yet. Please contact the administrator to link your store.
          </p>
        </div>
      ) : data ? (
        <>
          {/* Store Info Card */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <div style={{ width: 60, height: 60, borderRadius: 14, background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(108,99,255,0.2))', border: '1px solid rgba(0,212,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                🏪
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                  {data.store?.name}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 2 }}>📍 {data.store?.address}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>✉ {data.store?.email}</p>
              </div>

              {/* Average Rating */}
              <div style={{ textAlign: 'center', background: 'rgba(255,208,96,0.08)', border: '1px solid rgba(255,208,96,0.2)', borderRadius: 14, padding: '16px 24px' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#FFD060', lineHeight: 1 }}>
                  {data.store?.avg_rating ? parseFloat(data.store.avg_rating).toFixed(1) : '—'}
                </div>
                <RatingStars value={parseFloat(data.store?.avg_rating) || 0} size={16} />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  {total} rating{total !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Ratings Table */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: '#fff' }}>
                Customer Ratings {total > 0 && `(${total})`}
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="text" value={searchInput} placeholder="Search by customer name..."
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { setSearch(searchInput); setPage(1) } }}
                  style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
                />
                <button onClick={() => { setSearch(searchInput); setPage(1) }}
                  style={{ padding: '8px 14px', background: '#6C63FF', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, cursor: 'pointer' }}>
                  Search
                </button>
                {search && <button onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }}
                  style={{ padding: '8px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}>
                  Clear
                </button>}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><Spinner size={32} /></div>
              ) : !data.ratings || data.ratings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>⭐</div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                    {search ? 'No ratings match your search.' : 'No ratings yet. Share your store to get ratings!'}
                  </div>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <tr>
                      {[
                        { label: 'Customer',  col: 'user_name' },
                        { label: 'Email',     col: 'user_email' },
                        { label: 'Rating',    col: 'rating' },
                        { label: 'Date',      col: 'r.created_at' },
                      ].map(({ label, col }) => (
                        <th key={label} style={thStyle(col)} onClick={() => handleSort(col)}>
                          {label}<SortIcon col={col} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.ratings.map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '13px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #5048E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                              {r.user_name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?'}
                            </div>
                            <span style={{ fontSize: 13.5, color: '#fff', fontWeight: 500 }}>{r.user_name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{r.user_email}</td>
                        <td style={{ padding: '13px 16px' }}>
                          <RatingStars value={r.rating} size={16} />
                        </td>
                        <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-muted)' }}>
                          {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={setPage} />
            </div>
          </div>
        </>
      ) : null}
    </DashboardLayout>
  )
}

export default StoreOwnerDashboard
