import logoUrl from '../assets/logo.svg'
import { cn } from '../lib/cn'

// LOTTE ROAMING brand mark (the superellipse "L"). Same asset as the favicon.
export default function Logo({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <img
      src={logoUrl}
      width={size}
      height={size}
      alt=""
      aria-hidden
      className={cn('logo', className)}
      style={{ width: size, height: size }}
    />
  )
}
