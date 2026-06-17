import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

// Centered responsive content column.
export default function Container({
  children,
  size = 'default',
  className,
}: {
  children: ReactNode
  size?: 'default' | 'narrow' | 'wide'
  className?: string
}) {
  return (
    <div className={cn('container', size !== 'default' && `container--${size}`, className)}>
      {children}
    </div>
  )
}
