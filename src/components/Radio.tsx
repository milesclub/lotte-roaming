import { Check } from 'lucide-react'
import { cn } from '../lib/cn'

// Circular selection indicator used across selection cards.
export default function Radio({ checked }: { checked: boolean }) {
  return (
    <span className={cn('radio', checked && 'is-on')} aria-hidden>
      {checked && <Check size={13} strokeWidth={3.2} />}
    </span>
  )
}
