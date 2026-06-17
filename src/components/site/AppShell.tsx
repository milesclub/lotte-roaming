import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import BottomNav from './BottomNav'
import { useAuth } from '../../store/auth'

// Full responsive web shell: soft-gray feed background with white cards; mobile
// gets a bottom tab bar, desktop a top nav.
export default function AppShell() {
  const hydrate = useAuth((s) => s.hydrate)
  const location = useLocation()
  useEffect(() => {
    void hydrate()
  }, [hydrate])

  return (
    <div className="app-shell">
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
