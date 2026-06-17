import type { ApplicantInfo, ProductOptions } from './domain'
import { getUI } from '../content'

export type ApplicantErrors = Partial<Record<keyof ApplicantInfo, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateApplicant(a: ApplicantInfo, opts: ProductOptions): ApplicantErrors {
  const e: ApplicantErrors = {}
  const A = getUI().applicant

  if (!a.name.trim()) e.name = A.required

  if (!a.email.trim()) e.email = A.required
  else if (!EMAIL.test(a.email.trim())) e.email = A.invalidEmail

  const digits = a.phone.replace(/\D/g, '')
  if (!a.phone.trim()) e.phone = A.required
  else if (digits.length < 10 || digits.length > 11) e.phone = A.invalidPhone

  if (!a.travelStart) e.travelStart = A.required
  if (!a.travelEnd) e.travelEnd = A.required
  else if (a.travelStart && a.travelEnd < a.travelStart) e.travelEnd = A.invalidDate

  // USIM 택배 배송이면 주소 필수
  if (opts.simType === 'usim' && opts.receiveMethod === 'delivery' && !a.address?.trim()) {
    e.address = A.addressRequired
  }

  return e
}

export function isApplicantValid(a: ApplicantInfo, opts: ProductOptions): boolean {
  return Object.keys(validateApplicant(a, opts)).length === 0
}
