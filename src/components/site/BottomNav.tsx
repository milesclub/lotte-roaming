import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Home, Compass, ReceiptText, UserRound, type LucideIcon } from 'lucide-react'
import { useUI } from '../../content'
import { useAuth } from '../../store/auth'

// Tab destinations are the only top-level routes; everything else is a sub-page
// where the bottom nav is hidden (mobile) so the page can stand on its own.
const TOP_LEVEL = new Set(['/', '/travel', '/applications'])

export default function BottomNav() {
  const UI = useUI()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuth((s) => s.user)

  if (!TOP_LEVEL.has(location.pathname)) return null

  const TABS: { to: string; label: string; Icon: LucideIcon; end: boolean }[] = [
    { to: '/', label: UI.nav.home, Icon: Home, end: true },
    { to: '/travel', label: UI.nav.browse, Icon: Compass, end: false },
    { to: '/applications', label: UI.nav.applications, Icon: ReceiptText, end: false },
  ]

  return (
    <nav className="bottom-nav">
      {TABS.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => (isActive ? 'bottom-nav__item is-active' : 'bottom-nav__item')}
        >
          <Icon size={22} strokeWidth={2} />
          <span className="bottom-nav__label">{label}</span>
        </NavLink>
      ))}

      {/* Logged in → the MY tab is the account; only show a sign-in entry here
          when logged out (no more MY/Account overlap). */}
      {!user && (
        <button
          type="button"
          onClick={() => navigate(`/signin?next=${encodeURIComponent(location.pathname)}`)}
          className="bottom-nav__item"
        >
          <UserRound size={22} strokeWidth={2} />
          <span className="bottom-nav__label">{UI.nav.login}</span>
        </button>
      )}
    </nav>
  )
}
