import React from 'react'

/**
 * Pagination component
 * @param {number} page - current page (1-indexed)
 * @param {number} totalPages
 * @param {number} total - total record count
 * @param {number} limit
 * @param {function} onPageChange - called with new page number
 */
const Pagination = ({ page, totalPages, total, limit, onPageChange }) => {
  if (totalPages <= 1) return null

  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  // Build page numbers array (show 5 pages around current)
  const pages = []
  const range = 2
  for (let i = Math.max(1, page - range); i <= Math.min(totalPages, page + range); i++) {
    pages.push(i)
  }

  const btnStyle = (active, disabled) => ({
    width: 34, height: 34,
    borderRadius: 8,
    border: active ? 'none' : '1px solid rgba(255,255,255,0.08)',
    background: active
      ? 'linear-gradient(135deg, #6C63FF, #5048E5)'
      : disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
    color: active ? '#fff' : disabled ? 'rgba(255,255,255,0.2)' : 'var(--text-secondary)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: 13, fontWeight: 600,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s ease',
    boxShadow: active ? '0 4px 12px rgba(108,99,255,0.35)' : 'none',
  })

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 20px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      flexWrap: 'wrap', gap: 12,
    }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
        Showing <strong style={{ color: 'var(--text-primary)' }}>{start}–{end}</strong> of{' '}
        <strong style={{ color: 'var(--text-primary)' }}>{total}</strong> results
      </span>

      <div style={{ display: 'flex', gap: 6 }}>
        <button
          style={btnStyle(false, page === 1)}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          title="Previous"
        >
          ‹
        </button>

        {pages[0] > 1 && (
          <>
            <button style={btnStyle(false, false)} onClick={() => onPageChange(1)}>1</button>
            {pages[0] > 2 && <span style={{ lineHeight: '34px', color: 'var(--text-muted)', fontSize: 13 }}>…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            style={btnStyle(p === page, false)}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span style={{ lineHeight: '34px', color: 'var(--text-muted)', fontSize: 13 }}>…</span>
            )}
            <button style={btnStyle(false, false)} onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}

        <button
          style={btnStyle(false, page === totalPages)}
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          title="Next"
        >
          ›
        </button>
      </div>
    </div>
  )
}

export default Pagination
