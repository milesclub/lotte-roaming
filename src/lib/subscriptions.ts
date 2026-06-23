import type { MvnoSubscription, MvnoStatus, MvnoOptions, MvnoApplicant } from './mvno'
import { getPlan, planMonthly, nextBillingFrom } from './mvno'
import { payments } from './payments'

// MVNO subscription persistence + submission. Mirrors lib/applications.ts: a
// localStorage record now, a real backend later behind the same functions.

const KEY = 'lr.subscriptions'

function readAll(): MvnoSubscription[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as MvnoSubscription[]) : []
  } catch {
    return []
  }
}

function writeAll(list: MvnoSubscription[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function listSubscriptions(): MvnoSubscription[] {
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getSubscription(id: string): MvnoSubscription | undefined {
  return readAll().find((s) => s.id === id)
}

function newId(): string {
  return `SB${Math.floor(100000 + Math.random() * 900000)}`
}

export interface SubscribeInput {
  planId: string
  options: MvnoOptions
  applicant: MvnoApplicant
}

// Charges the first month (mock) and persists the subscription.
export async function submitSubscription(input: SubscribeInput): Promise<MvnoSubscription> {
  const id = newId()
  const plan = getPlan(input.planId)
  const monthly = plan ? planMonthly(plan) : 0
  const createdAt = new Date().toISOString()

  const pay = await payments.charge({
    orderRef: id,
    amountKRW: monthly,
    currency: 'KRW',
    method: 'kr_easy',
    simulateFailure: false,
  })

  const sub: MvnoSubscription = {
    id,
    createdAt,
    planId: input.planId,
    options: input.options,
    applicant: input.applicant,
    status: pay.ok ? 'pending_activation' : 'failed',
    monthlyKRW: monthly,
    nextBillingDate: nextBillingFrom(createdAt),
  }

  const list = readAll()
  list.push(sub)
  writeAll(list)
  return sub
}

export function updateSubscriptionStatus(id: string, status: MvnoStatus): MvnoSubscription | undefined {
  const list = readAll()
  const idx = list.findIndex((s) => s.id === id)
  if (idx === -1) return undefined
  list[idx] = { ...list[idx], status }
  writeAll(list)
  return list[idx]
}
