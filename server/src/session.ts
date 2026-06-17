import crypto from 'crypto'
import type { Request } from 'express'
import { config } from './config'

// Minimal HMAC-signed session token (no external dep). Swap for a vetted JWT
// library + rotation in production.

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

export function signSession(payload: Record<string, unknown>, ttlMs = THIRTY_DAYS): string {
  const body = { ...payload, exp: Date.now() + ttlMs }
  const data = Buffer.from(JSON.stringify(body)).toString('base64url')
  const sig = crypto.createHmac('sha256', config.sessionSecret).update(data).digest('base64url')
  return `${data}.${sig}`
}

export function verifySession<T = Record<string, unknown>>(token?: string): T | null {
  if (!token) return null
  const [data, sig] = token.split('.')
  if (!data || !sig) return null
  const expected = crypto.createHmac('sha256', config.sessionSecret).update(data).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  try {
    const body = JSON.parse(Buffer.from(data, 'base64url').toString()) as T & { exp: number }
    if (body.exp < Date.now()) return null
    return body
  } catch {
    return null
  }
}

// Reads a cookie or `Authorization: Bearer <token>` (cookies aren't parsed by
// default in Express; we do it by hand to avoid another dependency).
export function readSessionToken(req: Request): string | undefined {
  const auth = req.headers.authorization
  if (auth?.startsWith('Bearer ')) return auth.slice(7)
  const cookie = req.headers.cookie
  if (!cookie) return undefined
  for (const part of cookie.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === 'lr_session') return decodeURIComponent(v.join('='))
  }
  return undefined
}
