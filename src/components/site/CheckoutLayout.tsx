import type { ReactNode } from 'react'
import Container from './Container'
import StepNav from './StepNav'

// Apply-funnel layout. Desktop: two-column grid (inputs left, sticky summary
// right). Mobile: single column, summary stacks beneath.
export default function CheckoutLayout({
  step,
  title,
  subtitle,
  children,
  aside,
}: {
  step?: number
  title: string
  subtitle?: string
  children: ReactNode
  aside?: ReactNode
}) {
  return (
    <div className="checkout">
      <Container>
        {typeof step === 'number' && (
          <div className="checkout__steps">
            <StepNav step={step} />
          </div>
        )}

        <div className="checkout__grid">
          <div>
            <div className="checkout__card">
              <h1 className="checkout__title">{title}</h1>
              {subtitle && <p className="checkout__sub">{subtitle}</p>}
              <div className="checkout__body">{children}</div>
            </div>
          </div>

          {aside && (
            <aside>
              <div className="checkout__aside-inner">{aside}</div>
            </aside>
          )}
        </div>
      </Container>
    </div>
  )
}
