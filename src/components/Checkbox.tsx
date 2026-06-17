import { Check } from 'lucide-react'
import { cn } from '../lib/cn'

// Square consent checkbox with a ✓ when checked.
export default function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button type="button" role="checkbox" aria-checked={checked} onClick={() => onChange(!checked)} className="checkbox">
      <span className={cn('checkbox__box', checked && 'is-on')} aria-hidden>
        {checked && <Check size={14} strokeWidth={3} />}
      </span>
      <span className="checkbox__label">{label}</span>
    </button>
  )
}
