import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { LoaderCircle } from 'lucide-react'
import CheckoutLayout from '../../components/site/CheckoutLayout'
import MvnoSummary from '../../components/MvnoSummary'
import Checkbox from '../../components/Checkbox'
import Button from '../../components/Button'
import { useUI } from '../../content'
import { useSubscribe } from '../../store/subscribe'
import { useAuth } from '../../store/auth'
import { getPlan, planMonthly } from '../../lib/mvno'
import { submitSubscription } from '../../lib/subscriptions'

// 가입 2단계 — 확인 + 월 자동결제 동의 + 접수.
export default function SubscribeConfirm() {
  const UI = useUI()
  const navigate = useNavigate()
  const planId = useSubscribe((s) => s.planId)
  const options = useSubscribe((s) => s.options)
  const applicant = useSubscribe((s) => s.applicant)
  const reset = useSubscribe((s) => s.reset)
  const user = useAuth((s) => s.user)
  const plan = getPlan(planId)
  const [agree, setAgree] = useState(false)
  const [shake, setShake] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!planId || !plan) return <Navigate to="/plans" replace />
  if (!user) return <Navigate to="/signin?next=/subscribe/confirm" replace />
  if (!applicant.name) return <Navigate to="/subscribe/info" replace />

  const monthly = planMonthly(plan)

  const place = async () => {
    if (!agree) {
      setShake(true)
      return
    }
    setBusy(true)
    setError(null)
    try {
      const sub = await submitSubscription({ planId, options, applicant })
      if (sub.status === 'failed') {
        setError(UI.error.submit)
        setBusy(false)
        return
      }
      reset()
      navigate(`/subscribe/complete?id=${sub.id}`, { replace: true })
    } catch {
      setError(UI.error.submit)
      setBusy(false)
    }
  }

  return (
    <CheckoutLayout
      step={1}
      title={UI.subscribe.confirmTitle}
      subtitle={UI.subscribe.confirmSub}
      aside={<MvnoSummary planId={planId} options={options} />}
    >
      <div className="review">
        <div className="review__head">{UI.confirm.applicant}</div>
        <dl className="review__rows">
          <Row label={UI.subscribe.name}>{applicant.name}</Row>
          <Row label={UI.subscribe.birth}>{applicant.birth}</Row>
          <Row label={options.portType === 'port' ? UI.subscribe.phonePort : UI.subscribe.phoneNew}>
            {applicant.phone}
          </Row>
          {options.portType === 'port' && (
            <Row label={UI.subscribe.currentCarrier}>{applicant.currentCarrier}</Row>
          )}
          <Row label={UI.applicant.email}>{applicant.email}</Row>
          <Row label={UI.subscribe.pay}>
            {applicant.payMethod === 'card' ? UI.subscribe.payCard : UI.subscribe.payBank}
          </Row>
          {applicant.address && <Row label={UI.applicant.address}>{applicant.address}</Row>}
        </dl>
      </div>

      <div className="firstcharge">
        <span>{UI.subscribe.firstCharge}</span>
        <span className="firstcharge__amt">₩{monthly.toLocaleString()}</span>
      </div>
      <p className="pay-note">{UI.subscribe.autopayNote}</p>

      <div className="agree-wrap">
        <Checkbox checked={agree} onChange={setAgree} label={UI.subscribe.agree} />
        {shake && !agree && <div className="agree-error">{UI.confirm.agreeRequired}</div>}
      </div>

      {error && <div className="error-box">{error}</div>}

      <Button full className="mt-4" onClick={place} disabled={busy}>
        {busy ? (
          <>
            <LoaderCircle size={18} className="spin" /> {UI.confirm.processing}
          </>
        ) : (
          UI.subscribe.placeCta
        )}
      </Button>
    </CheckoutLayout>
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
