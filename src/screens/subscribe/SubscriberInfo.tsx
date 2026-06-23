import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import CheckoutLayout from '../../components/site/CheckoutLayout'
import MvnoSummary from '../../components/MvnoSummary'
import TextField from '../../components/ui/TextField'
import Segmented from '../../components/Segmented'
import Button from '../../components/Button'
import { useUI } from '../../content'
import { useSubscribe } from '../../store/subscribe'
import { useAuth } from '../../store/auth'
import { cn } from '../../lib/cn'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 가입 1단계 — 가입자 정보 + 본인인증(mock) + 결제수단.
export default function SubscriberInfo() {
  const UI = useUI()
  const navigate = useNavigate()
  const planId = useSubscribe((s) => s.planId)
  const options = useSubscribe((s) => s.options)
  const applicant = useSubscribe((s) => s.applicant)
  const patch = useSubscribe((s) => s.patchApplicant)
  const setPortType = useSubscribe((s) => s.setPortType)
  const setSimType = useSubscribe((s) => s.setSimType)
  const setPayMethod = useSubscribe((s) => s.setPayMethod)
  const user = useAuth((s) => s.user)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  if (!planId) return <Navigate to="/plans" replace />
  if (!user) return <Navigate to="/signin?next=/subscribe/info" replace />

  const isPort = options.portType === 'port'
  const showAddress = options.simType === 'usim'

  const validate = () => {
    const e: Record<string, string> = {}
    if (!applicant.name.trim()) e.name = UI.applicant.required
    if (!applicant.birth) e.birth = UI.applicant.required
    const digits = applicant.phone.replace(/\D/g, '')
    if (!applicant.phone.trim()) e.phone = UI.applicant.required
    else if (digits.length < 10 || digits.length > 11) e.phone = UI.applicant.invalidPhone
    if (!applicant.email.trim()) e.email = UI.applicant.required
    else if (!EMAIL.test(applicant.email.trim())) e.email = UI.applicant.invalidEmail
    if (isPort && !applicant.currentCarrier?.trim()) e.currentCarrier = UI.applicant.required
    if (showAddress && !applicant.address?.trim()) e.address = UI.applicant.addressRequired
    return e
  }
  const revalidate = () => submitted && setErrors(validate())
  const next = () => {
    const e = validate()
    setErrors(e)
    setSubmitted(true)
    if (Object.keys(e).length === 0) navigate('/subscribe/confirm')
  }

  return (
    <CheckoutLayout
      step={0}
      title={UI.subscribe.infoTitle}
      subtitle={UI.subscribe.infoSub}
      aside={<MvnoSummary planId={planId} options={options} />}
    >
      <div className="form-stack">
        {/* 번호이동 / 신규 + SIM */}
        <div>
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

        <TextField
          label={UI.subscribe.name}
          required
          value={applicant.name}
          onChange={(v) => patch({ name: v })}
          onBlur={revalidate}
          placeholder={UI.subscribe.namePh}
          error={errors.name}
        />
        <div className="field-grid-2">
          <TextField
            label={UI.subscribe.birth}
            required
            type="date"
            value={applicant.birth}
            onChange={(v) => patch({ birth: v })}
            onBlur={revalidate}
            error={errors.birth}
          />
          <TextField
            label={isPort ? UI.subscribe.phonePort : UI.subscribe.phoneNew}
            required
            type="tel"
            inputMode="tel"
            value={applicant.phone}
            onChange={(v) => patch({ phone: v })}
            onBlur={revalidate}
            placeholder={UI.applicant.phonePh}
            error={errors.phone}
          />
        </div>

        {isPort && (
          <TextField
            label={UI.subscribe.currentCarrier}
            required
            value={applicant.currentCarrier ?? ''}
            onChange={(v) => patch({ currentCarrier: v })}
            onBlur={revalidate}
            placeholder={UI.subscribe.currentCarrierPh}
            error={errors.currentCarrier}
          />
        )}

        <TextField
          label={UI.applicant.email}
          required
          type="email"
          inputMode="email"
          value={applicant.email}
          onChange={(v) => patch({ email: v })}
          onBlur={revalidate}
          placeholder={UI.applicant.emailPh}
          error={errors.email}
        />

        {/* SIM 수령 */}
        <div>
          <div className="field-block__label">{UI.product.sim}</div>
          <Segmented
            ariaLabel={UI.product.sim}
            options={[
              { value: 'usim', label: UI.sim.usim },
              { value: 'esim', label: UI.sim.esim },
            ]}
            value={options.simType}
            onChange={(v) => setSimType(v)}
          />
          <p className="opt-desc">{options.simType === 'esim' ? UI.sim.esimDesc : UI.sim.usimDesc}</p>
        </div>

        {showAddress && (
          <TextField
            label={UI.applicant.address}
            required
            value={applicant.address ?? ''}
            onChange={(v) => patch({ address: v })}
            onBlur={revalidate}
            placeholder={UI.applicant.addressPh}
            error={errors.address}
          />
        )}

        {/* 결제수단 */}
        <div>
          <div className="field-block__label">{UI.subscribe.pay}</div>
          <Segmented
            ariaLabel={UI.subscribe.pay}
            options={[
              { value: 'card', label: UI.subscribe.payCard },
              { value: 'bank', label: UI.subscribe.payBank },
            ]}
            value={applicant.payMethod}
            onChange={(v) => setPayMethod(v)}
          />
        </div>

        {/* 본인인증 안내 (mock) */}
        <div className={cn('kyc-note')}>
          <ShieldCheck size={18} className="kyc-note__icon" />
          <div>
            <div className="kyc-note__title">{UI.subscribe.kycTitle}</div>
            <div className="kyc-note__desc">{UI.subscribe.kycNote}</div>
          </div>
        </div>

        <Button full className="mt-3" onClick={next}>
          {UI.cta.next}
        </Button>
      </div>
    </CheckoutLayout>
  )
}
