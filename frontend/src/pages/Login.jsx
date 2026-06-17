import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from '../layouts/AuthLayout'
import { login as loginService } from '../services/authService'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/Spinner'

const inputStyle = (hasError) => ({
  width: '100%', padding: '11px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${hasError ? '#FC8181' : 'rgba(255,255,255,0.1)'}`,
  borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none',
  transition: 'all 0.2s',
  boxShadow: hasError ? '0 0 0 3px rgba(252,129,129,0.15)' : 'none',
})

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
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
      const res = await loginService(form)
      const { user, token } = res.data.data
      login(user, token)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`)
      if (user.role === 'ADMIN') navigate('/admin/dashboard')
      else if (user.role === 'STORE_OWNER') navigate('/store-owner/dashboard')
      else navigate('/stores')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
        Welcome back 👋
      </h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
        Sign in to your account to continue
      </p>

      {errors.general && (
        <div style={{ padding: '10px 14px', background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.3)', borderRadius: 10, color: '#FC8181', fontSize: 13, marginBottom: 16 }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            Email Address
          </label>
          <input
            type="email" name="email" value={form.email} onChange={handleChange}
            placeholder="you@example.com" autoComplete="email" autoFocus
            style={inputStyle(!!errors.email)}
            onFocus={e => { e.target.style.borderColor = '#6C63FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)' }}
            onBlur={e => { e.target.style.borderColor = errors.email ? '#FC8181' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = errors.email ? '0 0 0 3px rgba(252,129,129,0.15)' : 'none' }}
          />
          {errors.email && <p style={{ fontSize: 12, color: '#FC8181', marginTop: 4 }}>⚠ {errors.email}</p>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            Password
          </label>
          <input
            type="password" name="password" value={form.password} onChange={handleChange}
            placeholder="Enter your password" autoComplete="current-password"
            style={inputStyle(!!errors.password)}
            onFocus={e => { e.target.style.borderColor = '#6C63FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)' }}
            onBlur={e => { e.target.style.borderColor = errors.password ? '#FC8181' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = errors.password ? '0 0 0 3px rgba(252,129,129,0.15)' : 'none' }}
          />
          {errors.password && <p style={{ fontSize: 12, color: '#FC8181', marginTop: 4 }}>⚠ {errors.password}</p>}
        </div>

        <button
          type="submit" disabled={loading}
          style={{
            width: '100%', padding: '12px', marginTop: 4,
            background: loading ? 'rgba(108,99,255,0.5)' : 'linear-gradient(135deg, #6C63FF, #5048E5)',
            border: 'none', borderRadius: 10, color: '#fff',
            fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 16px rgba(108,99,255,0.4)', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          {loading ? <><Spinner size={18} color="#fff" /><span>Signing in...</span></> : 'Sign In'}
        </button>
      </form>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '24px 0' }} />

      <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--text-secondary)' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#8B85FF', fontWeight: 600, textDecoration: 'none' }}>
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Login
