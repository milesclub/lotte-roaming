// Domain model for the LOTTE ROAMING purchase flow.
// Mirrors the data model in the build brief; the two branches that drive the
// whole journey are SimType (how you receive) and PlanType (how data meters).

export type SimType = 'esim' | 'usim'
export type PlanType = 'daily' | 'volume'
// Roaming over partner carriers, or a local-partner network at the destination.
export type Network = 'roaming' | 'local'
export type ReceiveMethod = 'airport_pickup' | 'delivery'
export type PaymentMethod = 'intl_card' | 'alipay' | 'wechat' | 'kr_easy'
export type OrderStatus = 'cart' | 'paid' | 'failed'

export interface PlanConfig {
  type: PlanType
  // Daily plans
  gbPerDay?: number
  days?: number
  unlimited?: boolean // daily: unlimited per-day data
  // Volume plans
  totalGb?: number
  validityDays?: number
}

export interface Receive {
  method: ReceiveMethod
  code?: string // pickup code, e.g. "LR-4827"
}

export interface Order {
  simType: SimType
  plan: PlanConfig
  network: Network
  receive?: Receive
  payment?: PaymentMethod
  priceKRW: number | null // null → render the "₩—" placeholder
  currency: string
  status: OrderStatus
}

// What the eSIM provisioning adapter hands back after a successful order.
export interface EsimProfile {
  iccid: string
  activationCode: string // SM-DP+ activation code
  qrPayload: string // LPA string encoded into the QR
}

export type PushTrigger = 'arrival' | 'nearby' | 'predeparture'
