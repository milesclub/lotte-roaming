import type { EsimProfile, Order } from './types'
import { apiFetch, USE_BACKEND } from './api'

// ── eSIM provisioning adapter ────────────────────────────────────────────
// Real SM-DP+ provisioning is undecided. This interface is the seam;
// `mockEsimAdapter` returns a deterministic-looking LPA payload so the
// confirmation QR (S7) and activation guide (S8) are fully exercisable.

export interface EsimAdapter {
  provision(order: Order, orderRef: string): Promise<EsimProfile>
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export const mockEsimAdapter: EsimAdapter = {
  async provision(_order, orderRef) {
    await wait(600)
    const iccid = `8982${orderRef.replace(/\D/g, '').padEnd(15, '0').slice(0, 15)}`
    const activationCode = `LR-${orderRef}-ACT`
    // LPA:1$<SM-DP+ address>$<matching id>
    const qrPayload = `LPA:1$smdp.lotteroaming.example$${activationCode}`
    return { iccid, activationCode, qrPayload }
  },
}

// Real adapter: the BFF requests a profile from the SM-DP+ platform and returns
// the LPA activation payload. (Networks/SM-DP+ provider TBD — see docs.)
export const httpEsimAdapter: EsimAdapter = {
  async provision(order, orderRef) {
    return apiFetch<EsimProfile>('/api/esim/provision', {
      method: 'POST',
      body: JSON.stringify({ order, orderRef }),
    })
  },
}

// The app imports its adapter from here. Backend when configured, else mock.
export const esim: EsimAdapter = USE_BACKEND ? httpEsimAdapter : mockEsimAdapter

// Generates a USIM airport-pickup reservation code, e.g. "LR-4827".
// Deterministic from the order ref so it survives a refresh.
export function pickupCodeFor(orderRef: string): string {
  let h = 0
  for (const ch of orderRef) h = (h * 31 + ch.charCodeAt(0)) & 0xffff
  const n = 1000 + (h % 9000)
  return `LR-${n}`
}
