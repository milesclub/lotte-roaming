import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import Radio from './Radio'

// A selectable card with a red ring + tint + radio when active.
export default function SelectCard({
  selected,
  onSelect,
  badge,
  badgeTone = 'brand',
  radioSide = 'right',
  children,
  className,
}: {
  selected: boolean
  onSelect: () => void
  badge?: string
  badgeTone?: 'brand' | 'ink'
  radioSide?: 'left' | 'right'
  children: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn('select-card', selected && 'is-selected', className)}
    >
      {badge && (
        <span className={cn('select-card__badge', badgeTone === 'ink' && 'select-card__badge--ink')}>
          {badge}
        </span>
      )}
      <div className="select-card__row">
        {radioSide === 'left' && <Radio checked={selected} />}
        <div className="select-card__body">{children}</div>
        {radioSide === 'right' && <Radio checked={selected} />}
      </div>
    </button>
  )
}
