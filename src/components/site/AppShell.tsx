import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import BottomNav from './BottomNav'
import { useAuth } from '../../store/auth'
import { cn } from '../../lib/cn'

// Top-level routes keep the footer + bottom tab bar; sub-pages (detail / flows)
// are focused, so on mobile the footer is hidden and the page owns the bottom.
const TOP_LEVEL = new Set(['/', '/travel', '/applications'])

// Full responsive web shell: soft-gray feed background with white cards; mobile
// gets a bottom tab bar, desktop a top nav.
export default function AppShell() {
  const hydrate = useAuth((s) => s.hydrate)
  const location = useLocation()
  useEffect(() => {
    void hydrate()
  }, [hydrate])

  const isSub = !TOP_LEVEL.has(location.pathname)

  return (
    <div className={cn('app-shell', isSub && 'app-shell--sub')}>
      <SiteHeader />
      <main className="app-main">
        {/* keyed by path so each navigation replays the route-fade animation */}
        <div key={location.pathname} className="route-fade">
          <Outlet />
        </div>
      </main>
      <SiteFooter />
      <BottomNav />
      <ScrollRestoration />
    </div>
  )
}
