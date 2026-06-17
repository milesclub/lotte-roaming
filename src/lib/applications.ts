import type {
  Application,
  ApplicationStatus,
  ApplicantInfo,
  ProductOptions,
  TravelDirection,
} from './domain'
import type { Order } from './types'
import { getProduct } from './shop'
import { planPrice } from './labels'
import { payments } from './payments'
import { esim, pickupCodeFor } from './esim'

// Application persistence + submission. Stored in localStorage (the demo's
// "operator-visible" record); a real backend swaps in behind the same functions.

const KEY = 'lr.applications'

function readAll(): Application[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Application[]) : []
  } catch {
    return []
  }
}

function writeAll(list: Application[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function listApplications(): Application[] {
  return readAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function getApplication(id: string): Application | undefined {
  return readAll().find((a) => a.id === id)
}

export function newApplicationId(): string {
  return `LR${Math.floor(100000 + Math.random() * 900000)}`
}

export interface SubmitInput {
  direction: TravelDirection
  destinationCode: string
  productId: string
  options: ProductOptions
  applicant: ApplicantInfo
}

// Submits a draft: runs the mock payment + (for eSIM) provisioning, persists the
// application with the resulting status. Mirrors a real submit/checkout call.
export async function submitApplication(input: SubmitInput): Promise<Application> {
  const id = newApplicationId()
  const product = getProduct(input.productId)
  const total = product ? planPrice(product, input.options.plan) : null
  const isEsim = input.options.simType === 'esim'

  const base: Application = {
    id,
    createdAt: new Date().toISOString(),
    direction: input.direction,
    destinationCode: input.destinationCode,
    productId: input.productId,
    options: input.options,
    applicant: input.applicant,
    status: 'submitted',
    priceKRW: total,
  }

  // Payment is mocked (not yet integrated) — kept in the flow so the seam exists.
  const order: Order = {
    simType: input.options.simType,
    plan: input.options.plan,
    network: input.options.network,
    priceKRW: total,
    currency: 'KRW',
    status: 'cart',
  }
  const pay = await payments.charge({
    orderRef: id,
    amountKRW: total,
    currency: 'KRW',
    method: 'intl_card',
    simulateFailure: false,
  })

  let app: Application
  if (!pay.ok) {
    app = { ...base, status: 'failed' }
  } else if (isEsim) {
    const profile = await esim.provision(order, id)
    app = { ...base, status: 'pending_provisioning', esim: profile }
  } else {
    app = {
      ...base,
      status: 'pending_provisioning',
      receive: { method: 'airport_pickup', code: pickupCodeFor(id) },
    }
  }

  const list = readAll()
  list.push(app)
  writeAll(list)
  return app
}

export function updateStatus(id: string, status: ApplicationStatus): Application | undefined {
  const list = readAll()
  const idx = list.findIndex((a) => a.id === id)
  if (idx === -1) return undefined
  list[idx] = { ...list[idx], status }
  writeAll(list)
  return list[idx]
}
