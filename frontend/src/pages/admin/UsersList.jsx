import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import DashboardLayout from '../../layouts/DashboardLayout'
import Pagination from '../../components/Pagination'
import Spinner from '../../components/Spinner'
import { getUsers } from '../../services/adminService'

const ROLES = ['', 'ADMIN', 'USER', 'STORE_OWNER']
const ROLE_STYLE = {
  ADMIN:       { bg: 'rgba(108,99,255,0.18)', color: '#8B85FF', border: '1px solid rgba(108,99,255,0.35)' },
  USER:        { bg: 'rgba(72,187,120,0.15)', color: '#68D391', border: '1px solid rgba(72,187,120,0.25)' },
  STORE_OWNER: { bg: 'rgba(246,173,85,0.15)', color: '#F6AD55', border: '1px solid rgba(246,173,85,0.25)' },
}

const UsersList = () => {
  const [users, setUsers]       = useState([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(1)
  const [limit]                 = useState(10)
  const [sortBy, setSortBy]     = useState('created_at')
  const [sortOrder, setSortOrder] = useState('DESC')
  const [filters, setFilters]   = useState({ name: '', email: '', role: '' })
  const [search, setSearch]     = useState({ name: '', email: '', role: '' })

  const totalPages = Math.ceil(total / limit)

  const load = useCallback(() => {
    setLoading(true)
    const params = { page, limit, sortBy, sortOrder }
    if (search.name)  params.name  = search.name
    if (search.email) params.email = search.email
    if (search.role)  params.role  = search.role

    getUsers(params)
      .then(res => {
        setUsers(res.data.data.users)
        setTotal(res.data.data.total)
      })
      .catch(() => toast.error('Failed to load users.'))
      .finally(() => setLoading(false))
  }, [page, limit, sortBy, sortOrder, search])

  useEffect(() => { load() }, [load])

  const handleSort = (col) => {
    if (sortBy === col) setSortOrder(o => o === 'ASC' ? 'DESC' : 'ASC')
    else { setSortBy(col); setSortOrder('ASC') }
    setPage(1)
  }

  const applyFilters = () => { setSearch({ ...filters }); setPage(1) }
  const clearFilters = () => { setFilters({ name: '', email: '', role: '' }); setSearch({ name: '', email: '', role: '' }); setPage(1) }

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <span style={{ color: 'rgba(255,255,255,0.2)', marginLeft: 4 }}>⇅</span>
    return <span style={{ color: '#6C63FF', marginLeft: 4 }}>{sortOrder === 'ASC' ? '↑' : '↓'}</span>
  }

  const thStyle = (col) => ({
    padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)',
    cursor: col ? 'pointer' : 'default', userSelect: 'none', whiteSpace: 'nowrap',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  })

  return (
    <DashboardLayout title="User Management">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4 }}>👥 Users</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{total} total users found</p>
        </div>
        <Link to="/admin/add-user" style={{
          padding: '10px 20px', background: 'linear-gradient(135deg, #6C63FF, #5048E5)',
          color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 600,
          boxShadow: '0 4px 14px rgba(108,99,255,0.35)',
        }}>
          ➕ Add User
        </Link>
      </div>

      {/* Filters */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '18px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {[
            { key: 'name', placeholder: 'Filter by name...' },
            { key: 'email', placeholder: 'Filter by email...' },
          ].map(({ key, placeholder }) => (
            <div key={key} style={{ flex: 1, minWidth: 160 }}>
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
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>Role</label>
            <select
              value={filters.role} onChange={e => setFilters(p => ({ ...p, role: e.target.value }))}
              style={{ width: '100%', padding: '9px 12px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff', fontSize: 13, outline: 'none' }}
            >
              {ROLES.map(r => <option key={r} value={r}>{r || 'All Roles'}</option>)}
            </select>
          </div>
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
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>👤</div>
            <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>No users found</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
              <tr>
                {[
                  { label: 'Name', col: 'name' },
                  { label: 'Email', col: 'email' },
                  { label: 'Role', col: 'role' },
                  { label: 'Joined', col: 'created_at' },
                  { label: 'Actions', col: null },
                ].map(({ label, col }) => (
                  <th key={label} style={thStyle(col)} onClick={() => col && handleSort(col)}>
                    {label}{col && <SortIcon col={col} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => {
                const rs = ROLE_STYLE[u.role] || ROLE_STYLE.USER
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #6C63FF, #5048E5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                          {u.name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <span style={{ fontSize: 13.5, fontWeight: 500, color: '#fff' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', ...rs }}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-muted)' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <Link to={`/admin/users/${u.id}`} style={{
                        padding: '5px 14px', background: 'rgba(108,99,255,0.15)',
                        border: '1px solid rgba(108,99,255,0.3)', borderRadius: 8,
                        color: '#8B85FF', fontSize: 12, fontWeight: 600, textDecoration: 'none',
                        transition: 'all 0.15s',
                      }}>
                        View
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={setPage} />
      </div>
    </DashboardLayout>
  )
}

export default UsersList
