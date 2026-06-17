// ── Auth adapter ─────────────────────────────────────────────────────────
// Social sign-in for inbound travelers. Real OAuth (Kakao / LINE / Google /
// Apple / WeChat) needs client IDs, redirect URIs and a backend — all undecided.
// This is the seam: `mockAuthAdapter` simulates the provider round-trip and
// returns a user. Social sign-in doubles as sign-up: a first-time user is
// created and their L.POINT membership is linked in one step.

import { apiFetch, API_BASE, USE_BACKEND } from './api'

export type AuthProvider = 'kakao' | 'line' | 'google' | 'apple' | 'wechat' | 'email'

export interface AuthUser {
  id: string
  provider: AuthProvider
  name: string
  email?: string
  /** Created/linked an L.POINT membership on sign-up (the key KPI). */
  lpointLinked: boolean
  isNew: boolean
}

export interface AuthAdapter {
  signIn(provider: AuthProvider): Promise<AuthUser>
}

// Plausible sample identities per provider (demo only).
const SAMPLE: Record<AuthProvider, { name: string; email: string }> = {
  kakao: { name: 'Jiwoo Han', email: 'jiwoo.han@kakao.com' },
  line: { name: 'Yuki Tanaka', email: 'yuki.tanaka@line.me' },
  google: { name: 'Alex Chen', email: 'alex.chen@gmail.com' },
  apple: { name: 'Sam Rivera', email: 'sam.rivera@icloud.com' },
  wechat: { name: 'Wei Zhang', email: 'wei.zhang@wechat.com' },
  email: { name: 'Traveler', email: 'traveler@example.com' },
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

// Demo: remember which providers have "registered" so a first sign-in counts as
// sign-up (isNew → show consent) and later sign-ins are returning members
// (isNew=false → skip the terms step). Real backends decide this server-side.
const REG_KEY = 'lr.registered'
function registeredProviders(): string[] {
  try {
    return JSON.parse(localStorage.getItem(REG_KEY) ?? '[]')
  } catch {
    return []
  }
}
function markRegistered(provider: string) {
  const set = new Set(registeredProviders())
  set.add(provider)
  localStorage.setItem(REG_KEY, JSON.stringify([...set]))
}

// Email accounts created in the demo (so a returning email signs in, a new one
// signs up). Stored locally; a real backend owns this.
const EMAIL_KEY = 'lr.emailaccounts'
type EmailAccount = { email: string; name: string }
function emailAccounts(): Record<string, EmailAccount> {
  try {
    return JSON.parse(localStorage.getItem(EMAIL_KEY) ?? '{}')
  } catch {
    return {}
  }
}
function saveEmailAccount(acc: EmailAccount) {
  const all = emailAccounts()
  all[acc.email.toLowerCase()] = acc
  localStorage.setItem(EMAIL_KEY, JSON.stringify(all))
}
export function emailAccountExists(email: string): boolean {
  return !!emailAccounts()[email.trim().toLowerCase()]
}

export async function mockEmailSignIn(email: string): Promise<AuthUser> {
  await wait(800) // verify credentials
  const acc = emailAccounts()[email.trim().toLowerCase()]
  return {
    id: `email_${Math.random().toString(36).slice(2, 10)}`,
    provider: 'email',
    name: acc?.name ?? email.split('@')[0],
    email: email.trim(),
    lpointLinked: true,
    isNew: false,
  }
}

export async function mockEmailSignUp(email: string, name: string): Promise<AuthUser> {
  await wait(1000) // create account + link L.POINT membership
  const e = email.trim()
  saveEmailAccount({ email: e.toLowerCase(), name })
  markRegistered('email')
  return {
    id: `email_${Math.random().toString(36).slice(2, 10)}`,
    provider: 'email',
    name,
    email: e,
    lpointLinked: true,
    isNew: true,
  }
}

export const mockAuthAdapter: AuthAdapter = {
  async signIn(provider) {
    await wait(1200) // simulate the OAuth redirect + token exchange
    const s = SAMPLE[provider]
    const isNew = !registeredProviders().includes(provider)
    markRegistered(provider)
    return {
      id: `${provider}_${Math.random().toString(36).slice(2, 10)}`,
      provider,
      name: s.name,
      email: s.email,
      lpointLinked: true,
      isNew,
    }
  },
}

// Real adapter: calls the BFF. In dev the BFF's JSON endpoint returns a user;
// in production, social providers go through the OAuth redirect (startOAuth).
export const httpAuthAdapter: AuthAdapter = {
  async signIn(provider) {
    return apiFetch<AuthUser>(`/api/auth/${provider}`, { method: 'POST' })
  },
}

// Kicks off the real provider OAuth flow via the BFF. The BFF handles the
// token exchange and redirects back to the SPA with a session token; the
// purchase funnel is restored from sessionStorage on return.
export function startOAuth(provider: AuthProvider) {
  const back = encodeURIComponent(window.location.href)
  window.location.href = `${API_BASE}/api/auth/${provider}/start?redirect=${back}`
}

// Reads the current user from the BFF session cookie (set after an OAuth
// redirect returns). Returns null when not signed in or no backend.
export async function fetchMe(): Promise<AuthUser | null> {
  if (!USE_BACKEND) return null
  try {
    const { user } = await apiFetch<{ user: AuthUser | null }>('/api/auth/me')
    return user
  } catch {
    return null
  }
}

// The app imports its adapter from here. Backend when configured, else mock.
export const auth: AuthAdapter = USE_BACKEND ? httpAuthAdapter : mockAuthAdapter

// Display order on the sign-in screen, tuned to the Korea-inbound audience.
export const PROVIDER_ORDER: AuthProvider[] = ['kakao', 'line', 'google', 'apple', 'wechat']
