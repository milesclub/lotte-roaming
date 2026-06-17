import type { PaymentMethod } from './types'
import { apiFetch, USE_BACKEND } from './api'

// ── Payment adapter ──────────────────────────────────────────────────────
// Real PG integration (international card, Alipay+, WeChat Pay, KR easy-pay) is
// undecided. This interface is the seam; `mockPaymentAdapter` stands in and can
// be swapped for a real implementation without touching the checkout UI.

export interface PaymentRequest {
  orderRef: string
  amountKRW: number | null
  currency: string
  method: PaymentMethod
  /** Demo hook: force the adapter to return a decline so the error state is reachable. */
  simulateFailure?: boolean
}

export interface PaymentResult {
  ok: boolean
  transactionId?: string
  declineReason?: string
}

export interface PaymentAdapter {
  charge(req: PaymentRequest): Promise<PaymentResult>
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export const mockPaymentAdapter: PaymentAdapter = {
  async charge(req) {
    await wait(1100) // simulate network / PG round-trip
    if (req.simulateFailure) {
      return { ok: false, declineReason: 'card_declined' }
    }
    return { ok: true, transactionId: `TXN-${req.orderRef}` }
  },
}

// Real adapter: posts to the BFF. With PortOne configured server-side the BFF
// verifies the payment (the client SDK supplies an imp_uid in production);
// otherwise the BFF mock honors `simulateFailure`.
export const httpPaymentAdapter: PaymentAdapter = {
  async charge(req) {
    return apiFetch<PaymentResult>('/api/payments/charge', {
      method: 'POST',
      body: JSON.stringify(req),
    })
  },
}

// The app imports its adapter from here. Backend when configured, else mock.
export const payments: PaymentAdapter = USE_BACKEND ? httpPaymentAdapter : mockPaymentAdapter
