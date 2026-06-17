// DTOs shared with the client (kept structurally identical to src/lib/types.ts
// and src/lib/auth.ts on the client).

export type AuthProvider = 'kakao' | 'line' | 'google' | 'apple' | 'wechat' | 'email'

export interface AuthUser {
  id: string
  provider: AuthProvider
  name: string
  email?: string
  lpointLinked: boolean
  isNew: boolean
}

export type SimType = 'esim' | 'usim'
export type PlanType = 'daily' | 'volume'
export type Network = 'roaming' | 'skt_local'
export type PaymentMethod = 'intl_card' | 'alipay' | 'wechat' | 'kr_easy'

export interface PlanConfig {
  type: PlanType
  gbPerDay?: number
  days?: number
  totalGb?: number
  validityDays?: number
}

export interface Order {
  simType: SimType
  plan: PlanConfig
  network: Network
  receive?: { method: 'airport_pickup' | 'delivery'; code?: string }
  payment?: PaymentMethod
  priceKRW: number | null
  currency: string
  status: 'cart' | 'paid' | 'failed'
}

export interface EsimProfile {
  iccid: string
  activationCode: string
  qrPayload: string
}

export interface PaymentResult {
  ok: boolean
  transactionId?: string
  declineReason?: string
}

export type PushTrigger = 'arrival' | 'nearby' | 'predeparture'
