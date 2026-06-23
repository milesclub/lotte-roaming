import { useUI } from '../content'
import { getPlan, planMonthly } from '../lib/mvno'
import type { MvnoOptions } from '../lib/mvno'

// Sticky order summary for the MVNO sign-up funnel (mirrors SummaryCard).
export default function MvnoSummary({ planId, options }: { planId: string | null; options?: MvnoOptions }) {
  const UI = useUI()
  const plan = getPlan(planId)
  const monthly = plan ? planMonthly(plan) : 0
  const dataText = plan?.unlimitedData ? UI.mvno.unlimited : `${plan?.dataGb}GB`

  return (
    <div className="summary">
      <div className="summary__head">{UI.subscribe.summaryTitle}</div>
      <dl className="summary__rows">
        <Row label={UI.mvno.planLabel}>{plan ? plan.name : '—'}</Row>
        {plan && (
          <Row label={UI.mvno.networkLabel}>
            {plan.tech === '5g' ? '5G' : 'LTE'} · {UI.mvno.networkName[plan.network]}
          </Row>
        )}
        {plan && <Row label={UI.mvno.dataLabel}>{dataText}</Row>}
        {options && <Row label={UI.subscribe.port}>{options.portType === 'port' ? UI.subscribe.portMove : UI.subscribe.portNew}</Row>}
        {options && <Row label={UI.product.sim}>{UI.sim[options.simType]}</Row>}
      </dl>
      <div className="summary__total">
        <span className="summary__total-label">{UI.mvno.perMonth}</span>
        <span className="summary__price">₩{monthly.toLocaleString()}</span>
      </div>
      <p className="summary__pricenote">{UI.mvno.priceNote}</p>
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
