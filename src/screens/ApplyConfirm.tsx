import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Info, Loader2 } from 'lucide-react'
import CheckoutLayout from '../components/site/CheckoutLayout'
import SummaryCard from '../components/SummaryCard'
import Checkbox from '../components/Checkbox'
import Button from '../components/Button'
import { useUI } from '../content'
import { useApplication } from '../store/application'
import { useAuth } from '../store/auth'
import { getProduct, noticesFor } from '../lib/shop'
import { receiveLabel } from '../lib/labels'
import { noticeText } from '../lib/localize'
import { validateApplicant } from '../lib/validation'
import { submitApplication } from '../lib/applications'

// 신청 3단계 · 신청 확인 + 접수.
export default function ApplyConfirm() {
  const UI = useUI()
  const navigate = useNavigate()
  const app = useApplication()
  const user = useAuth((s) => s.user)
  const [agree, setAgree] = useState(false)
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const product = getProduct(app.productId)
  if (!app.productId || !app.options || !product) return <Navigate to="/" replace />
  if (!user) return <Navigate to="/signin?next=/apply/confirm" replace />
  if (Object.keys(validateApplicant(app.applicant, app.options)).length > 0)
    return <Navigate to="/apply/info" replace />

  const submit = async () => {
    if (!agree) {
      setTouched(true)
      return
    }
    setBusy(true)
    setError(null)
    try {
      const application = await submitApplication({
        direction: app.direction,
        destinationCode: app.destinationCode ?? '',
        productId: app.productId!,
        options: app.options!,
        applicant: app.applicant,
      })
      if (application.status === 'failed') {
        setError(UI.error.submit)
        setBusy(false)
        return
      }
      app.reset()
      navigate(`/apply/complete?id=${application.id}`, { replace: true })
    } catch {
      setError(UI.error.submit)
      setBusy(false)
    }
  }

  const a = app.applicant
  const notices = noticesFor(product)

  return (
    <CheckoutLayout
      step={1}
      title={UI.confirm.title}
      subtitle={UI.confirm.subtitle}
      aside={
        <SummaryCard
          productId={app.productId}
          options={app.options}
          travel={{ start: a.travelStart, end: a.travelEnd }}
        />
      }
    >
      {/* Applicant review */}
      <div className="review">
        <div className="review__head">{UI.confirm.applicant}</div>
        <dl className="review__rows">
          <Row label={UI.applicant.name}>{a.name}</Row>
          <Row label={UI.applicant.email}>{a.email}</Row>
          <Row label={UI.applicant.phone}>{a.phone}</Row>
          <Row label={UI.confirm.period}>
            {a.travelStart} ~ {a.travelEnd}
          </Row>
          {app.options.receiveMethod && (
            <Row label={UI.confirm.receive}>{receiveLabel(app.options.receiveMethod)}</Row>
          )}
          {a.address && <Row label={UI.applicant.address}>{a.address}</Row>}
        </dl>
      </div>

      {/* Notices */}
      <ul className="notice-box notice-box--plain mt-4">
        {notices.map((n) => (
          <li key={n.id} className="notice-item">
            <Info size={15} className="notice-item__icon" />
            {noticeText(n)}
          </li>
        ))}
      </ul>

      <div className="agree-wrap">
        <Checkbox checked={agree} onChange={setAgree} label={UI.confirm.agree} />
        {touched && !agree && <div className="agree-error">{UI.confirm.agreeRequired}</div>}
      </div>

      <p className="pay-note">{UI.confirm.paymentNote}</p>

      {error && <div className="error-box">{error}</div>}

      <Button full className="mt-4" onClick={submit} disabled={busy}>
        {busy ? (
          <>
            <Loader2 size={18} className="spin" /> {UI.confirm.processing}
          </>
        ) : (
          UI.cta.toComplete
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
