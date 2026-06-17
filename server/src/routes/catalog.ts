import { Router } from 'express'
import type { Network, PlanConfig, SimType } from '../types'

const router = Router()

// Configurator ranges (mirror the client's catalog constants).
router.get('/', (_req, res) => {
  res.json({
    currencies: [
      { code: 'KRW', symbol: '₩', label: 'KRW' },
      { code: 'USD', symbol: '$', label: 'USD' },
      { code: 'CNY', symbol: '¥', label: 'CNY' },
      { code: 'JPY', symbol: '¥', label: 'JPY' },
    ],
    daily: { gbPerDay: [1, 2, 3, 5, 10], days: { min: 1, max: 30 } },
    volume: { totalGb: [25, 50, 100], validityDays: [15, 30] },
  })
})

// Sample pricing — stands in for a real rate engine. Returns a real KRW figure
// so the seam is exercisable; the client keeps "₩—" until this is wired up.
router.post('/quote', (req, res) => {
  const { simType, plan, network } = req.body as {
    simType: SimType
    plan: PlanConfig
    network: Network
  }
  let price: number
  if (plan.type === 'daily') {
    price = (plan.days ?? 1) * (3000 + (plan.gbPerDay ?? 1) * 800)
  } else {
    price = (plan.totalGb ?? 0) * 700 + ((plan.validityDays ?? 0) >= 30 ? 5000 : 0)
  }
  if (network === 'skt_local') price = Math.round(price * 1.3)
  if (simType === 'usim') price += 5000
  price = Math.round(price / 100) * 100
  res.json({ priceKRW: price, currency: 'KRW' })
})

export default router
