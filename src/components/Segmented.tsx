import { cn } from '../lib/cn'

export interface SegOption<T extends string> {
  value: T
  label: string
}

// Pill / segmented control.
export default function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
  ariaLabel,
}: {
  options: SegOption<T>[]
  value: T
  onChange: (v: T) => void
  size?: 'sm' | 'md'
  ariaLabel?: string
}) {
  return (
    <div className={cn('segmented', size === 'sm' && 'segmented--sm')} role="radiogroup" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn('segmented__opt', o.value === value && 'is-active')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
