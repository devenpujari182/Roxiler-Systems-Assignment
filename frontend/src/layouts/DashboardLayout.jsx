import React from 'react'
import Sidebar from '../components/Sidebar'
import Topnav from '../components/Topnav'

const DashboardLayout = ({ children, title }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#07070f' }}>
      <Sidebar />
      <Topnav title={title} />
      <main style={{
        marginLeft: 260,
        minHeight: 'calc(100vh - 64px)',
        padding: '28px 28px',
        animation: 'fadeInPage 0.3s ease',
      }}>
        {children}
      </main>
      <style>{`
        @keyframes fadeInPage {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        :root { --sidebar-width: 260px; --bg-dark: #07070f; --text-primary: #f0f0ff; --text-secondary: #9090b0; --text-muted: #5a5a7a; --border: rgba(255,255,255,0.08); --danger: #FC8181; }
      `}</style>
    </div>
  )
}

export default DashboardLayout
