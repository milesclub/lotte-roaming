import { Router } from 'express'
import { genOrderRef, orders } from '../store'
import type { Order } from '../types'

const router = Router()

// Create an order record. In production this also reserves USIM inventory /
// pickup slots and persists to the DB.
router.post('/', (req, res) => {
  const order = req.body as Order
  const orderRef = genOrderRef()
  orders.set(orderRef, { ...order, orderRef })
  res.json({ orderRef, order })
})

router.get('/:orderRef', (req, res) => {
  const order = orders.get(req.params.orderRef)
  if (!order) return res.status(404).json({ error: 'not_found' })
  return res.json(order)
})

export default router
