import { Star } from 'lucide-react'

// Star rating row (0–5). Filled stars use the brand-gold fill via CSS.
export default function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(rating) ? 'star is-on' : 'star'}
          strokeWidth={1.5}
        />
      ))}
    </span>
  )
}
