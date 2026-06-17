import { cn } from '../lib/cn'

// Placeholder brand mark — a tokenized red "L" tile. Swap for the real
// LOTTE / L.POINT asset later.
export default function Logo({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn('logo', className)}
      style={{ width: size, height: size, fontSize: size * 0.46 }}
      aria-hidden
    >
      L
    </div>
  )
}
