import React from 'react'

/**
 * FilterBar - renders a row of select filter dropdowns
 * 
 * @param {Array} filters - Array of { label, key, options: [{label, value}] }
 * @param {Object} values - Current filter values { [key]: value }
 * @param {Function} onChange - Called with (key, value) when a filter changes
 */
const FilterBar = ({ filters = [], values = {}, onChange }) => {
  if (!filters || filters.length === 0) return null

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        alignItems: 'flex-end',
      }}
    >
      {filters.map((filter) => (
        <div key={filter.key} style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 150 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {filter.label}
          </label>
          <select
            className="form-select"
            value={values[filter.key] || ''}
            onChange={(e) => onChange(filter.key, e.target.value)}
            style={{ padding: '10px 40px 10px 14px', fontSize: 14 }}
          >
            <option value="">All</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}

export default FilterBar
