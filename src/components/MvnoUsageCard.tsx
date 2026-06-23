import { Gauge, Infinity as InfinityIcon, AlertTriangle } from 'lucide-react'
import { useUI } from '../content'
import { mvnoUsageFor } from '../lib/mvnoUsage'
import { cn } from '../lib/cn'
import type { MvnoSubscription } from '../lib/mvno'

const WAVE = 'M0,6 c12.5,-6 37.5,-6 50,0 c12.5,6 37.5,6 50,0 c12.5,-6 37.5,-6 50,0 c12.5,6 37.5,6 50,0 V100 H0 Z'

// Monthly data-usage gauge for an MVNO subscription (reuses the liquid gauge).
export default function MvnoUsageCard({ subscription }: { subscription: MvnoSubscription }) {
  const UI = useUI()
  const u = mvnoUsageFor(subscription)
  const fill = u.unlimited ? 100 : Math.max(4, Math.min(100, 100 - u.percentUsed))
  const fillStyle = { ['--fill' as string]: `${fill}` }

  return (
    <div className="usage-card">
      <div className="usage-card__head">
        <span className="usage-card__title">
          <Gauge size={16} /> {UI.mvno.usageTitle}
        </span>
        <span className="usage-card__period">{UI.usage.daysLeft(u.daysLeft)}</span>
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
            <div className="usage-stat">
              <span className="usage-stat__label">{UI.usage.usedTotal}</span>
              <span className="usage-stat__value">{u.usedGb} GB</span>
            </div>
          ) : (
            <>
              <div className="usage-stat">
                <span className="usage-stat__label">{UI.usage.remaining}</span>
                <span className="usage-stat__value">
                  {u.remainingGb} / {u.totalGb} GB
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

      {u.low && (
        <div className="usage-alert">
          <AlertTriangle size={15} />
          <span>{UI.mvno.lowWarning}</span>
        </div>
      )}
    </div>
  )
}
