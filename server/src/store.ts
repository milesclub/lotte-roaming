import type { AuthProvider, AuthUser, Order } from './types'

// In-memory store for the scaffold. Replace with a real database (orders,
// accounts, provisioning records) in production.

export const users = new Map<string, AuthUser>()
export const orders = new Map<string, Order & { orderRef: string }>()

export function genOrderRef(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// Sample identities per provider (dev/mock convenience).
const SAMPLE: Record<AuthProvider, { name: string; email: string }> = {
  kakao: { name: 'Jiwoo Han', email: 'jiwoo.han@kakao.com' },
  line: { name: 'Yuki Tanaka', email: 'yuki.tanaka@line.me' },
  google: { name: 'Alex Chen', email: 'alex.chen@gmail.com' },
  apple: { name: 'Sam Rivera', email: 'sam.rivera@icloud.com' },
  wechat: { name: 'Wei Zhang', email: 'wei.zhang@wechat.com' },
  email: { name: 'Traveler', email: 'traveler@example.com' },
}

export function makeUser(
  provider: AuthProvider,
  overrides: Partial<AuthUser> = {},
): AuthUser {
  const s = SAMPLE[provider] ?? SAMPLE.email
  const user: AuthUser = {
    id: `${provider}_${Math.random().toString(36).slice(2, 10)}`,
    provider,
    name: s.name,
    email: s.email,
    lpointLinked: true, // sign-up links the L.POINT membership (KPI)
    isNew: true,
    ...overrides,
  }
  users.set(user.id, user)
  return user
}
