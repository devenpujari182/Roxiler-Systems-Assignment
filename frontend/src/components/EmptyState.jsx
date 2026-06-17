import React from 'react'

const EmptyState = ({
  icon,
  title = 'No data found',
  description = 'There is nothing to display here yet.',
  action,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        textAlign: 'center',
        animation: 'fadeIn 0.4s ease',
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'rgba(108, 99, 255, 0.1)',
          border: '1px solid rgba(108, 99, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          marginBottom: 20,
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        {icon || (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 13C20 17.418 16.418 21 12 21C7.582 21 4 17.418 4 13C4 8.582 7.582 5 12 5C16.418 5 20 8.582 20 13Z"
              stroke="#6C63FF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12 5V3M12 21V23M4 13H2M22 13H20"
              stroke="#6C63FF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12 13C12 13 10 11 10 9.5C10 8.12 10.895 7 12 7C13.105 7 14 8.12 14 9.5C14 11 12 13 12 13Z"
              fill="#6C63FF"
              fillOpacity="0.5"
            />
          </svg>
        )}
      </div>

      <h3
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 8,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          maxWidth: 320,
          lineHeight: 1.6,
          marginBottom: action ? 24 : 0,
        }}
      >
        {description}
      </p>

      {action && action}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default EmptyState
