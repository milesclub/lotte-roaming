import { useNavigate } from 'react-router-dom'
import { Gauge, Infinity as InfinityIcon, AlertTriangle } from 'lucide-react'
import Button from './Button'
import { useUI } from '../content'
import { usageFor } from '../lib/usage'
import { cn } from '../lib/cn'
import type { Application } from '../lib/domain'

// A periodic wave surface, two periods wide, closed to the bottom. Animated
// horizontally so the liquid top undulates; the parent <g> sets the fill level.
const WAVE = 'M0,6 c12.5,-6 37.5,-6 50,0 c12.5,6 37.5,6 50,0 c12.5,-6 37.5,-6 50,0 c12.5,6 37.5,6 50,0 V100 H0 Z'

// Live(-ish) data usage panel for an active plan. Shows a liquid-fill gauge of
// remaining data, the period progress, a low-data alert, and a top-up CTA.
export default function UsageCard({ application }: { application: Application }) {
  const UI = useUI()
  const navigate = useNavigate()
  const u = usageFor(application)

  const topUp = () => navigate(`/roaming/${application.productId}`)
  // Liquid level = remaining proportion (keep a sliver visible at the extremes).
  const fill = u.unlimited ? 100 : Math.max(4, Math.min(100, 100 - u.percentUsed))
  const fillStyle = { ['--fill' as string]: `${fill}` }

  return (
    <div className="usage-card">
      <div className="usage-card__head">
        <span className="usage-card__title">
          <Gauge size={16} /> {UI.usage.title}
        </span>
        <span className={`usage-card__period ${u.expired ? 'is-expired' : ''}`}>
          {u.expired
            ? UI.usage.expired
            : u.kind === 'daily'
              ? UI.usage.dayOf(u.daysElapsed + 1, u.daysTotal)
              : UI.usage.daysLeft(u.daysLeft)}
        </span>
      </div>

      <div className="usage-card__body">
        <div className={cn('usage-liquid', u.low && 'is-low')} style={fillStyle}>
          <svg className="usage-liquid__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <g transform={`translate(0 ${100 - fill})`}>
              <path className="usage-liquid__wave usage-liquid__wave--back" d={WAVE}>
                <animateTransform attributeName="transform" type="translate" from="0 0" to="-100 0" dur="8s" repeatCount="indefinite" />
              </path>
              <path className="usage-liquid__wave usage-liquid__wave--front" d={WAVE}>
                <animateTransform attributeName="transform" type="translate" from="-100 0" to="0 0" dur="5s" repeatCount="indefinite" />
              </path>
            </g>
          </svg>
          {/* Two label layers; the light one is clipped to the liquid area so the
              number stays legible whether it sits over the fill or the empty top. */}
          <div className="usage-liquid__label usage-liquid__label--dark" aria-hidden={u.unlimited}>
            {u.unlimited ? (
              <InfinityIcon size={26} />
            ) : (
              <>
                <span className="usage-liquid__num">{u.remainingGb}</span>
                <span className="usage-liquid__unit">GB</span>
              </>
            )}
          </div>
          <div className="usage-liquid__label usage-liquid__label--light">
            {u.unlimited ? (
              <InfinityIcon size={26} />
            ) : (
              <>
                <span className="usage-liquid__num">{u.remainingGb}</span>
                <span className="usage-liquid__unit">GB</span>
              </>
            )}
          </div>
        </div>

        <div className="usage-card__meta">
          {u.unlimited ? (
            <>
              <div className="usage-stat">
                <span className="usage-stat__label">{UI.usage.usedTotal}</span>
                <span className="usage-stat__value">{u.usedGb} GB</span>
              </div>
              <div className="usage-stat">
                <span className="usage-stat__label">{UI.usage.plan}</span>
                <span className="usage-stat__value">{UI.product.unlimited}</span>
              </div>
            </>
          ) : (
            <>
              <div className="usage-stat">
                <span className="usage-stat__label">
                  {u.kind === 'daily' ? UI.usage.remainingToday : UI.usage.remaining}
                </span>
                <span className="usage-stat__value">
                  {u.remainingGb} / {u.totalGb} GB {fill < 100 ? `· ${fill}%` : ''}
                </span>
              </div>
              <div className="usage-stat">
                <span className="usage-stat__label">{UI.usage.used}</span>
                <span className="usage-stat__value">{u.usedGb} GB</span>
              </div>
            </>
          )}
        </div>
      </div>

      {u.low && !u.expired && (
        <div className="usage-alert">
          <AlertTriangle size={15} />
          <span>{UI.usage.lowWarning}</span>
        </div>
      )}

      <Button full variant="secondary" className="usage-card__topup" onClick={topUp}>
        {UI.usage.topUp}
      </Button>
    </div>
  )
}
