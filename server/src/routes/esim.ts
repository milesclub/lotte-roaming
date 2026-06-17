import { Router } from 'express'
import { smdpEnabled } from '../config'
import type { EsimProfile, Order } from '../types'

const router = Router()

// POST /api/esim/provision
// Mock returns a deterministic LPA payload. With an SM-DP+ provider configured,
// this is where the real GSMA RSP profile allocation call goes (TODO: wire the
// chosen platform's API once the network partnership is in place).
router.post('/provision', async (req, res) => {
  const { orderRef } = req.body as { order: Order; orderRef: string }

  if (smdpEnabled) {
    // TODO: call the SM-DP+ platform to allocate a profile and return its
    // activation code. Falls through to the mock until wired.
  }

  const digits = orderRef.replace(/\D/g, '').padEnd(15, '0').slice(0, 15)
  const activationCode = `LR-${orderRef}-ACT`
  const profile: EsimProfile = {
    iccid: `8982${digits}`,
    activationCode,
    qrPayload: `LPA:1$smdp.lotteroaming.example$${activationCode}`,
  }
  res.json(profile)
})

export default router
