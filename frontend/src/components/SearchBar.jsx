import React, { useState } from 'react'
import useDebounce from '../hooks/useDebounce'

const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  initialValue = '',
  style = {},
}) => {
  const [inputValue, setInputValue] = useState(initialValue)
  const debouncedValue = useDebounce(inputValue, 500)

  React.useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue])

  return (
    <div style={{ position: 'relative', minWidth: 240, ...style }}>
      <span
        style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          fontSize: 15,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <input
        type="text"
        className="form-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        style={{
          paddingLeft: 40,
          paddingRight: inputValue ? 36 : 16,
        }}
      />
      {inputValue && (
        <button
          onClick={() => setInputValue('')}
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: 16,
            lineHeight: 1,
            padding: '2px 4px',
          }}
          title="Clear search"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default SearchBar
