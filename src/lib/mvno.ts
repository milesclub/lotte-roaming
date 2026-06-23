import type { SimType } from './types'
import { MVNO_PLANS } from '../data/mvnoPlans'

// ── Domestic MVNO (알뜰폰) — monthly mobile plans for residents ──────────────
// A second product pillar alongside travel roaming. Recurring monthly plans
// (data + voice + SMS) on a host carrier's network. Demo data; prices are
// illustrative samples and benefits stay "to be announced".

export type MvnoNetwork = 'KT' | 'SKT' | 'LGU'
export type MvnoTech = 'lte' | '5g'
export type PortType = 'port' | 'new' // 번호이동 / 신규
export type MvnoStatus = 'submitted' | 'pending_activation' | 'active' | 'failed'
export type PayMethod = 'card' | 'bank'

export interface MvnoPlan {
  id: string
  name: string
  tagline: string
  network: MvnoNetwork
  tech: MvnoTech
  dataGb: number // monthly GB (0 when unlimited)
  unlimitedData: boolean
  afterMbps?: number // throttle speed after the monthly cap (Mbps)
  voiceMin: number // 0 when unlimited
  unlimitedVoice: boolean
  smsCount: number // 0 when unlimited
  unlimitedSms: boolean
  monthlyKRW: number
  promoKRW?: number // promotional monthly price for the first promoMonths
  promoMonths?: number
  perkIds: string[]
  badge?: string
  recommended?: boolean
}

export interface MvnoOptions {
  simType: SimType
  portType: PortType
  receiveMethod: 'esim_qr' | 'delivery'
}

export interface MvnoApplicant {
  name: string
  birth: string // YYYY-MM-DD (KYC)
  phone: string // current (port) or desired number
  currentCarrier?: string // when porting
  email: string
  address?: string // for USIM delivery
  payMethod: PayMethod
}

export interface MvnoSubscription {
  id: string
  createdAt: string
  planId: string
  options: MvnoOptions
  applicant: MvnoApplicant
  status: MvnoStatus
  monthlyKRW: number
  nextBillingDate: string // yyyy-mm-dd
}

export const MVNO_NETWORKS: MvnoNetwork[] = ['KT', 'SKT', 'LGU']

export function listPlans(): MvnoPlan[] {
  return MVNO_PLANS
}

export function getPlan(id: string | null | undefined): MvnoPlan | undefined {
  if (!id) return undefined
  return MVNO_PLANS.find((p) => p.id === id)
}

export interface PlanFilter {
  tech?: MvnoTech | 'all'
  network?: MvnoNetwork | 'all'
  minData?: number // GB; 0 = any (unlimited always passes)
}

export function filterPlans(f: PlanFilter): MvnoPlan[] {
  return MVNO_PLANS.filter((p) => {
    if (f.tech && f.tech !== 'all' && p.tech !== f.tech) return false
    if (f.network && f.network !== 'all' && p.network !== f.network) return false
    if (f.minData && !p.unlimitedData && p.dataGb < f.minData) return false
    return true
  })
}

export function planMonthly(plan: MvnoPlan): number {
  return plan.promoKRW ?? plan.monthlyKRW
}

// First billing date ≈ one month after sign-up (demo).
export function nextBillingFrom(iso: string): string {
  const d = new Date(iso)
  d.setMonth(d.getMonth() + 1)
  return d.toISOString().slice(0, 10)
}
