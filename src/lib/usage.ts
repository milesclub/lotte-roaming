import type { Application } from './domain'
import type { PlanConfig } from './types'

// Mock data-usage model for an active plan. There is no live metering backend
// yet, so usage is derived deterministically from the application id + plan +
// travel dates: stable across refreshes, plausible-looking, and advancing with
// the calendar. Swap this for the carrier usage feed behind the same shape.

export interface UsageSnapshot {
  kind: 'daily' | 'volume'
  unlimited: boolean
  // Period
  daysTotal: number
  daysElapsed: number // clamped to [0, daysTotal]
  daysLeft: number
  // Data (GB). For daily these describe *today*; for volume the whole pool.
  totalGb: number
  usedGb: number
  remainingGb: number
  percentUsed: number // 0–100
  perDayGb: number // daily only (0 when unlimited)
  low: boolean // remaining is running out
  expired: boolean
}

// Deterministic 0–1 from a string (no Math.random — survives refresh).
function hash01(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 1000) / 1000
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / 86_400_000)
}

const round1 = (n: number) => Math.round(n * 10) / 10

export function usageFor(app: Application, now: Date = new Date()): UsageSnapshot {
  const plan: PlanConfig = app.options.plan
  const kind = plan.type
  const unlimited = !!plan.unlimited

  const daysTotal = Math.max(1, kind === 'daily' ? plan.days ?? 1 : plan.validityDays ?? 1)

  // Anchor the period at the travel start (fallback: order date).
  const startStr = app.applicant?.travelStart || app.createdAt.slice(0, 10)
  const start = new Date(`${startStr}T00:00:00`)
  const rawElapsed = isNaN(start.getTime()) ? 0 : daysBetween(start, now)
  const daysElapsed = Math.min(Math.max(rawElapsed, 0), daysTotal)
  const daysLeft = Math.max(0, daysTotal - daysElapsed)
  const expired = rawElapsed >= daysTotal

  const seed = hash01(app.id)

  if (kind === 'daily') {
    const perDayGb = unlimited ? 0 : plan.gbPerDay ?? 1
    if (unlimited) {
      // No cap — report cumulative usage instead of a remaining bar.
      const usedGb = round1((daysElapsed + seed) * (1.2 + seed))
      return {
        kind, unlimited: true, daysTotal, daysElapsed, daysLeft,
        totalGb: 0, usedGb, remainingGb: 0, percentUsed: 0, perDayGb: 0,
        low: false, expired,
      }
    }
    // Today's allowance + today's consumption.
    const fracToday = expired ? 1 : 0.25 + seed * 0.6
    const usedGb = round1(Math.min(perDayGb, perDayGb * fracToday))
    const remainingGb = round1(Math.max(0, perDayGb - usedGb))
    const percentUsed = Math.round((usedGb / perDayGb) * 100)
    return {
      kind, unlimited: false, daysTotal, daysElapsed, daysLeft,
      totalGb: perDayGb, usedGb, remainingGb, percentUsed, perDayGb,
      low: !expired && remainingGb <= perDayGb * 0.15, expired,
    }
  }

  // Volume — one pool drained over the validity window.
  const totalGb = plan.totalGb ?? 1
  const progress = daysTotal > 0 ? daysElapsed / daysTotal : 0
  // Usage tracks elapsed time with a per-user lean (some travelers burn faster).
  const frac = expired ? Math.min(1, 0.85 + seed * 0.15) : Math.min(1, progress * (0.7 + seed * 0.7))
  const usedGb = round1(totalGb * frac)
  const remainingGb = round1(Math.max(0, totalGb - usedGb))
  const percentUsed = Math.round((usedGb / totalGb) * 100)
  return {
    kind, unlimited: false, daysTotal, daysElapsed, daysLeft,
    totalGb, usedGb, remainingGb, percentUsed, perDayGb: 0,
    low: !expired && remainingGb <= totalGb * 0.15, expired,
  }
}
