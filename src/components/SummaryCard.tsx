import { getProduct } from '../lib/shop'
import { optionsSummary, planPriceText, priceText, receiveLabel } from '../lib/labels'
import { destinationDisplay, productName } from '../lib/localize'
import { useUI } from '../content'
import { useApplication } from '../store/application'
import type { ProductOptions, TravelDirection } from '../lib/domain'

// Application summary — destination, product, options, price. Reused as the
// sticky checkout aside and on confirm/complete. Destination follows direction.
export default function SummaryCard({
  productId,
  options,
  travel,
  direction,
  destinationCode,
}: {
  productId: string | null
  options: ProductOptions | null
  travel?: { start: string; end: string }
  direction?: TravelDirection
  destinationCode?: string | null
}) {
  const UI = useUI()
  const storeDirection = useApplication((s) => s.direction)
  const storeDestination = useApplication((s) => s.destinationCode)
  const dir = direction ?? storeDirection
  const dest = destinationCode ?? storeDestination
  const product = getProduct(productId)
  const place = destinationDisplay(dir, dest)

  return (
    <div className="summary">
      <div className="summary__head">{UI.complete.summaryTitle}</div>
      <dl className="summary__rows">
        <Row label={UI.confirm.destination}>
          <span className="browse-bar__korea">
            <span aria-hidden>{place.emoji}</span>
            {place.name}
          </span>
        </Row>
        <Row label={UI.confirm.product}>{product ? productName(product) : '—'}</Row>
        {options && <Row label={UI.confirm.options}>{optionsSummary(options)}</Row>}
        {options?.receiveMethod && (
          <Row label={UI.confirm.receive}>{receiveLabel(options.receiveMethod)}</Row>
        )}
        {travel?.start && travel?.end && (
          <Row label={UI.confirm.period}>
            {travel.start} ~ {travel.end}
          </Row>
        )}
      </dl>
      <div className="summary__total">
        <span className="summary__total-label">{UI.confirm.estimatedTotal}</span>
        <span className="summary__price">
          {product && options ? planPriceText(product, options.plan) : priceText(null)}
        </span>
      </div>
      <p className="summary__pricenote">{UI.product.priceNote}</p>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="summary__row">
      <dt className="summary__label">{label}</dt>
      <dd className="summary__value">{children}</dd>
    </div>
  )
}
