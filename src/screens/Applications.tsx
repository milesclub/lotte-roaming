import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Inbox } from 'lucide-react'
import Container from '../components/site/Container'
import PageHeader from '../components/site/PageHeader'
import StatusBadge from '../components/ui/StatusBadge'
import Button from '../components/Button'
import { useUI } from '../content'
import { useAuth } from '../store/auth'
import { listApplications } from '../lib/applications'
import { getProduct } from '../lib/shop'
import { optionsSummary } from '../lib/labels'
import { destinationDisplay, productName } from '../lib/localize'

export default function Applications() {
  const UI = useUI()
  const navigate = useNavigate()
  const apps = listApplications()
  const user = useAuth((s) => s.user)
  const signOut = useAuth((s) => s.signOut)

  return (
    <div>
      <PageHeader title={UI.applications.title} subtitle={UI.applications.subtitle} />
      <Container className="browse-body">
        {user && (
          <div className="account-row">
            <span className="account-row__id">
              <span className="account-row__avatar" aria-hidden>
                {user.name.charAt(0)}
              </span>
              <span className="account-row__who">
                <span className="account-row__name">{user.name}</span>
                {user.email && <span className="account-row__email">{user.email}</span>}
              </span>
            </span>
            <button
              type="button"
              className="account-row__signout"
              onClick={() => {
                signOut()
                navigate('/')
              }}
            >
              {UI.nav.signOut}
            </button>
          </div>
        )}
        {apps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <Inbox size={22} />
            </div>
            <p className="empty-state__text">{UI.applications.empty}</p>
            <Button className="mt-4" onClick={() => navigate('/')}>
              {UI.applications.emptyCta}
            </Button>
          </div>
        ) : (
          <div className="applist">
            {apps.map((app) => {
              const product = getProduct(app.productId)
              return (
                <Link key={app.id} to={`/applications/${app.id}`} className="app-card">
                  <div className="app-card__head">
                    <span className="app-card__id">{app.id}</span>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="app-card__title">
                    <span aria-hidden>{destinationDisplay(app.direction, app.destinationCode).emoji}</span>
                    {product ? productName(product) : '—'}
                  </div>
                  <div className="app-card__desc">{optionsSummary(app.options)}</div>
                  <div className="app-card__meta">
                    <span>
                      {UI.applications.appliedAt} {app.createdAt.slice(0, 10)}
                    </span>
                    <ChevronRight size={16} />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </Container>
    </div>
  )
}
