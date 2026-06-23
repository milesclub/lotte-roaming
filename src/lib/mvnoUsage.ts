import type { MvnoSubscription } from './mvno'
import { getPlan } from './mvno'

// Mock monthly data-usage snapshot for an MVNO subscription. Derived
// deterministically from the subscription id + billing cycle (no live metering
// backend yet) — stable, plausible, and advancing with the calendar.

export interface MvnoUsageSnapshot {
  unlimited: boolean
  totalGb: number
  usedGb: number
  remainingGb: number
  percentUsed: number // 0–100
  daysTotal: number
  daysElapsed: number
  daysLeft: number
  low: boolean
}

function hash01(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return ((h >>> 0) % 1000) / 1000
}

const round1 = (n: number) => Math.round(n * 10) / 10

export function mvnoUsageFor(sub: MvnoSubscription, now: Date = new Date()): MvnoUsageSnapshot {
  const plan = getPlan(sub.planId)
  const unlimited = !!plan?.unlimitedData
  const totalGb = plan?.dataGb ?? 0

  // Current billing cycle ends on nextBillingDate; starts a month earlier.
  const end = new Date(`${sub.nextBillingDate}T00:00:00`)
  const start = new Date(end)
  start.setMonth(start.getMonth() - 1)
  const day = 86_400_000
  const daysTotal = Math.max(1, Math.round((end.getTime() - start.getTime()) / day))
  const elapsedRaw = Math.round((now.getTime() - start.getTime()) / day)
  const daysElapsed = Math.min(Math.max(elapsedRaw, 0), daysTotal)
  const daysLeft = Math.max(0, daysTotal - daysElapsed)

  const seed = hash01(sub.id)

  if (unlimited || totalGb <= 0) {
    const usedGb = round1((daysElapsed + seed) * (1.4 + seed))
    return {
      unlimited: true,
      totalGb: 0,
      usedGb,
      remainingGb: 0,
      percentUsed: 0,
      daysTotal,
      daysElapsed,
      daysLeft,
      low: false,
    }
  }

  const progress = daysElapsed / daysTotal
  const frac = Math.min(1, progress * (0.6 + seed * 0.8))
  const usedGb = round1(totalGb * frac)
  const remainingGb = round1(Math.max(0, totalGb - usedGb))
  const percentUsed = Math.round((usedGb / totalGb) * 100)
  return {
    unlimited: false,
    totalGb,
    usedGb,
    remainingGb,
    percentUsed,
    daysTotal,
    daysElapsed,
    daysLeft,
    low: remainingGb <= totalGb * 0.15 && daysLeft > 0,
  }
}
