// Commerce domain for the destination-based roaming application flow.
// Everything the UI renders (destinations, products, benefits, notices, status)
// is modelled here and supplied by the data + service layers — never hardcoded
// in components.

import type { Network, PlanConfig, SimType, EsimProfile, Receive } from './types'

// Travel direction drives the whole landing experience.
export type TravelDirection = 'inbound' | 'outbound'

// Lotte partner-benefit categories shown on the landing.
export type PartnerCategory = 'shopping' | 'tour' | 'stay' | 'dutyfree' | 'lpoint'

export interface PartnerBenefit {
  id: string
  category: PartnerCategory
  directions: TravelDirection[]
  // display text comes from the locale catalog (catalog.partners[id])
  title: string
  desc: string
}

// A selectable area/destination on the landing (Korea areas for inbound,
// overseas countries for outbound).
export interface TravelArea {
  code: string
  name: string
  emoji: string
  popular?: boolean
}

export type RegionId =
  | 'korea'
  | 'japan'
  | 'china'
  | 'asia'
  | 'sea'
  | 'americas'
  | 'europe'
  | 'oceania'

export interface Region {
  id: RegionId
  name: string
}

export interface Destination {
  code: string // ISO-ish code, e.g. "JP"
  name: string
  regionId: RegionId
  flag: string // emoji flag (text-based asset, no external file)
  popular?: boolean
}

export type ProductKind = 'daily' | 'volume' | 'unlimited'

export interface Product {
  id: string
  kind: ProductKind
  name: string
  tagline: string
  // Data spec — only values present in the brief are used; price stays null.
  dailyGb?: number
  defaultDays?: number
  totalGb?: number
  validityDays?: number
  throttleNote?: string
  simTypes: SimType[]
  networks: Network[]
  // Which travel directions this product serves.
  directions: TravelDirection[]
  // 'global' covers every destination; otherwise the regions it serves.
  coverage: 'global' | RegionId[]
  benefitIds: string[]
  noticeIds: string[]
  badge?: string
  recommended?: boolean
  priceKRW: number | null // null → "요금 안내 예정"
}

export interface Benefit {
  id: string
  icon: 'point' | 'gift' | 'percent' | 'shield' | 'sparkles' | 'card'
  title: string
  desc: string
}

export interface Notice {
  id: string
  text: string
}

export interface FaqItem {
  q: string
  a: string
}

// ── Application (신청) ───────────────────────────────────────────────────
export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'pending_payment'
  | 'pending_provisioning'
  | 'completed'
  | 'failed'

export interface ProductOptions {
  simType: SimType
  plan: PlanConfig
  network: Network
  receiveMethod?: ReceiveMethodOpt
}

export type ReceiveMethodOpt = 'esim_qr' | 'delivery' | 'airport_pickup'

export interface ApplicantInfo {
  name: string
  email: string
  phone: string
  travelStart: string // yyyy-mm-dd
  travelEnd: string // yyyy-mm-dd
  address?: string // for USIM delivery
}

export interface Application {
  id: string
  createdAt: string
  direction: TravelDirection
  destinationCode: string
  productId: string
  options: ProductOptions
  applicant: ApplicantInfo
  status: ApplicationStatus
  priceKRW: number | null
  esim?: EsimProfile
  receive?: Receive
}
