import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

// Reusable bottom sheet (L.POINT-style). Slides up over a dimmed backdrop;
// closes on backdrop click, the close button, or Escape. Locks body scroll
// while open.
export default function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  // Portal to <body> so the fixed positioning is relative to the viewport,
  // never to a transformed ancestor (e.g. the route-fade wrapper).
  return createPortal(
    <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
      <div className="sheet__backdrop" onClick={onClose} />
      <div className="sheet__panel">
        <div className="sheet__handle" aria-hidden />
        <div className="sheet__head">
          <h3 className="sheet__title">{title}</h3>
          <button type="button" className="sheet__close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="sheet__body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
