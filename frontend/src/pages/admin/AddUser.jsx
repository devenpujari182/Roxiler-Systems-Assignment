import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import DashboardLayout from '../../layouts/DashboardLayout'
import Spinner from '../../components/Spinner'
import { addUser } from '../../services/adminService'

const ROLES = ['USER', 'ADMIN', 'STORE_OWNER']

const inputStyle = (hasError) => ({
  width: '100%', padding: '11px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${hasError ? '#FC8181' : 'rgba(255,255,255,0.1)'}`,
  borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', transition: 'all 0.2s',
})

const AddUser = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'USER' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name) errs.name = 'Name is required'
    else if (form.name.trim().length < 20) errs.name = 'Name must be at least 20 characters'
    else if (form.name.trim().length > 60) errs.name = 'Name must be at most 60 characters'
    if (!form.email) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8 || form.password.length > 16) errs.password = 'Must be 8–16 characters'
    else if (!/[A-Z]/.test(form.password)) errs.password = 'Must include uppercase letter'
    else if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\\/`~;']/.test(form.password)) errs.password = 'Must include special character'
    if (!form.role) errs.role = 'Role is required'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await addUser(form)
      toast.success('User created successfully!')
      navigate('/admin/users')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create user.'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout title="Add User">
      <div style={{ maxWidth: 580 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 6 }}>➕ Add New User</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Create a user account with any role.</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 28 }}>
          {errors.general && (
            <div style={{ padding: '10px 14px', background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.3)', borderRadius: 10, color: '#FC8181', fontSize: 13, marginBottom: 20 }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Full Name <span style={{ color: '#FC8181' }}>*</span>
              </label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Min 20 characters" style={inputStyle(!!errors.name)}
                onFocus={e => { e.target.style.borderColor = '#6C63FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)' }}
                onBlur={e => { e.target.style.borderColor = errors.name ? '#FC8181' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
              />
              {errors.name && <p style={{ fontSize: 12, color: '#FC8181', marginTop: 4 }}>⚠ {errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Email <span style={{ color: '#FC8181' }}>*</span>
              </label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="user@example.com" style={inputStyle(!!errors.email)}
                onFocus={e => { e.target.style.borderColor = '#6C63FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)' }}
                onBlur={e => { e.target.style.borderColor = errors.email ? '#FC8181' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
              />
              {errors.email && <p style={{ fontSize: 12, color: '#FC8181', marginTop: 4 }}>⚠ {errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Password <span style={{ color: '#FC8181' }}>*</span>
              </label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="8–16 chars, uppercase + special" style={inputStyle(!!errors.password)}
                onFocus={e => { e.target.style.borderColor = '#6C63FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)' }}
                onBlur={e => { e.target.style.borderColor = errors.password ? '#FC8181' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
              />
              {errors.password && <p style={{ fontSize: 12, color: '#FC8181', marginTop: 4 }}>⚠ {errors.password}</p>}
            </div>

            {/* Role */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Role <span style={{ color: '#FC8181' }}>*</span>
              </label>
              <select name="role" value={form.role} onChange={handleChange}
                style={{ ...inputStyle(!!errors.role), background: '#1a1a2e', cursor: 'pointer' }}>
                {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
              {errors.role && <p style={{ fontSize: 12, color: '#FC8181', marginTop: 4 }}>⚠ {errors.role}</p>}
            </div>

            {/* Address */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Address <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>(optional)</span>
              </label>
              <textarea name="address" value={form.address} onChange={handleChange} placeholder="User's address" rows={2}
                style={{ ...inputStyle(!!errors.address), resize: 'vertical', fontFamily: 'inherit' }}
                onFocus={e => { e.target.style.borderColor = '#6C63FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              <button type="button" onClick={() => navigate('/admin/users')}
                style={{ flex: 1, padding: '11px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={loading}
                style={{ flex: 2, padding: '11px', background: loading ? 'rgba(108,99,255,0.5)' : 'linear-gradient(135deg, #6C63FF, #5048E5)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? <><Spinner size={16} color="#fff" /><span>Creating...</span></> : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AddUser
