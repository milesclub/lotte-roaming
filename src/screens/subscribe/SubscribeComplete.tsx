import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { CircleCheck } from 'lucide-react'
import Container from '../../components/site/Container'
import Button from '../../components/Button'
import MvnoStatusBadge from '../../components/MvnoStatusBadge'
import { useUI } from '../../content'
import { getSubscription } from '../../lib/subscriptions'
import { getPlan } from '../../lib/mvno'

export default function SubscribeComplete() {
  const UI = useUI()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const id = params.get('id') ?? ''
  const sub = getSubscription(id)
  if (!sub) return <Navigate to="/plans" replace />
  const plan = getPlan(sub.planId)
  const isEsim = sub.options.simType === 'esim'

  return (
    <div className="complete-wrap">
      <Container size="narrow">
        <div className="complete-card">
          <div className="complete__icon">
            <CircleCheck size={40} strokeWidth={2.2} />
          </div>
          <h1 className="complete__title">{UI.subscribe.completeTitle}</h1>
          <p className="complete__sub">{UI.subscribe.completeSub}</p>

          <div className="ref-chip">
            <span className="ref-chip__label">{UI.subscribe.subNo}</span>
            <span className="ref-chip__id">{sub.id}</span>
          </div>
          <div className="status-center">
            <MvnoStatusBadge status={sub.status} />
          </div>

          <div className="next-box">
            <div className="next-box__plan">{plan?.name}</div>
            {isEsim ? UI.subscribe.esimNext : UI.subscribe.usimNext}
            <div className="next-box__bill">
              {UI.subscribe.billingFrom} {sub.nextBillingDate}
            </div>
          </div>
        </div>

        <div className="complete__cta">
          <Button full onClick={() => navigate(`/subscriptions/${sub.id}`)}>
            {UI.subscribe.viewSub}
          </Button>
        </div>
        <div className="complete__home">
          <Link to="/" className="muted-link">
            {UI.cta.goHome}
          </Link>
        </div>
      </Container>
    </div>
  )
}
