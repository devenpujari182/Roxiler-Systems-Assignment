import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import DashboardLayout from '../../layouts/DashboardLayout'
import Spinner from '../../components/Spinner'
import { addStore } from '../../services/adminService'

const inputStyle = (hasError) => ({
  width: '100%', padding: '11px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${hasError ? '#FC8181' : 'rgba(255,255,255,0.1)'}`,
  borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', transition: 'all 0.2s',
})

const AddStore = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.name) errs.name = 'Store name is required'
    else if (form.name.trim().length < 20) errs.name = 'Store name must be at least 20 characters'
    else if (form.name.trim().length > 60) errs.name = 'Store name must be at most 60 characters'
    if (!form.email) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.address) errs.address = 'Address is required'
    else if (form.address.trim().length > 400) errs.address = 'Address too long (max 400)'
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
    const payload = { ...form }
    if (!payload.owner_id) delete payload.owner_id
    try {
      await addStore(payload)
      toast.success('Store created successfully!')
      navigate('/admin/stores')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create store.'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  const onFocus = e => { e.target.style.borderColor = '#6C63FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)' }
  const onBlur = (field) => (e) => { e.target.style.borderColor = errors[field] ? '#FC8181' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }

  return (
    <DashboardLayout title="Add Store">
      <div style={{ maxWidth: 580 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 6 }}>🏬 Add New Store</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Register a new store on the platform.</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 28 }}>
          {errors.general && (
            <div style={{ padding: '10px 14px', background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.3)', borderRadius: 10, color: '#FC8181', fontSize: 13, marginBottom: 20 }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Store Name */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Store Name <span style={{ color: '#FC8181' }}>*</span>
              </label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Min 20 characters" style={inputStyle(!!errors.name)} onFocus={onFocus} onBlur={onBlur('name')} />
              {errors.name && <p style={{ fontSize: 12, color: '#FC8181', marginTop: 4 }}>⚠ {errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Store Email <span style={{ color: '#FC8181' }}>*</span>
              </label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="store@example.com" style={inputStyle(!!errors.email)} onFocus={onFocus} onBlur={onBlur('email')} />
              {errors.email && <p style={{ fontSize: 12, color: '#FC8181', marginTop: 4 }}>⚠ {errors.email}</p>}
            </div>

            {/* Address */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Address <span style={{ color: '#FC8181' }}>*</span>
              </label>
              <textarea name="address" value={form.address} onChange={handleChange}
                placeholder="Full store address (max 400 characters)" rows={3}
                style={{ ...inputStyle(!!errors.address), resize: 'vertical', fontFamily: 'inherit' }}
                onFocus={onFocus} onBlur={onBlur('address')} />
              {errors.address && <p style={{ fontSize: 12, color: '#FC8181', marginTop: 4 }}>⚠ {errors.address}</p>}
            </div>

            {/* Owner ID (optional) */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Owner User ID <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>(optional)</span>
              </label>
              <input type="number" name="owner_id" value={form.owner_id} onChange={handleChange}
                placeholder="Assign to a store owner by user ID" style={inputStyle(false)}
                onFocus={onFocus} onBlur={onBlur('owner_id')} />
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Leave blank to create an unassigned store
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              <button type="button" onClick={() => navigate('/admin/stores')}
                style={{ flex: 1, padding: '11px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: 'var(--text-secondary)', fontSize: 14, cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={loading}
                style={{ flex: 2, padding: '11px', background: loading ? 'rgba(108,99,255,0.5)' : 'linear-gradient(135deg, #6C63FF, #5048E5)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? <><Spinner size={16} color="#fff" /><span>Creating...</span></> : 'Create Store'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AddStore
