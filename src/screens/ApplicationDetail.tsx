import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Info } from 'lucide-react'
import Container from '../components/site/Container'
import SummaryCard from '../components/SummaryCard'
import StatusBadge from '../components/ui/StatusBadge'
import QRPlaceholder from '../components/QRPlaceholder'
import UsageCard from '../components/UsageCard'
import Button from '../components/Button'
import { useUI } from '../content'
import { getApplication } from '../lib/applications'
import { getProduct, noticesFor } from '../lib/shop'
import { noticeText } from '../lib/localize'

export default function ApplicationDetail() {
  const UI = useUI()
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const application = getApplication(id)

  if (!application) return <Navigate to="/applications" replace />

  const product = getProduct(application.productId)
  const isEsim = application.options.simType === 'esim'
  const notices = product ? noticesFor(product) : []
  const canActivate = isEsim && application.status === 'pending_provisioning'
  // Usage is meaningful once the line is provisioned/active.
  const showUsage =
    application.status === 'pending_provisioning' || application.status === 'completed'

  return (
    <div className="detail-wrap">
      <Container size="narrow">
        <Link to="/applications" className="detail-back">
          ‹ {UI.applications.title}
        </Link>

        <div className="detail-card">
          <div className="detail-card__head">
            <div>
              <div className="detail-card__eyebrow">{UI.applications.detailTitle}</div>
              <div className="detail-card__id">{application.id}</div>
              <div className="detail-card__date">
                {UI.applications.appliedAt} {application.createdAt.slice(0, 10)}
              </div>
            </div>
            <StatusBadge status={application.status} />
          </div>

          <p className="status-desc">{UI.statusDesc[application.status]}</p>

          {isEsim && application.esim && (
            <div className="qr-card">
              <QRPlaceholder size={140} payload={application.esim.qrPayload} />
              <p className="qr-card__note">eSIM QR</p>
            </div>
          )}
        </div>

        {showUsage && (
          <div className="mt-5">
            <UsageCard application={application} />
          </div>
        )}

        <div className="mt-5">
          <SummaryCard
            productId={application.productId}
            options={application.options}
            direction={application.direction}
            destinationCode={application.destinationCode}
            travel={{ start: application.applicant.travelStart, end: application.applicant.travelEnd }}
          />
        </div>

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

        {canActivate && (
          <Button full className="mt-5" onClick={() => navigate(`/activate?id=${application.id}`)}>
            {UI.cta.activate}
          </Button>
        )}
      </Container>
    </div>
  )
}
