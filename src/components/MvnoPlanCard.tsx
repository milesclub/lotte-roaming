import { Link } from 'react-router-dom'
import { Phone, ChevronRight } from 'lucide-react'
import Badge from './ui/Badge'
import { useUI } from '../content'
import { planMonthly, type MvnoPlan } from '../lib/mvno'

// A single MVNO plan in the catalog: data + unlimited calls + monthly price.
export default function MvnoPlanCard({ plan }: { plan: MvnoPlan }) {
  const UI = useUI()
  const monthly = planMonthly(plan)
  const promo = plan.promoKRW != null && plan.promoKRW < plan.monthlyKRW
  const dataText = plan.unlimitedData ? UI.mvno.unlimited : `${plan.dataGb}GB`

  return (
    <Link to={`/plans/${plan.id}`} className="plan-card">
      <div className="plan-card__top">
        <span className="plan-card__net">
          {plan.tech === '5g' ? '5G' : 'LTE'} · {UI.mvno.networkName[plan.network]}
        </span>
        {plan.badge && <Badge tone={plan.recommended ? 'brand' : 'neutral'}>{plan.badge}</Badge>}
      </div>

      <div className="plan-card__data">
        <span className="plan-card__data-num">{dataText}</span>
        {!plan.unlimitedData && <span className="plan-card__data-unit">/ {UI.mvno.perMonth}</span>}
      </div>
      <div className="plan-card__calls">
        <Phone size={14} />
        {plan.unlimitedVoice ? UI.mvno.callsUnlimited : `${plan.voiceMin}${UI.mvno.min}`}
        {' · '}
        {plan.unlimitedSms ? UI.mvno.smsUnlimited : `${plan.smsCount}${UI.mvno.smsUnit}`}
      </div>

      <div className="plan-card__foot">
        <div className="plan-card__price">
          {promo && <span className="plan-card__price-was">₩{plan.monthlyKRW.toLocaleString()}</span>}
          <span className="plan-card__price-now">
            ₩{monthly.toLocaleString()}
            <span className="plan-card__price-per"> / {UI.mvno.perMonth}</span>
          </span>
          {promo && (
            <span className="plan-card__promo">{UI.mvno.promoMonths(plan.promoMonths ?? 0)}</span>
          )}
        </div>
        <span className="plan-card__cta">
          {UI.mvno.detail}
          <ChevronRight size={16} />
        </span>
      </div>
    </Link>
  )
}
