import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

// L.POINT-style surface: white, rounded, soft shadow. `lg` adds desktop padding.
export default function Card({
  children,
  className,
  lg,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  lg?: boolean
  as?: 'div' | 'section' | 'article'
}) {
  return <Tag className={cn('card', lg && 'card--pad-lg', className)}>{children}</Tag>
}
