import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  full?: boolean
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  full,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={cn('btn', `btn--${variant}`, full && 'btn--full', className)} {...rest}>
      {children}
    </button>
  )
}
