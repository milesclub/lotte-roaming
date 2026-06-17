import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { UserRound, ChevronLeft } from 'lucide-react'
import Logo from '../Logo'
import Container from './Container'
import LangSwitch from './LangSwitch'
import { useUI } from '../../content'
import { useAuth } from '../../store/auth'
import { cn } from '../../lib/cn'

const NAV = [
  { to: '/', key: 'home', end: true },
  { to: '/travel', key: 'browse', end: false },
  { to: '/applications', key: 'applications', end: false },
] as const

// Top-level routes show the brand; everything else is a sub-page that, on
// mobile, turns the header into a back-navigation bar.
const TOP_LEVEL = new Set(['/', '/travel', '/applications'])

export default function SiteHeader() {
  const UI = useUI()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuth((s) => s.user)
  const goAccount = () =>
    navigate(user ? '/applications' : `/signin?next=${encodeURIComponent(location.pathname)}`)
  const isSub = !TOP_LEVEL.has(location.pathname)
  const goBack = () => navigate(-1)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Hide the header on scroll down, reveal on scroll up (L.POINT-style).
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 4)
      if (y > last && y > 80) setHidden(true)
      else if (y < last - 4) setHidden(false)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'site-header',
        hidden && 'is-hidden',
        scrolled && 'is-scrolled',
        isSub && 'is-sub',
      )}
    >
      <Container size="wide">
        <div className="site-header__inner">
          {isSub && (
            <button type="button" className="header-back" onClick={goBack} aria-label="Back">
              <ChevronLeft size={24} strokeWidth={2.4} />
            </button>
          )}

          <Link to="/" className="brand">
            <Logo size={30} />
            <span className="brand__name">{UI.brand.name}</span>
            {/* <span className="brand__tag">{UI.brand.affiliate}</span> */}
          </Link>

          <nav className="nav">
            {NAV.map((n) => (
              <NavLink
                key={n.key}
                to={n.to}
                end={n.end}
                className={({ isActive }) => (isActive ? 'nav__link is-active' : 'nav__link')}
              >
                {UI.nav[n.key]}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <LangSwitch />
            <button type="button" onClick={goAccount} className="account-btn">
              <UserRound size={16} strokeWidth={2.2} />
              <span className="account-btn__name">{user ? user.name : UI.nav.login}</span>
            </button>
          </div>
        </div>
      </Container>
    </header>
  )
}
