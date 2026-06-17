import { Check } from 'lucide-react'
import { useUI } from '../../content'

// Horizontal checkout step indicator.
export default function StepNav({ step }: { step: number }) {
  const UI = useUI()
  const steps = UI.steps
  return (
    <ol className="stepnav">
      {steps.map((label, i) => {
        const state = i < step ? 'done' : i === step ? 'active' : 'pending'
        return (
          <li key={label} className="stepnav__item">
            <span className={`stepnav__num stepnav__num--${state}`}>
              {state === 'done' ? <Check size={14} strokeWidth={3} /> : i + 1}
            </span>
            <span className={`stepnav__label stepnav__label--${state}`}>{label}</span>
            {i < steps.length - 1 && (
              <span className={`stepnav__line${i < step ? ' stepnav__line--done' : ''}`} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
