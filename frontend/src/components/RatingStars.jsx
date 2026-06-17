import React from 'react'

/**
 * StarRating - displays filled/empty stars
 * @param {number} value - current rating (1-5)
 * @param {boolean} interactive - if true, clicking changes value
 * @param {function} onChange - called with new value when interactive
 * @param {number} size - star size in px
 */
const StarRating = ({ value = 0, interactive = false, onChange, size = 18 }) => {
  const [hovered, setHovered] = React.useState(0)

  const display = hovered || value

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => interactive && onChange && onChange(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          style={{
            fontSize: size,
            cursor: interactive ? 'pointer' : 'default',
            color: star <= display ? '#FFD060' : 'rgba(255,255,255,0.15)',
            transition: 'all 0.15s ease',
            transform: interactive && star <= display ? 'scale(1.15)' : 'scale(1)',
            display: 'inline-block',
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
      {value > 0 && (
        <span style={{ fontSize: 12, color: '#FFD060', fontWeight: 700, marginLeft: 4 }}>
          {parseFloat(value).toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default StarRating
