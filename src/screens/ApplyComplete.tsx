import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Info } from 'lucide-react'
import Container from '../components/site/Container'
import StepNav from '../components/site/StepNav'
import SummaryCard from '../components/SummaryCard'
import StatusBadge from '../components/ui/StatusBadge'
import QRPlaceholder from '../components/QRPlaceholder'
import Button from '../components/Button'
import { useUI } from '../content'
import { getApplication } from '../lib/applications'
import { getProduct, noticesFor } from '../lib/shop'
import { noticeText } from '../lib/localize'

// 신청 4단계 · 완료.
export default function ApplyComplete() {
  const UI = useUI()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const id = params.get('id') ?? ''
  const application = getApplication(id)

  if (!application) return <Navigate to="/applications" replace />

  const product = getProduct(application.productId)
  const isEsim = application.options.simType === 'esim'
  const notices = product ? noticesFor(product) : []

  return (
    <div className="complete-wrap">
      <Container size="narrow">
        <div className="checkout__steps">
          <StepNav step={2} />
        </div>

        <div className="complete-card">
          <div className="complete__icon">
            <CheckCircle2 size={40} strokeWidth={2.2} />
          </div>
          <h1 className="complete__title">{UI.complete.title}</h1>
          <p className="complete__sub">{UI.complete.subtitle}</p>

          <div className="ref-chip">
            <span className="ref-chip__label">{UI.complete.refLabel}</span>
            <span className="ref-chip__id">{application.id}</span>
          </div>
          <div className="status-center">
            <StatusBadge status={application.status} />
          </div>

          {/* eSIM QR / USIM pickup */}
          {isEsim && application.esim ? (
            <div className="qr-card">
              <QRPlaceholder size={150} payload={application.esim.qrPayload} />
              <p className="qr-card__note">{UI.complete.esimNext}</p>
            </div>
          ) : application.receive ? (
            <div className="next-box">{UI.complete.usimNext}</div>
          ) : null}
        </div>

        {/* Summary */}
        <div className="mt-5">
          <SummaryCard
            productId={application.productId}
            options={application.options}
            direction={application.direction}
            destinationCode={application.destinationCode}
            travel={{ start: application.applicant.travelStart, end: application.applicant.travelEnd }}
          />
        </div>

        {/* Notices */}
        {notices.length > 0 && (
          <div className="block-card">
            <div className="block-card__title">{UI.complete.noticeTitle}</div>
            <ul className="notice-box notice-box--plain mt-3" style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
              {notices.map((n) => (
                <li key={n.id} className="notice-item">
                  <Info size={15} className="notice-item__icon" />
                  {noticeText(n)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTAs */}
        <div className="complete__cta">
          {isEsim && (
            <Button full onClick={() => navigate(`/activate?id=${application.id}`)}>
              {UI.cta.activate}
            </Button>
          )}
          <Button full variant="secondary" onClick={() => navigate(`/applications/${application.id}`)}>
            {UI.cta.viewApplication}
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
