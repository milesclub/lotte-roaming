import { Minus, Plus } from 'lucide-react'

// − value + stepper used in the Daily plan configurator.
export default function Stepper({
  value,
  onDec,
  onInc,
  canDec,
  canInc,
  ariaLabel,
}: {
  value: string
  onDec: () => void
  onInc: () => void
  canDec: boolean
  canInc: boolean
  ariaLabel: string
}) {
  return (
    <div className="stepper" role="group" aria-label={ariaLabel}>
      <button type="button" aria-label="decrease" disabled={!canDec} onClick={onDec} className="stepper__btn stepper__btn--minus">
        <Minus size={18} strokeWidth={2.6} />
      </button>
      <div className="stepper__value" aria-live="polite">
        {value}
      </div>
      <button type="button" aria-label="increase" disabled={!canInc} onClick={onInc} className="stepper__btn stepper__btn--plus">
        <Plus size={18} strokeWidth={2.6} />
      </button>
    </div>
  )
}
