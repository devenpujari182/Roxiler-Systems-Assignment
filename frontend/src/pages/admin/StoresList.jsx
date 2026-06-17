import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import DashboardLayout from '../../layouts/DashboardLayout'
import Pagination from '../../components/Pagination'
import Spinner from '../../components/Spinner'
import RatingStars from '../../components/RatingStars'
import { getStores } from '../../services/adminService'

const StoresList = () => {
  const [stores, setStores]   = useState([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(1)
  const [limit]               = useState(10)
  const [sortBy, setSortBy]   = useState('created_at')
  const [sortOrder, setSortOrder] = useState('DESC')
  const [filters, setFilters] = useState({ name: '', email: '', address: '' })
  const [search, setSearch]   = useState({ name: '', email: '', address: '' })

  const totalPages = Math.ceil(total / limit)

  const load = useCallback(() => {
    setLoading(true)
    const params = { page, limit, sortBy, sortOrder }
    if (search.name)    params.name    = search.name
    if (search.email)   params.email   = search.email
    if (search.address) params.address = search.address

    getStores(params)
      .then(res => {
        setStores(res.data.data.stores)
        setTotal(res.data.data.total)
      })
      .catch(() => toast.error('Failed to load stores.'))
      .finally(() => setLoading(false))
  }, [page, limit, sortBy, sortOrder, search])

  useEffect(() => { load() }, [load])

  const handleSort = (col) => {
    if (sortBy === col) setSortOrder(o => o === 'ASC' ? 'DESC' : 'ASC')
    else { setSortBy(col); setSortOrder('ASC') }
    setPage(1)
  }

  const applyFilters = () => { setSearch({ ...filters }); setPage(1) }
  const clearFilters = () => { setFilters({ name: '', email: '', address: '' }); setSearch({ name: '', email: '', address: '' }); setPage(1) }

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
    <DashboardLayout title="Store Management">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4 }}>🏪 Stores</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{total} total stores found</p>
        </div>
        <Link to="/admin/add-store" style={{
          padding: '10px 20px', background: 'linear-gradient(135deg, #6C63FF, #5048E5)',
          color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 600,
          boxShadow: '0 4px 14px rgba(108,99,255,0.35)',
        }}>
          🏬 Add Store
        </Link>
      </div>

      {/* Filters */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {[
            { key: 'name',    placeholder: 'Filter by store name...' },
            { key: 'email',   placeholder: 'Filter by email...' },
            { key: 'address', placeholder: 'Filter by address...' },
          ].map(({ key, placeholder }) => (
            <div key={key} style={{ flex: 1, minWidth: 150 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>
                {key}
              </label>
              <input
                type="text" value={filters[key]} placeholder={placeholder}
                onChange={e => setFilters(p => ({ ...p, [key]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && applyFilters()}
                style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
              />
            </div>
          ))}
          <button onClick={applyFilters} style={{ padding: '9px 18px', background: '#6C63FF', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Search
          </button>
          <button onClick={clearFilters} style={{ padding: '9px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}>
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}><Spinner size={36} /></div>
        ) : stores.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏪</div>
            <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>No stores found</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
              <tr>
                {[
                  { label: 'Store Name', col: 'name' },
                  { label: 'Email',      col: 'email' },
                  { label: 'Address',    col: 'address' },
                  { label: 'Avg. Rating', col: 'average_rating' },
                  { label: 'Ratings',    col: 'rating_count' },
                ].map(({ label, col }) => (
                  <th key={label} style={thStyle(col)} onClick={() => col && handleSort(col)}>
                    {label}{col && <SortIcon col={col} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stores.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg, #00D4FF22, #00D4FF44)', border: '1px solid rgba(0,212,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                        🏪
                      </div>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{s.email}</td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-muted)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.address}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    {s.average_rating != null
                      ? <RatingStars value={parseFloat(s.average_rating)} size={16} />
                      : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No ratings</span>
                    }
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {s.rating_count ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={setPage} />
      </div>
    </DashboardLayout>
  )
}

export default StoresList
