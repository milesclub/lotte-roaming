import { getUI } from '../content'
import type { Product, ProductOptions, ReceiveMethodOpt } from './domain'
import type { Network, PlanConfig, SimType } from './types'

// Maps domain values → localized display labels (single source for the copy).

// Per-day data label for a daily plan: 500MB / 1GB / 무제한 …
export function dailyDataText(plan: { gbPerDay?: number; unlimited?: boolean }): string {
  if (plan.unlimited) return getUI().product.unlimited
  const gb = plan.gbPerDay ?? 0
  return gb < 1 ? `${Math.round(gb * 1000)}MB` : `${gb}GB`
}

export function planSummary(plan: PlanConfig): string {
  const UI = getUI()
  if (plan.type === 'daily') {
    return `${dailyDataText(plan)} · ${UI.product.daysUnit(plan.days ?? 0)}`
  }
  return `${UI.product.totalGb(plan.totalGb ?? 0)} · ${UI.product.daysUnit(plan.validityDays ?? 0)}`
}

// Per-day price multiplier by data tier (2GB = 1.0 reference = product.priceKRW).
function dailyTierFactor(plan: { gbPerDay?: number; unlimited?: boolean }): number {
  if (plan.unlimited) return 1.8
  const gb = plan.gbPerDay ?? 0
  if (gb <= 0.5) return 0.5
  if (gb <= 1) return 0.7
  if (gb <= 2) return 1
  return 1.3 // 3GB
}

export const simLabel = (s: SimType): string => getUI().sim[s]
export const networkLabel = (n: Network): string => getUI().network[n]
export const receiveLabel = (r: ReceiveMethodOpt): string => getUI().receive[r]

export function optionsSummary(o: ProductOptions): string {
  return `${simLabel(o.simType)} · ${planSummary(o.plan)} · ${networkLabel(o.network)}`
}

// Renders price or the "₩—" placeholder while prices are unset.
export function priceText(priceKRW: number | null): string {
  return priceKRW == null ? '₩—' : `₩${priceKRW.toLocaleString()}`
}

// Unit prices live on the product: dailyKRW (per day, 2GB tier) / volumeKRW
// (per GB). The total depends on the chosen plan (days × per-day, GB × per-GB).
type PriceFields = Pick<Product, 'dailyKRW' | 'volumeKRW'>

export function planPrice(product: PriceFields, plan: PlanConfig): number | null {
  if (plan.type === 'daily') {
    // per-day price scales with the data tier; total = per-day × days
    const perDay = Math.round((product.dailyKRW * dailyTierFactor(plan)) / 100) * 100
    return perDay * (plan.days ?? 0)
  }
  // Volume: per-GB pool price; a shorter validity (15d) costs less than 30d.
  const base = product.volumeKRW * (plan.totalGb ?? 0)
  const factor = plan.validityDays === 15 ? 0.85 : 1
  return Math.round((base * factor) / 100) * 100
}

export function planPriceText(product: PriceFields, plan: PlanConfig): string {
  return priceText(planPrice(product, plan))
}
