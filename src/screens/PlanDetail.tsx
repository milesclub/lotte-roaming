import { createPortal } from 'react-dom'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Info, ChevronLeft } from 'lucide-react'
import Container from '../components/site/Container'
import Button from '../components/Button'
import Segmented from '../components/Segmented'
import Badge from '../components/ui/Badge'
import BenefitIcon from '../components/ui/BenefitIcon'
import { useUI } from '../content'
import { getPlan, planMonthly } from '../lib/mvno'
import { BENEFITS } from '../data/products'
import { benefitDesc, benefitTitle } from '../lib/localize'
import { useSubscribe } from '../store/subscribe'
import { useAuth } from '../store/auth'

export default function PlanDetail() {
  const UI = useUI()
  const { planId } = useParams()
  const navigate = useNavigate()
  const plan = getPlan(planId)
  const options = useSubscribe((s) => s.options)
  const selectPlan = useSubscribe((s) => s.selectPlan)
  const setSimType = useSubscribe((s) => s.setSimType)
  const setPortType = useSubscribe((s) => s.setPortType)
  const user = useAuth((s) => s.user)

  if (!plan) return <Navigate to="/plans" replace />

  const apply = () => {
    selectPlan(plan.id)
    navigate(user ? '/subscribe/info' : '/signin?next=/subscribe/info')
  }

  const monthly = planMonthly(plan)
  const promo = plan.promoKRW != null && plan.promoKRW < plan.monthlyKRW
  const perks = plan.perkIds.map((id) => BENEFITS[id]).filter(Boolean)
  const dataText = plan.unlimitedData ? UI.mvno.unlimited : `${plan.dataGb}GB`

  const priceBlock = (
    <>
      <div className="pd__price-row">
        <span className="pd__price-label">{UI.mvno.perMonth}</span>
        <span className="pd__price">₩{monthly.toLocaleString()}</span>
      </div>
      {promo && (
        <p className="pd__pricenote">
          {UI.mvno.promoFull(plan.monthlyKRW.toLocaleString(), plan.promoMonths ?? 0)}
        </p>
      )}
      {!promo && <p className="pd__pricenote">{UI.mvno.priceNote}</p>}
    </>
  )

  const optionsPanel = (
    <div className="options-card">
      <div className="field-block">
        <div className="field-block__label">{UI.subscribe.port}</div>
        <Segmented
          ariaLabel={UI.subscribe.port}
          options={[
            { value: 'port', label: UI.subscribe.portMove },
            { value: 'new', label: UI.subscribe.portNew },
          ]}
          value={options.portType}
          onChange={(v) => setPortType(v)}
        />
      </div>
      <div className="field-block">
        <div className="field-block__label">{UI.product.sim}</div>
        <Segmented
          ariaLabel={UI.product.sim}
          options={plan.tech === '5g' ? [{ value: 'esim', label: UI.sim.esim }, { value: 'usim', label: UI.sim.usim }] : [{ value: 'usim', label: UI.sim.usim }, { value: 'esim', label: UI.sim.esim }]}
          value={options.simType}
          onChange={(v) => setSimType(v)}
        />
        <p className="opt-desc">{options.simType === 'esim' ? UI.sim.esimDesc : UI.sim.usimDesc}</p>
      </div>

      {priceBlock}

      <Button full className="pd__apply-desktop" onClick={apply}>
        {UI.mvno.apply}
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
          <div>
            <div className="plan-detail__head">
              <span className="plan-detail__net">
                {plan.tech === '5g' ? '5G' : 'LTE'} · {UI.mvno.networkName[plan.network]}
              </span>
              {plan.badge && <Badge tone={plan.recommended ? 'brand' : 'neutral'}>{plan.badge}</Badge>}
            </div>
            <h1 className="pd__title pd__title--plain">{plan.name}</h1>
            <p className="pd__tagline">{plan.tagline}</p>

            <div className="spec-row">
              <Spec label={UI.mvno.dataLabel} value={dataText} />
              <Spec
                label={UI.mvno.voiceLabel}
                value={plan.unlimitedVoice ? UI.mvno.unlimited : `${plan.voiceMin}${UI.mvno.min}`}
              />
              <Spec
                label={UI.mvno.smsLabel}
                value={plan.unlimitedSms ? UI.mvno.unlimited : `${plan.smsCount}${UI.mvno.smsUnit}`}
              />
            </div>

            <h2 className="pd__h2">{UI.mvno.perksTitle}</h2>
            <div className="benefit-cards">
              {perks.map((b) => (
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
              {UI.mvno.notices.map((n, i) => (
                <li key={i} className="notice-item">
                  <Info size={15} className="notice-item__icon" />
                  {n}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="pd__side-inner">{optionsPanel}</div>
          </div>
        </div>
      </Container>

      {createPortal(
        <div className="pd__mobilebar">
          <div className="pd__mobilebar-inner">
            <div style={{ flex: 1 }}>
              <div className="pd__mobilebar-name">{plan.name}</div>
              <div className="pd__mobilebar-price">
                ₩{monthly.toLocaleString()} / {UI.mvno.perMonth}
              </div>
            </div>
            <Button className="btn--lg" onClick={apply}>
              {UI.mvno.apply}
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
