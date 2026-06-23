import { Link, Navigate, useParams } from 'react-router-dom'
import { CalendarClock } from 'lucide-react'
import Container from '../components/site/Container'
import Button from '../components/Button'
import MvnoStatusBadge from '../components/MvnoStatusBadge'
import MvnoUsageCard from '../components/MvnoUsageCard'
import { useUI } from '../content'
import { getSubscription, updateSubscriptionStatus } from '../lib/subscriptions'
import { getPlan } from '../lib/mvno'
import { useState } from 'react'

export default function SubscriptionDetail() {
  const UI = useUI()
  const { id = '' } = useParams()
  const [, force] = useState(0)
  const sub = getSubscription(id)
  if (!sub) return <Navigate to="/applications" replace />
  const plan = getPlan(sub.planId)

  const activate = () => {
    updateSubscriptionStatus(sub.id, 'active')
    force((n) => n + 1)
  }

  return (
    <div className="detail-wrap">
      <Container size="narrow">
        <Link to="/applications" className="detail-back">
          ‹ {UI.applications.title}
        </Link>

        <div className="detail-card">
          <div className="detail-card__head">
            <div>
              <div className="detail-card__eyebrow">{UI.mvno.planLabel}</div>
              <div className="detail-card__id">{plan?.name}</div>
              <div className="detail-card__date">
                {plan && `${plan.tech === '5g' ? '5G' : 'LTE'} · ${UI.mvno.networkName[plan.network]}`}
              </div>
            </div>
            <MvnoStatusBadge status={sub.status} />
          </div>

          <div className="sub-meta">
            <div className="sub-meta__row">
              <span className="sub-meta__label">{UI.mySub.monthlyFee}</span>
              <span className="sub-meta__value">₩{sub.monthlyKRW.toLocaleString()} / {UI.mvno.perMonth}</span>
            </div>
            <div className="sub-meta__row">
              <span className="sub-meta__label">
                <CalendarClock size={14} /> {UI.mySub.nextBilling}
              </span>
              <span className="sub-meta__value">{sub.nextBillingDate}</span>
            </div>
            <div className="sub-meta__row">
              <span className="sub-meta__label">{UI.subscribe.subNo}</span>
              <span className="sub-meta__value">{sub.id}</span>
            </div>
          </div>
        </div>

        {/* Monthly data usage */}
        <div className="mt-5">
          <MvnoUsageCard subscription={sub} />
        </div>

        {sub.status === 'pending_activation' && (
          <Button full className="mt-5" onClick={activate}>
            {UI.mySub.activateCta}
          </Button>
        )}
        <p className="sub-managenote">{UI.mySub.manageNote}</p>
      </Container>
    </div>
  )
}
