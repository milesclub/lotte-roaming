import { Router } from 'express'
import type { PushTrigger } from '../types'

const router = Router()

const COPY: Record<PushTrigger, { title: string; body: string; deepLink: string }> = {
  arrival: {
    title: 'Welcome to Korea!',
    body: "Your eSIM is now active. Here's your arrival guide + a welcome perk.",
    deepLink: 'lotteroaming://arrival-guide',
  },
  nearby: {
    title: "You're near Lotte World Tower",
    body: 'Tap for nearby highlights and a perk.',
    deepLink: 'lotteroaming://near-you?poi=lotte-world-tower',
  },
  predeparture: {
    title: 'Heading home soon?',
    body: "Don't forget your duty-free pickup before you fly.",
    deepLink: 'lotteroaming://duty-free-pickup',
  },
}

// POST /api/push/send
// Mock: logs the payload. Production: look up the user's device tokens and
// dispatch via APNs/FCM; the lifecycle triggers (arrival/nearby/predeparture)
// come from network-registration events, geofences, and flight/stay timing.
router.post('/send', (req, res) => {
  const { trigger } = req.body as { trigger: PushTrigger }
  const payload = COPY[trigger]
  if (!payload) return res.status(400).json({ error: 'unknown_trigger' })
  console.log(`[push] queued ${trigger}:`, payload.title)
  return res.json({ queued: true, trigger, payload })
})

export default router
