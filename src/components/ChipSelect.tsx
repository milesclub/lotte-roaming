import { cn } from '../lib/cn'

export interface ChipOption {
  value: string
  label: string
  highlight?: boolean // e.g. "unlimited" — rendered as a solid brand chip
}

// Generic wrapping pill selector (per-day data tiers, volume GB, etc.).
export default function ChipSelect({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string
  onChange: (v: string) => void
  options: ChipOption[]
  ariaLabel?: string
}) {
  return (
    <div className="tier-opts" role="radiogroup" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn('tier-opt', value === o.value && 'is-active', o.highlight && 'tier-opt--unlimited')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
