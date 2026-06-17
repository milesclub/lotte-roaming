import type { PushTrigger } from './types'
import { apiFetch, USE_BACKEND } from './api'

// ── Lifecycle push adapter ───────────────────────────────────────────────
// The companion's core mechanism: the always-on line lets us push the right
// message at the right moment. Real push delivery (APNs/FCM) + the geofence /
// arrival-detection triggers are undecided — this builds the payload + deep
// link schema and drives the in-app banner system from mock triggers.

export interface PushPayload {
  id: string
  trigger: PushTrigger
  titleKey: string // i18n key
  bodyKey: string // i18n key
  ctaKey: string // i18n key
  deepLink: string // lotteroaming://… in-app route
  ageKey: string // i18n key for the relative-time label
}

export const DEEP_LINK_SCHEME = 'lotteroaming'

// trigger condition (mocked): arrival = SIM goes active on a KR network,
// nearby = geofence enter, predeparture = flight within N hours.
export const PUSH_LIBRARY: Record<PushTrigger, PushPayload> = {
  arrival: {
    id: 'push-arrival',
    trigger: 'arrival',
    titleKey: 'push.arrival.title',
    bodyKey: 'push.arrival.body',
    ctaKey: 'push.arrival.cta',
    deepLink: `${DEEP_LINK_SCHEME}://arrival-guide`,
    ageKey: 'push.age.now',
  },
  nearby: {
    id: 'push-nearby',
    trigger: 'nearby',
    titleKey: 'push.nearby.title',
    bodyKey: 'push.nearby.body',
    ctaKey: 'push.nearby.cta',
    deepLink: `${DEEP_LINK_SCHEME}://near-you?poi=lotte-world-tower`,
    ageKey: 'push.age.2h',
  },
  predeparture: {
    id: 'push-predeparture',
    trigger: 'predeparture',
    titleKey: 'push.predeparture.title',
    bodyKey: 'push.predeparture.body',
    ctaKey: 'push.predeparture.cta',
    deepLink: `${DEEP_LINK_SCHEME}://duty-free-pickup`,
    ageKey: 'push.age.1d',
  },
}

export const PUSH_ORDER: PushTrigger[] = ['arrival', 'nearby', 'predeparture']

// Asks the BFF to send a real lifecycle push (APNs/FCM) for a trigger. No-op
// when the backend isn't configured — the in-app banner still fires locally.
export async function requestServerPush(trigger: PushTrigger): Promise<void> {
  if (!USE_BACKEND) return
  try {
    await apiFetch('/api/push/send', { method: 'POST', body: JSON.stringify({ trigger }) })
  } catch {
    // best-effort: a failed push request must not break the UI
  }
}

// Maps a deep link to an in-app route (HashRouter path). A native shell would
// register the URL scheme and route through here too.
export function resolveDeepLink(deepLink: string): string {
  if (deepLink.includes('arrival-guide')) return '/home'
  if (deepLink.includes('near-you')) return '/perks'
  if (deepLink.includes('duty-free-pickup')) return '/perks'
  return '/home'
}
