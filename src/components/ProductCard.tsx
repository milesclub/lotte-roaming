import { Link } from 'react-router-dom'
import { ChevronRight, CalendarDays, Database } from 'lucide-react'
import Badge from './ui/Badge'
import { useUI } from '../content'
import { cardPriceText } from '../lib/labels'
import { productName, productTagline } from '../lib/localize'
import type { Product } from '../lib/domain'

// Roaming product card — L.POINT-style white card with a leading icon tile and a
// red price.
export default function ProductCard({ product }: { product: Product }) {
  const UI = useUI()
  const Icon = product.kind === 'volume' ? Database : CalendarDays
  const specPrimary =
    product.kind === 'daily'
      ? UI.product.gbPerDay(product.dailyGb ?? 0)
      : UI.product.totalGb(product.totalGb ?? 0)
  const specSecondary =
    product.kind === 'daily'
      ? UI.product.daysUnit(product.defaultDays ?? 0)
      : `${UI.product.validity} ${UI.product.daysUnit(product.validityDays ?? 0)}`

  return (
    <Link
      to={`/roaming/${product.id}`}
      className={`product-card${product.recommended ? ' product-card--special' : ''}`}
    >
      <div className="product-card__top">
        <span className="product-card__icon">
          <Icon size={22} strokeWidth={2.2} />
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="product-card__badges">
            {product.badge && (
              <Badge tone={product.recommended ? 'brand' : 'neutral'}>{product.badge}</Badge>
            )}
            {product.simTypes.map((s) => (
              <span key={s} className="tag-pill">
                {UI.sim[s]}
              </span>
            ))}
          </div>
          <h3 className="product-card__title">{productName(product)}</h3>
          <p className="product-card__tagline">{productTagline(product)}</p>
        </div>
      </div>

      <div className="product-card__spec">
        <span className="product-card__spec-primary">{specPrimary}</span>
        <span className="product-card__spec-sep">·</span>
        <span className="product-card__spec-secondary">{specSecondary}</span>
      </div>

      <div className="product-card__foot">
        <div>
          <div className="product-card__pricenote">{UI.product.priceNote}</div>
          <div className="product-card__price">{cardPriceText(product)}</div>
        </div>
        <span className="product-card__cta">
          {UI.cta.viewDetail}
          <ChevronRight size={16} />
        </span>
      </div>
    </Link>
  )
}
