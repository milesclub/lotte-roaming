import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../lib/cn'

// Lightweight, dependency-free swipe carousel. Native touch scroll-snap on
// mobile; mouse drag-to-scroll + arrows on desktop; pagination dots throughout.
export default function Carousel({
  children,
  className,
  ariaLabel,
}: {
  children: ReactNode[]
  className?: string
  ariaLabel?: string
}) {
  const items = children.filter(Boolean)
  const viewport = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [edges, setEdges] = useState({ prev: false, next: true })
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false })
  const suppressClick = useRef(false)

  const step = useCallback(() => {
    const el = viewport.current
    if (!el || el.children.length < 1) return el?.clientWidth ?? 0
    const a = el.children[0] as HTMLElement
    const b = el.children[1] as HTMLElement | undefined
    return b ? b.offsetLeft - a.offsetLeft : a.getBoundingClientRect().width
  }, [])

  const sync = useCallback(() => {
    const el = viewport.current
    if (!el) return
    const { scrollLeft, clientWidth, scrollWidth } = el
    setEdges({ prev: scrollLeft > 4, next: scrollLeft + clientWidth < scrollWidth - 4 })
    setActive(Math.round(scrollLeft / Math.max(step(), 1)))
  }, [step])

  useEffect(() => {
    sync()
    const el = viewport.current
    if (!el) return
    const onResize = () => sync()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [sync])

  const go = (dir: 1 | -1) => {
    viewport.current?.scrollBy({ left: dir * step(), behavior: 'smooth' })
  }
  const goTo = (i: number) => {
    viewport.current?.scrollTo({ left: i * step(), behavior: 'smooth' })
  }

  // Mouse / pen drag-to-scroll (touch uses native scroll).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return
    const el = viewport.current
    if (!el) return
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false }
    el.setPointerCapture(e.pointerId)
    el.style.scrollSnapType = 'none'
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const el = viewport.current
    if (!el || !drag.current.active) return
    const dx = e.clientX - drag.current.startX
    if (Math.abs(dx) > 4) drag.current.moved = true
    el.scrollLeft = drag.current.startLeft - dx
  }
  const endDrag = (e: React.PointerEvent) => {
    const el = viewport.current
    if (!el || !drag.current.active) return
    drag.current.active = false
    if (drag.current.moved) {
      suppressClick.current = true
      setTimeout(() => (suppressClick.current = false), 0)
    }
    el.style.scrollSnapType = ''
    try {
      el.releasePointerCapture(e.pointerId)
    } catch {
      /* capture may already be released */
    }
    sync()
  }
  // Swallow the click that ends a drag so cards don't navigate on drag-release.
  const onClickCapture = (e: React.MouseEvent) => {
    if (suppressClick.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <div className={cn('carousel', className)}>
      <button
        type="button"
        className="carousel__nav carousel__nav--prev"
        aria-label="Previous"
        disabled={!edges.prev}
        onClick={() => go(-1)}
      >
        <ChevronLeft size={20} />
      </button>

      <div
        ref={viewport}
        className="carousel__viewport"
        role="group"
        aria-label={ariaLabel}
        onScroll={sync}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {items.map((child, i) => (
          <div className="carousel__item" key={i}>
            {child}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="carousel__nav carousel__nav--next"
        aria-label="Next"
        disabled={!edges.next}
        onClick={() => go(1)}
      >
        <ChevronRight size={20} />
      </button>

      {items.length > 1 && (
        <div className="carousel__dots" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              className={cn('carousel__dot', i === active && 'is-active')}
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={i === active}
              role="tab"
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
