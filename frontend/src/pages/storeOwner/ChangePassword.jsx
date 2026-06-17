import React, { useState } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../layouts/DashboardLayout'
import { changePassword } from '../../services/authService'
import Spinner from '../../components/Spinner'

const inputStyle = (hasError) => ({
  width: '100%', padding: '11px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${hasError ? '#FC8181' : 'rgba(255,255,255,0.1)'}`,
  borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', transition: 'all 0.2s',
})

const StoreOwnerChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.currentPassword) errs.currentPassword = 'Current password is required'
    if (!form.newPassword) errs.newPassword = 'New password is required'
    else if (form.newPassword.length < 8 || form.newPassword.length > 16) errs.newPassword = 'Must be 8–16 characters'
    else if (!/[A-Z]/.test(form.newPassword)) errs.newPassword = 'Must include at least one uppercase letter'
    else if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\\/`~;']/.test(form.newPassword)) errs.newPassword = 'Must include at least one special character'
    else if (form.newPassword === form.currentPassword) errs.newPassword = 'New password must be different'
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your new password'
    else if (form.confirmPassword !== form.newPassword) errs.confirmPassword = 'Passwords do not match'
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
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      toast.success('Password changed successfully!')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setErrors({})
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password.'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, name, placeholder }) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
        {label}
      </label>
      <input type="password" name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
        style={inputStyle(!!errors[name])}
        onFocus={e => { e.target.style.borderColor = '#6C63FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)' }}
        onBlur={e => { e.target.style.borderColor = errors[name] ? '#FC8181' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
      />
      {errors[name] && <p style={{ fontSize: 12, color: '#FC8181', marginTop: 4 }}>⚠ {errors[name]}</p>}
    </div>
  )

  return (
    <DashboardLayout title="Change Password">
      <div style={{ maxWidth: 520 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 6 }}>🔐 Change Password</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Update your account password. You'll stay logged in.</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 28 }}>
          {errors.general && (
            <div style={{ padding: '10px 14px', background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.3)', borderRadius: 10, color: '#FC8181', fontSize: 13, marginBottom: 20 }}>
              {errors.general}
            </div>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <Field label="Current Password" name="currentPassword" placeholder="Enter your current password" />
            <Field label="New Password" name="newPassword" placeholder="8–16 chars, uppercase, special char" />
            <Field label="Confirm New Password" name="confirmPassword" placeholder="Repeat your new password" />
            <div style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20 }}>
              🔒 Password: 8–16 chars, at least one uppercase letter and one special character.
            </div>
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '12px', background: loading ? 'rgba(108,99,255,0.5)' : 'linear-gradient(135deg, #6C63FF, #5048E5)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <><Spinner size={18} color="#fff" /><span>Updating...</span></> : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StoreOwnerChangePassword
