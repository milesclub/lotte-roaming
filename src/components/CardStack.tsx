import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '../lib/cn'

const THRESHOLD = 64

// Swipeable deck. The front card is drag/swipe/tap interactive; releasing past
// the threshold shuffles to the next (or previous) card. Dependency-free.
export default function CardStack({
  children,
  className,
  ariaLabel,
}: {
  children: ReactNode[]
  className?: string
  ariaLabel?: string
}) {
  const cards = children.filter(Boolean)
  const n = cards.length
  const [top, setTop] = useState(0)
  const [dragX, setDragX] = useState(0)
  const drag = useRef({ active: false, startX: 0, moved: false })

  const advance = (dir: 1 | -1) => {
    setTop((t) => (t + (dir === 1 ? 1 : n - 1)) % n)
    setDragX(0)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, startX: e.clientX, moved: false }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    setDragX(dx)
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag.current.active) return
    drag.current.active = false
    try {
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
    if (!drag.current.moved) advance(1) // tap → next
    else if (dragX < -THRESHOLD) advance(1)
    else if (dragX > THRESHOLD) advance(-1)
    else setDragX(0)
  }

  return (
    <div className={cn('cardstack', className)} aria-label={ariaLabel}>
      <div className="cardstack__deck">
        {cards.map((child, i) => {
          const pos = (i - top + n) % n
          const isFront = pos === 0
          const style: CSSProperties = isFront
            ? {
                transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`,
                zIndex: n,
                transition: drag.current.active ? 'none' : 'transform 0.34s cubic-bezier(0.22,0.61,0.36,1)',
                cursor: 'grab',
              }
            : {
                // fan the deck — each card behind peeks out and tilts (kept
                // small so the rotated cards stay inside the deck on mobile)
                transform: `translateX(${pos * 6}px) translateY(${pos * 8}px) rotate(${pos * 2}deg) scale(${1 - pos * 0.05})`,
                zIndex: n - pos,
                opacity: pos < 3 ? 1 : 0,
                pointerEvents: 'none',
                transition: 'transform 0.34s cubic-bezier(0.22,0.61,0.36,1), opacity 0.34s ease',
              }
          return (
            <div
              key={i}
              className={cn('cardstack__card', isFront && 'is-front')}
              style={style}
              {...(isFront
                ? {
                    onPointerDown,
                    onPointerMove,
                    onPointerUp,
                    onPointerCancel: onPointerUp,
                  }
                : {})}
            >
              {child}
            </div>
          )
        })}
      </div>

      <div className="cardstack__controls">
        <span className="cardstack__count">
          {top + 1} / {n}
        </span>
        <div className="cardstack__dots">
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              className={cn('cardstack__dot', i === top && 'is-active')}
              aria-label={`Card ${i + 1}`}
              onClick={() => {
                setTop(i)
                setDragX(0)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
