import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import CheckoutLayout from '../components/site/CheckoutLayout'
import SummaryCard from '../components/SummaryCard'
import TextField from '../components/ui/TextField'
import Button from '../components/Button'
import { useUI } from '../content'
import { useApplication } from '../store/application'
import { useAuth } from '../store/auth'
import { validateApplicant, type ApplicantErrors } from '../lib/validation'
import { cn } from '../lib/cn'
import type { ReceiveMethodOpt } from '../lib/domain'

// 신청 2단계 · 신청 정보 입력 + 유효성 검사.
export default function ApplicantInfo() {
  const UI = useUI()
  const navigate = useNavigate()
  const productId = useApplication((s) => s.productId)
  const options = useApplication((s) => s.options)
  const applicant = useApplication((s) => s.applicant)
  const patch = useApplication((s) => s.patchApplicant)
  const setReceive = useApplication((s) => s.setReceiveMethod)
  const user = useAuth((s) => s.user)
  const [errors, setErrors] = useState<ApplicantErrors>({})
  const [submitted, setSubmitted] = useState(false)

  if (!productId || !options) return <Navigate to="/" replace />
  if (!user) return <Navigate to="/signin?next=/apply/info" replace />

  const isUsim = options.simType === 'usim'
  const receiveOptions: ReceiveMethodOpt[] = isUsim ? ['delivery', 'airport_pickup'] : ['esim_qr']
  const showAddress = isUsim && options.receiveMethod === 'delivery'

  const revalidate = () => {
    if (!submitted) return
    setErrors(validateApplicant(applicant, options))
  }

  const next = () => {
    const e = validateApplicant(applicant, options)
    setErrors(e)
    setSubmitted(true)
    if (Object.keys(e).length === 0) navigate('/apply/confirm')
  }

  return (
    <CheckoutLayout
      step={0}
      title={UI.applicant.title}
      subtitle={UI.applicant.subtitle}
      aside={
        <SummaryCard
          productId={productId}
          options={options}
          travel={{ start: applicant.travelStart, end: applicant.travelEnd }}
        />
      }
    >
      <div className="form-stack">
        <TextField
          label={UI.applicant.name}
          required
          value={applicant.name}
          onChange={(v) => patch({ name: v })}
          onBlur={revalidate}
          placeholder={UI.applicant.namePh}
          error={errors.name}
        />
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
        <TextField
          label={UI.applicant.phone}
          required
          type="tel"
          inputMode="tel"
          value={applicant.phone}
          onChange={(v) => patch({ phone: v })}
          onBlur={revalidate}
          placeholder={UI.applicant.phonePh}
          error={errors.phone}
        />

        <div className="field-grid-2">
          <TextField
            label={UI.applicant.travelStart}
            required
            type="date"
            value={applicant.travelStart}
            onChange={(v) => patch({ travelStart: v })}
            onBlur={revalidate}
            error={errors.travelStart}
          />
          <TextField
            label={UI.applicant.travelEnd}
            required
            type="date"
            value={applicant.travelEnd}
            onChange={(v) => patch({ travelEnd: v })}
            onBlur={revalidate}
            error={errors.travelEnd}
          />
        </div>

        {/* Receive method */}
        <div>
          <div className="field-block__label">{UI.applicant.receiveTitle}</div>
          <div className="receive-list">
            {receiveOptions.map((r) => {
              const active = options.receiveMethod === r
              return (
                <button
                  key={r}
                  type="button"
                  disabled={receiveOptions.length === 1}
                  onClick={() => setReceive(r)}
                  className={cn('receive-opt', active && 'is-active')}
                >
                  <span className="receive-opt__radio" />
                  {UI.receive[r]}
                </button>
              )
            })}
          </div>
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

        <Button full className="mt-3" onClick={next}>
          {UI.cta.next}
        </Button>
      </div>
    </CheckoutLayout>
  )
}
