import { Check } from 'lucide-react'

// Red ✓ bullet line used in plan detail feature lists.
export default function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="bullet">
      <span className="bullet__icon">
        <Check size={11} strokeWidth={3} />
      </span>
      <span>{children}</span>
    </div>
  )
}
