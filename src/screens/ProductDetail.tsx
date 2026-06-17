import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Info, ChevronLeft } from 'lucide-react'
import Container from '../components/site/Container'
import Button from '../components/Button'
import Segmented from '../components/Segmented'
import Stepper from '../components/Stepper'
import DataTierSelect from '../components/DataTierSelect'
import ChipSelect from '../components/ChipSelect'
import BenefitIcon from '../components/ui/BenefitIcon'
import HeroSlideshow from '../components/HeroSlideshow'
import { heroSlidesFor } from '../lib/images'
import { useUI } from '../content'
import {
  benefitsFor,
  dataIdFor,
  dataOption,
  getDestination,
  getDestinations,
  getProduct,
  noticesFor,
  VALIDITY_OPTIONS,
  VOLUME_GB_OPTIONS,
} from '../lib/shop'
import { dailyDataText, planPriceText } from '../lib/labels'
import { benefitDesc, benefitTitle, noticeText } from '../lib/localize'
import type { Product } from '../lib/domain'
import { useApplication } from '../store/application'
import { useAuth } from '../store/auth'
import type { ProductKind } from '../lib/domain'

export default function ProductDetail() {
  const UI = useUI()
  const { productId } = useParams()
  const navigate = useNavigate()
  const product = getProduct(productId)
  const selectProduct = useApplication((s) => s.selectProduct)
  const options = useApplication((s) => s.options)
  const direction = useApplication((s) => s.direction)
  const destinationCode = useApplication((s) => s.destinationCode)
  const setSimType = useApplication((s) => s.setSimType)
  const setNetwork = useApplication((s) => s.setNetwork)
  const setPlan = useApplication((s) => s.setPlan)
  const user = useAuth((s) => s.user)

  useEffect(() => {
    if (product) selectProduct(product.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id])

  if (!product) return <Navigate to="/" replace />
  if (!options) return null

  // Country-centric: the page is one destination; daily/volume is just a toggle
  // that swaps to the sibling product of the other kind for the same country.
  // Resolve the country to show (prefer the chosen destination, else derive it
  // from the product's coverage so the flag is always right — even on top-up).
  const { place, code } = resolvePlace(product, direction, destinationCode, UI.browse.koreaName, UI.product.coverageGlobal)
  // Landmark slideshow behind the country header — region's representative spots.
  const region =
    direction === 'inbound'
      ? 'korea'
      : getDestination(code)?.regionId ??
        (product.coverage !== 'global' ? product.coverage[0] : undefined)
  const slides = heroSlidesFor(direction, region)
  // Daily/volume is a plan-type toggle on the same product (no navigation).
  const switchKind = (kind: ProductKind) => {
    if (kind === options.plan.type) return
    if (kind === 'volume') {
      setPlan({ type: 'volume', totalGb: product.totalGb, validityDays: product.validityDays })
    } else {
      setPlan({ type: 'daily', gbPerDay: product.dailyGb, days: product.defaultDays })
    }
  }

  // Purchase needs login: go straight to details if signed in, else sign in first.
  const apply = () => navigate(user ? '/apply/info' : '/signin?next=/apply/info')
  const benefits = benefitsFor(product)
  const notices = noticesFor(product)
  const days = options.plan.days ?? product.defaultDays ?? 1

  const optionsPanel = (
    <div className="options-card">
      <div className="field-block">
        <div className="field-block__label">{UI.builder.step2}</div>
        <Segmented
          ariaLabel={UI.builder.step2}
          options={[
            { value: 'daily', label: UI.builder.daily },
            { value: 'volume', label: UI.builder.volume },
          ]}
          value={options.plan.type}
          onChange={(v) => switchKind(v as ProductKind)}
        />
        <p className="opt-desc">
          {options.plan.type === 'volume' ? UI.builder.volumeDesc : UI.builder.dailyDesc}
        </p>
      </div>

      <div className="field-block">
        <div className="field-block__label">{UI.product.sim}</div>
        <Segmented
          ariaLabel={UI.product.sim}
          options={product.simTypes.map((s) => ({ value: s, label: UI.sim[s] }))}
          value={options.simType}
          onChange={(v) => setSimType(v)}
        />
        <p className="opt-desc">{options.simType === 'esim' ? UI.sim.esimDesc : UI.sim.usimDesc}</p>
      </div>

      {product.networks.length > 1 && (
        <div className="field-block">
          <div className="field-block__label">{UI.product.network}</div>
          <Segmented
            ariaLabel={UI.product.network}
            options={product.networks.map((n) => ({ value: n, label: UI.network[n] }))}
            value={options.network}
            onChange={(v) => setNetwork(v)}
          />
        </div>
      )}

      {options.plan.type === 'daily' ? (
        <>
          <div className="field-block">
            <div className="field-block__label">{UI.product.perDay}</div>
            <DataTierSelect
              ariaLabel={UI.product.perDay}
              value={dataIdFor(options.plan.gbPerDay, options.plan.unlimited)}
              onChange={(id) => {
                const o = dataOption(id)
                setPlan({
                  type: 'daily',
                  gbPerDay: o.unlimited ? 0 : o.gbPerDay,
                  unlimited: o.unlimited,
                  days: options.plan.days ?? product.defaultDays ?? 1,
                })
              }}
            />
          </div>
          <div className="field-block">
            <div className="field-block__label">{UI.product.days}</div>
            <Stepper
              ariaLabel={UI.product.days}
              value={UI.product.daysUnit(days)}
              canDec={days > 1}
              canInc={days < 30}
              onDec={() => setPlan({ ...options.plan, type: 'daily', days: days - 1 })}
              onInc={() => setPlan({ ...options.plan, type: 'daily', days: days + 1 })}
            />
          </div>
        </>
      ) : (
        <>
          <div className="field-block">
            <div className="field-block__label">{UI.product.total}</div>
            <ChipSelect
              ariaLabel={UI.product.total}
              options={VOLUME_GB_OPTIONS.map((g) => ({ value: String(g), label: `${g}GB` }))}
              value={String(options.plan.type === 'volume' ? options.plan.totalGb : product.totalGb ?? 30)}
              onChange={(v) =>
                setPlan({
                  type: 'volume',
                  totalGb: Number(v),
                  validityDays:
                    (options.plan.type === 'volume' ? options.plan.validityDays : undefined) ??
                    product.validityDays ??
                    30,
                })
              }
            />
          </div>
          <div className="field-block">
            <div className="field-block__label">{UI.product.validity}</div>
            <Segmented
              ariaLabel={UI.product.validity}
              options={VALIDITY_OPTIONS.map((d) => ({ value: String(d), label: UI.product.daysUnit(d) }))}
              value={String(options.plan.type === 'volume' ? options.plan.validityDays : product.validityDays ?? 30)}
              onChange={(v) =>
                setPlan({
                  type: 'volume',
                  totalGb:
                    (options.plan.type === 'volume' ? options.plan.totalGb : undefined) ??
                    product.totalGb ??
                    30,
                  validityDays: Number(v),
                })
              }
            />
          </div>
        </>
      )}

      <div className="pd__price-row">
        <span className="pd__price-label">{UI.confirm.product}</span>
        <span className="pd__price">{planPriceText(product, options.plan)}</span>
      </div>
      <p className="pd__pricenote">{UI.product.priceNote}</p>

      <Button full className="pd__apply-desktop" onClick={apply}>
        {UI.cta.apply}
      </Button>
    </div>
  )

  return (
    <div className="pd">
      <Container className="pd__pad">
        <button type="button" onClick={() => navigate(-1)} className="pd__back">
          <ChevronLeft size={18} strokeWidth={2.4} />
          {UI.cta.back}
        </button>

        <div className="pd__grid">
          {/* Left: info — country-forward header */}
          <div>
            <div className="pd__country">
              <HeroSlideshow className="pd__country-bg" images={slides} />
              <span className="pd__country-scrim" aria-hidden />
              <div className="pd__country-content">
                <span className="pd__country-tag">{UI.brand.name}</span>
                <h1 className="pd__title">
                  <span className="pd__flag" aria-hidden>
                    {place.emoji}
                  </span>
                  {place.name}
                </h1>
              </div>
            </div>
            {/* <p className="pd__tagline">{productTagline(product)}</p> */}

            <div className="spec-row">
              <Spec
                label={options.plan.type === 'daily' ? UI.product.perDay : UI.product.total}
                value={
                  options.plan.type === 'daily'
                    ? dailyDataText(options.plan)
                    : `${options.plan.totalGb ?? product.totalGb}GB`
                }
              />
              <Spec
                label={options.plan.type === 'daily' ? UI.product.days : UI.product.validity}
                value={UI.product.daysUnit(
                  options.plan.type === 'daily' ? days : options.plan.validityDays ?? 0,
                )}
              />
              <Spec label={UI.product.sim} value={product.simTypes.map((s) => UI.sim[s]).join(' · ')} />
            </div>

            <h2 className="pd__h2">{UI.product.benefitsTitle}</h2>
            <div className="benefit-cards">
              {benefits.map((b) => (
                <div key={b.id} className="benefit-card">
                  <span className="benefit-card__icon">
                    <BenefitIcon icon={b.icon} size={19} />
                  </span>
                  <div>
                    <div className="benefit-card__title">{benefitTitle(b)}</div>
                    <div className="benefit-card__desc">{benefitDesc(b)}</div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="pd__h2">{UI.product.noticeTitle}</h2>
            <ul className="notice-box">
              {notices.map((n) => (
                <li key={n.id} className="notice-item">
                  <Info size={15} className="notice-item__icon" />
                  {noticeText(n)}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: options */}
          <div>
            <div className="pd__side-inner">{optionsPanel}</div>
          </div>
        </div>
      </Container>

      {/* Mobile sticky apply bar — portaled to <body> so position:fixed resolves
          against the viewport (the route-fade animation transforms an ancestor,
          which would otherwise become its containing block). */}
      {createPortal(
        <div className="pd__mobilebar">
          <div className="pd__mobilebar-inner">
            <div style={{ flex: 1 }}>
              <div className="pd__mobilebar-name">
                <span aria-hidden>{place.emoji}</span> {place.name}
              </div>
              <div className="pd__mobilebar-price">{planPriceText(product, options.plan)}</div>
            </div>
            <Button className="btn--lg" onClick={apply}>
              {UI.cta.apply}
            </Button>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="spec-row__item">
      <div className="spec-row__label">{label}</div>
      <div className="spec-row__value">{value}</div>
    </div>
  )
}

// The country to feature for a product: the chosen destination when the product
// actually covers it, otherwise a representative country from the product's
// coverage (so the flag is always correct). Returns the matching code too, used
// to find the daily/volume sibling.
function resolvePlace(
  product: Product,
  direction: 'inbound' | 'outbound',
  destinationCode: string | null,
  koreaName: string,
  worldName: string,
): { place: { emoji: string; name: string }; code: string | null } {
  if (direction === 'inbound' || product.directions[0] === 'inbound') {
    return { place: { emoji: '🇰🇷', name: koreaName }, code: 'KR' }
  }
  const covers = (regionId: string) =>
    product.coverage === 'global' || product.coverage.includes(regionId as never)

  const chosen = getDestination(destinationCode)
  if (chosen && covers(chosen.regionId)) {
    return { place: { emoji: chosen.flag, name: chosen.name }, code: chosen.code }
  }
  if (product.coverage === 'global') {
    return { place: { emoji: '🌐', name: worldName }, code: null }
  }
  const rep =
    getDestinations().find((d) => covers(d.regionId) && d.popular) ??
    getDestinations().find((d) => covers(d.regionId))
  return rep
    ? { place: { emoji: rep.flag, name: rep.name }, code: rep.code }
    : { place: { emoji: '🌐', name: worldName }, code: null }
}
