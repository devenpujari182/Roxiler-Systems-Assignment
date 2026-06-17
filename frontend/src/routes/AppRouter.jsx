import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'

// Auth pages
import Login    from '../pages/Login'
import Register from '../pages/Register'

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard'
import UsersList      from '../pages/admin/UsersList'
import UserDetails    from '../pages/admin/UserDetails'
import StoresList     from '../pages/admin/StoresList'
import AddUser        from '../pages/admin/AddUser'
import AddStore       from '../pages/admin/AddStore'

// User pages
import UserDashboard       from '../pages/user/Dashboard'
import StoreList           from '../pages/user/StoreList'
import UserChangePassword  from '../pages/user/ChangePassword'

// Store Owner pages
import StoreOwnerDashboard      from '../pages/storeOwner/Dashboard'
import StoreOwnerChangePassword from '../pages/storeOwner/ChangePassword'

const NotFound = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#07070f', textAlign: 'center', padding: 24 }}>
    <div style={{ fontSize: 80, fontWeight: 900, background: 'linear-gradient(135deg, #6C63FF, #48BB78)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 16 }}>
      404
    </div>
    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Page Not Found</h1>
    <p style={{ color: '#9090b0', marginBottom: 28, maxWidth: 360 }}>The page you're looking for doesn't exist or has been moved.</p>
    <a href="/login" style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #6C63FF, #5048E5)', borderRadius: 10, color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
      Go to Login
    </a>
  </div>
)

const Unauthorized = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#07070f', textAlign: 'center', padding: 24 }}>
    <div style={{ fontSize: 80, fontWeight: 900, background: 'linear-gradient(135deg, #FC8181, #F6AD55)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 16 }}>
      403
    </div>
    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Access Denied</h1>
    <p style={{ color: '#9090b0', marginBottom: 28, maxWidth: 360 }}>You don't have permission to access this page.</p>
    <a href="/login" style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #FC8181, #F6AD55)', borderRadius: 10, color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
      Back to Login
    </a>
  </div>
)

const AppRouter = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route path="/login"        element={<Login />} />
      <Route path="/register"     element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users"     element={<ProtectedRoute allowedRoles={['ADMIN']}><UsersList /></ProtectedRoute>} />
      <Route path="/admin/users/:id" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserDetails /></ProtectedRoute>} />
      <Route path="/admin/stores"    element={<ProtectedRoute allowedRoles={['ADMIN']}><StoresList /></ProtectedRoute>} />
      <Route path="/admin/add-user"  element={<ProtectedRoute allowedRoles={['ADMIN']}><AddUser /></ProtectedRoute>} />
      <Route path="/admin/add-store" element={<ProtectedRoute allowedRoles={['ADMIN']}><AddStore /></ProtectedRoute>} />
      <Route path="/admin/change-password" element={<ProtectedRoute allowedRoles={['ADMIN']}><UserChangePassword /></ProtectedRoute>} />

      {/* User routes */}
      <Route path="/user/dashboard"       element={<ProtectedRoute allowedRoles={['USER']}><UserDashboard /></ProtectedRoute>} />
      <Route path="/stores"               element={<ProtectedRoute allowedRoles={['USER']}><StoreList /></ProtectedRoute>} />
      <Route path="/user/change-password" element={<ProtectedRoute allowedRoles={['USER']}><UserChangePassword /></ProtectedRoute>} />

      {/* Store Owner routes */}
      <Route path="/store-owner/dashboard"       element={<ProtectedRoute allowedRoles={['STORE_OWNER']}><StoreOwnerDashboard /></ProtectedRoute>} />
      <Route path="/store-owner/change-password" element={<ProtectedRoute allowedRoles={['STORE_OWNER']}><StoreOwnerChangePassword /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
