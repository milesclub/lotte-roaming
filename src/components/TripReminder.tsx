import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BellRing, X } from 'lucide-react'
import { useUI } from '../content'
import { listApplications } from '../lib/applications'

function daysUntil(dateStr: string, now: Date): number | null {
  const d = new Date(`${dateStr}T00:00:00`)
  if (isNaN(d.getTime())) return null
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((d.getTime() - today.getTime()) / 86_400_000)
}

// Pre-trip / in-trip reminder driven by the latest application's travel dates.
// A lightweight in-app stand-in for the lifecycle push (see lib/push.ts).
export default function TripReminder() {
  const UI = useUI()
  const navigate = useNavigate()
  const latest = listApplications()[0]
  const [closed, setClosed] = useState(() =>
    latest ? sessionStorage.getItem(`lr.reminderDismiss.${latest.id}`) === '1' : true,
  )

  if (!latest || closed) return null

  const now = new Date()
  const start = daysUntil(latest.applicant?.travelStart || latest.createdAt.slice(0, 10), now)
  const end = daysUntil(latest.applicant?.travelEnd || '', now)
  if (start === null) return null

  let message: string
  if (start > 1) message = UI.reminder.upcoming(start)
  else if (start === 1) message = UI.reminder.tomorrow
  else if (start <= 0 && (end === null || end >= 0)) message = UI.reminder.active
  else return null // trip is over

  const dismiss = () => {
    sessionStorage.setItem(`lr.reminderDismiss.${latest.id}`, '1')
    setClosed(true)
  }

  return (
    <div className="trip-reminder">
      <span className="trip-reminder__icon" aria-hidden>
        <BellRing size={16} />
      </span>
      <span className="trip-reminder__text">{message}</span>
      <button
        type="button"
        className="trip-reminder__cta"
        onClick={() => navigate(`/applications/${latest.id}`)}
      >
        {UI.reminder.cta}
      </button>
      <button type="button" className="trip-reminder__close" onClick={dismiss} aria-label="close">
        <X size={15} />
      </button>
    </div>
  )
}
