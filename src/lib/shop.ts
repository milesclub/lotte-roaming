import { BENEFITS, NOTICES, PRODUCTS } from '../data/products'
import { DESTINATIONS, KOREA_AREAS, REGIONS } from '../data/destinations'
import { PARTNER_BENEFITS } from '../data/partners'
import type {
  Benefit,
  Destination,
  Notice,
  PartnerBenefit,
  Product,
  ProductOptions,
  Region,
  RegionId,
  TravelArea,
  TravelDirection,
} from './domain'
import type { PlanConfig } from './types'

// Catalog service — the only place screens read destinations/products from, so a
// real catalog API can replace the data files without touching the UI.

// Volume plans let the user choose the validity window + data pool size
// (same options everywhere).
export const VALIDITY_OPTIONS = [15, 30] as const
export const VOLUME_GB_OPTIONS = [3, 5, 10, 20, 30, 50] as const

// Daily plans let the user choose the per-day data amount (same options
// everywhere). 'unlimited' = no daily cap.
export interface DataOption {
  id: string
  gbPerDay: number // 0 when unlimited
  unlimited: boolean
}
export const DAILY_DATA_OPTIONS: DataOption[] = [
  { id: '500mb', gbPerDay: 0.5, unlimited: false },
  { id: '1gb', gbPerDay: 1, unlimited: false },
  { id: '2gb', gbPerDay: 2, unlimited: false },
  { id: '3gb', gbPerDay: 3, unlimited: false },
  { id: 'unlimited', gbPerDay: 0, unlimited: true },
]

export function dataOption(id: string): DataOption {
  return DAILY_DATA_OPTIONS.find((o) => o.id === id) ?? DAILY_DATA_OPTIONS[2]
}
export function dataIdFor(gbPerDay?: number, unlimited?: boolean): string {
  if (unlimited) return 'unlimited'
  return DAILY_DATA_OPTIONS.find((o) => !o.unlimited && o.gbPerDay === gbPerDay)?.id ?? '2gb'
}

export function getRegions(): Region[] {
  return REGIONS
}

export function getDestinations(): Destination[] {
  return DESTINATIONS
}

export function getPopularDestinations(): Destination[] {
  return DESTINATIONS.filter((d) => d.popular)
}

export function getDestination(code: string | null | undefined): Destination | undefined {
  if (!code) return undefined
  return DESTINATIONS.find((d) => d.code === code)
}

export function destinationsByRegion(regionId: RegionId): Destination[] {
  return DESTINATIONS.filter((d) => d.regionId === regionId)
}

function coversRegion(product: Product, regionId: RegionId): boolean {
  return product.coverage === 'global' || product.coverage.includes(regionId)
}

// Products available for a destination (or all when none selected).
export function getProducts(destinationCode?: string | null): Product[] {
  const dest = getDestination(destinationCode)
  if (!dest) return PRODUCTS
  return PRODUCTS.filter((p) => coversRegion(p, dest.regionId))
}

// Direction-aware product list. Inbound → Korea products; outbound → products
// covering the selected overseas destination's region (or all outbound products).
export function getProductsFor(direction: TravelDirection, destinationCode?: string | null): Product[] {
  const byDir = PRODUCTS.filter((p) => p.directions.includes(direction))
  if (direction === 'inbound') return byDir
  const dest = getDestination(destinationCode)
  if (!dest) return byDir
  return byDir.filter((p) => coversRegion(p, dest.regionId))
}

// Selectable areas for the landing: Korea areas (inbound) or overseas countries
// (outbound), normalized to a common shape.
export function getAreas(direction: TravelDirection): TravelArea[] {
  if (direction === 'inbound') return KOREA_AREAS
  return DESTINATIONS.map((d) => ({
    code: d.code,
    name: d.name,
    emoji: d.flag,
    popular: d.popular,
  }))
}

export function getPopularAreas(direction: TravelDirection): TravelArea[] {
  return getAreas(direction).filter((a) => a.popular)
}

export function getArea(direction: TravelDirection, code: string | null | undefined): TravelArea | undefined {
  if (!code) return undefined
  return getAreas(direction).find((a) => a.code === code)
}

export function partnersFor(direction: TravelDirection): PartnerBenefit[] {
  return PARTNER_BENEFITS.filter((b) => b.directions.includes(direction))
}

export function getProduct(id: string | null | undefined): Product | undefined {
  if (!id) return undefined
  return PRODUCTS.find((p) => p.id === id)
}

export function benefitsFor(product: Product): Benefit[] {
  return product.benefitIds.map((id) => BENEFITS[id]).filter(Boolean)
}

export function noticesFor(product: Product): Notice[] {
  return product.noticeIds.map((id) => NOTICES[id]).filter(Boolean)
}

// Seeds sensible default options when a product is selected.
export function defaultOptionsFor(product: Product): ProductOptions {
  const simType = product.simTypes[0]
  const plan: PlanConfig =
    product.kind === 'volume'
      ? { type: 'volume', totalGb: product.totalGb, validityDays: product.validityDays }
      : { type: 'daily', gbPerDay: product.dailyGb, days: product.defaultDays }
  return {
    simType,
    plan,
    network: product.networks[0],
    receiveMethod: simType === 'esim' ? 'esim_qr' : 'delivery',
  }
}
