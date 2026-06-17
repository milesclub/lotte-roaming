import { Router } from 'express'
import { portoneEnabled } from '../config'
import { portoneVerify } from '../services/portone'
import type { PaymentResult } from '../types'

const router = Router()

// POST /api/payments/charge
// Mock mode: honors `simulateFailure`. PortOne mode: the client completes
// payment via the PortOne SDK and sends `impUid`; we verify it server-side.
router.post('/charge', async (req, res) => {
  const { orderRef, amountKRW, simulateFailure, impUid } = req.body as {
    orderRef: string
    amountKRW: number | null
    simulateFailure?: boolean
    impUid?: string
  }

  if (portoneEnabled && impUid) {
    try {
      const payment = await portoneVerify(impUid)
      const paid = payment.status === 'paid' && (amountKRW == null || payment.amount === amountKRW)
      const result: PaymentResult = paid
        ? { ok: true, transactionId: impUid }
        : { ok: false, declineReason: payment.fail_reason ?? payment.status }
      return res.json(result)
    } catch (e) {
      return res.status(502).json({ ok: false, declineReason: 'verify_failed', detail: String(e) })
    }
  }

  // Mock PG
  const result: PaymentResult = simulateFailure
    ? { ok: false, declineReason: 'card_declined' }
    : { ok: true, transactionId: `TXN-${orderRef}` }
  res.json(result)
})

// PG webhook (PortOne/PG → us). Verify signature + reconcile in production.
router.post('/webhook', (_req, res) => {
  res.json({ received: true })
})

export default router
