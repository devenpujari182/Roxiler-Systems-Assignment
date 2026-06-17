import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from '../layouts/AuthLayout'
import { register as registerService } from '../services/authService'
import Spinner from '../components/Spinner'

const inputStyle = (hasError) => ({
  width: '100%', padding: '10px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: `1px solid ${hasError ? '#FC8181' : 'rgba(255,255,255,0.1)'}`,
  borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', transition: 'all 0.2s',
})

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' })
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
    else if (form.password.length < 8 || form.password.length > 16) errs.password = 'Password must be 8–16 characters'
    else if (!/[A-Z]/.test(form.password)) errs.password = 'Must include at least one uppercase letter'
    else if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\\/`~;']/.test(form.password)) errs.password = 'Must include at least one special character'
    if (form.address && form.address.length > 400) errs.address = 'Address too long (max 400 chars)'
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
      await registerService(form)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ label, name, type = 'text', placeholder, required = true }) => (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
        {label} {required && <span style={{ color: '#6C63FF' }}>*</span>}
      </label>
      {name === 'address' ? (
        <textarea
          name={name} value={form[name]} onChange={handleChange}
          placeholder={placeholder} rows={2}
          style={{ ...inputStyle(!!errors[name]), resize: 'vertical', fontFamily: 'inherit' }}
          onFocus={e => { e.target.style.borderColor = '#6C63FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)' }}
          onBlur={e => { e.target.style.borderColor = errors[name] ? '#FC8181' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
        />
      ) : (
        <input
          type={type} name={name} value={form[name]} onChange={handleChange}
          placeholder={placeholder} autoComplete={name}
          style={inputStyle(!!errors[name])}
          onFocus={e => { e.target.style.borderColor = '#6C63FF'; e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)' }}
          onBlur={e => { e.target.style.borderColor = errors[name] ? '#FC8181' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
        />
      )}
      {errors[name] && <p style={{ fontSize: 12, color: '#FC8181', marginTop: 4 }}>⚠ {errors[name]}</p>}
    </div>
  )

  return (
    <AuthLayout>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Create account</h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>Join StoreRate and start rating stores</p>

      {errors.general && (
        <div style={{ padding: '10px 14px', background: 'rgba(252,129,129,0.1)', border: '1px solid rgba(252,129,129,0.3)', borderRadius: 10, color: '#FC8181', fontSize: 13, marginBottom: 16 }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Full Name" name="name" placeholder="Min 20 characters required" />
        <Field label="Email Address" name="email" type="email" placeholder="you@example.com" />
        <Field label="Password" name="password" type="password" placeholder="8–16 chars, uppercase, special char" />
        <Field label="Address" name="address" placeholder="Your address (optional)" required={false} />

        <div style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
          🔒 Password must be 8–16 characters with at least one uppercase letter and one special character.
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
        >
          {loading ? <><Spinner size={18} color="#fff" /><span>Creating account...</span></> : 'Create Account'}
        </button>
      </form>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '22px 0' }} />
      <p style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--text-secondary)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#8B85FF', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
      </p>
    </AuthLayout>
  )
}

export default Register
