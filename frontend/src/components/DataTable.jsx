import React from 'react'
import Spinner from './Spinner'
import EmptyState from './EmptyState'

/**
 * DataTable - Reusable sortable table
 * 
 * columns: [{ key, label, sortable, render(value, row) }]
 * data: array of row objects
 * onSort(key, direction): called when a sortable column header is clicked
 * sortBy, sortOrder: current sort state
 * loading: show skeleton rows
 * onRowClick(row): called when a row is clicked
 */
const DataTable = ({
  columns = [],
  data = [],
  onSort,
  sortBy,
  sortOrder,
  loading = false,
  onRowClick,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search or filter criteria.',
}) => {
  const handleSort = (col) => {
    if (!col.sortable || !onSort) return
    const newOrder = sortBy === col.key && sortOrder === 'asc' ? 'desc' : 'asc'
    onSort(col.key, newOrder)
  }

  const getSortIcon = (col) => {
    if (!col.sortable) return null
    if (sortBy !== col.key) {
      return (
        <span style={{ color: 'var(--text-muted)', marginLeft: 4, fontSize: 11 }}>⇅</span>
      )
    }
    return (
      <span style={{ color: 'var(--primary-light)', marginLeft: 4, fontSize: 11 }}>
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    )
  }

  const SKELETON_ROWS = 5

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? 'sortable' : ''}
                onClick={() => handleSort(col)}
                style={{
                  color: sortBy === col.key ? 'var(--text-primary)' : undefined,
                  userSelect: col.sortable ? 'none' : 'auto',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {col.label}
                  {getSortIcon(col)}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            Array.from({ length: SKELETON_ROWS }).map((_, i) => (
              <tr key={`skeleton-${i}`} className="table-skeleton" style={{ cursor: 'default' }}>
                {columns.map((col) => (
                  <td key={col.key}>
                    <div
                      style={{
                        height: 14,
                        borderRadius: 4,
                        background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface-hover) 50%, var(--surface) 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                        width: `${60 + Math.random() * 30}%`,
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr style={{ cursor: 'default' }}>
              <td colSpan={columns.length}>
                <EmptyState title={emptyTitle} description={emptyDescription} />
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

export default DataTable
