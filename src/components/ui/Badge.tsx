import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export default function Badge({
  children,
  tone = 'brand',
  className,
}: {
  children: ReactNode
  tone?: 'brand' | 'ink' | 'neutral' | 'success'
  className?: string
}) {
  return <span className={cn('badge', `badge--${tone}`, className)}>{children}</span>
}
