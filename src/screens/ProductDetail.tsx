import { useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Info } from 'lucide-react'
import Container from '../components/site/Container'
import Button from '../components/Button'
import Segmented from '../components/Segmented'
import Stepper from '../components/Stepper'
import DataTierSelect from '../components/DataTierSelect'
import ChipSelect from '../components/ChipSelect'
import Badge from '../components/ui/Badge'
import BenefitIcon from '../components/ui/BenefitIcon'
import { useUI } from '../content'
import {
  benefitsFor,
  dataIdFor,
  dataOption,
  getProduct,
  noticesFor,
  VALIDITY_OPTIONS,
  VOLUME_GB_OPTIONS,
} from '../lib/shop'
import { dailyDataText, planPriceText } from '../lib/labels'
import { benefitDesc, benefitTitle, noticeText, productName, productTagline } from '../lib/localize'
import { useApplication } from '../store/application'
import { useAuth } from '../store/auth'

export default function ProductDetail() {
  const UI = useUI()
  const { productId } = useParams()
  const navigate = useNavigate()
  const product = getProduct(productId)
  const selectProduct = useApplication((s) => s.selectProduct)
  const options = useApplication((s) => s.options)
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

  // Purchase needs login: go straight to details if signed in, else sign in first.
  const apply = () => navigate(user ? '/apply/info' : '/signin?next=/apply/info')
  const benefits = benefitsFor(product)
  const notices = noticesFor(product)
  const days = options.plan.days ?? product.defaultDays ?? 1

  const optionsPanel = (
    <div className="options-card">
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

      {product.kind === 'daily' ? (
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
          ‹ {UI.cta.back}
        </button>

        <div className="pd__grid">
          {/* Left: info */}
          <div>
            {product.badge && (
              <Badge tone={product.recommended ? 'brand' : 'neutral'}>{product.badge}</Badge>
            )}
            <h1 className="pd__title">{productName(product)}</h1>
            <p className="pd__tagline">{productTagline(product)}</p>

            <div className="spec-row">
              <Spec
                label={product.kind === 'daily' ? UI.product.perDay : UI.product.total}
                value={
                  product.kind === 'daily'
                    ? dailyDataText(options.plan)
                    : `${options.plan.totalGb ?? product.totalGb}GB`
                }
              />
              <Spec
                label={product.kind === 'daily' ? UI.product.days : UI.product.validity}
                value={UI.product.daysUnit(
                  product.kind === 'daily' ? days : options.plan.validityDays ?? 0,
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

      {/* Mobile sticky apply bar */}
      <div className="pd__mobilebar">
        <div className="pd__mobilebar-inner">
          <div style={{ flex: 1 }}>
            <div className="pd__mobilebar-name">{productName(product)}</div>
            <div className="pd__mobilebar-price">{planPriceText(product, options.plan)}</div>
          </div>
          <Button className="btn--lg" onClick={apply}>
            {UI.cta.apply}
          </Button>
        </div>
      </div>
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
