import { DAILY_DATA_OPTIONS, type DataOption } from '../lib/shop'
import { useUI } from '../content'
import { cn } from '../lib/cn'

function tierLabel(o: DataOption, unlimitedWord: string): string {
  if (o.unlimited) return unlimitedWord
  return o.gbPerDay < 1 ? `${Math.round(o.gbPerDay * 1000)}MB` : `${o.gbPerDay}GB`
}

// Per-day data amount selector for daily plans (500MB … 무제한). Shared by the
// home builder and the product detail so the structure is identical everywhere.
export default function DataTierSelect({
  value,
  onChange,
  ariaLabel,
}: {
  value: string
  onChange: (id: string) => void
  ariaLabel?: string
}) {
  const UI = useUI()
  return (
    <div className="tier-opts" role="radiogroup" aria-label={ariaLabel}>
      {DAILY_DATA_OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn('tier-opt', value === o.id && 'is-active', o.unlimited && 'tier-opt--unlimited')}
        >
          {tierLabel(o, UI.product.unlimited)}
        </button>
      ))}
    </div>
  )
}
