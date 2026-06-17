import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import AppRouter from './routes/AppRouter'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#16213E',
              color: '#E2E8F0',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '14px',
              padding: '12px 16px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            },
            success: { iconTheme: { primary: '#48BB78', secondary: '#16213E' } },
            error: { iconTheme: { primary: '#FC8181', secondary: '#16213E' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
