import { Router } from 'express'
import { config, kakaoEnabled } from '../config'
import { makeUser, users } from '../store'
import { signSession, verifySession, readSessionToken } from '../session'
import { kakaoAuthUrl, kakaoExchangeCode, kakaoFetchProfile } from '../services/kakao'
import type { AuthProvider } from '../types'

const PROVIDERS: AuthProvider[] = ['kakao', 'line', 'google', 'apple', 'wechat', 'email']
const router = Router()

// Dev/JSON path: returns a user immediately. Real social sign-in should use the
// OAuth redirect endpoints below; this is for local development and the demo.
router.post('/:provider', (req, res) => {
  const provider = req.params.provider as AuthProvider
  if (!PROVIDERS.includes(provider)) {
    return res.status(400).json({ error: 'unknown_provider' })
  }
  const user = makeUser(provider)
  const token = signSession({ userId: user.id })
  setSessionCookie(res, token)
  return res.json(user)
})

// Current session (used after an OAuth redirect returns).
router.get('/me', (req, res) => {
  const session = verifySession<{ userId: string }>(readSessionToken(req))
  const user = session ? users.get(session.userId) ?? null : null
  res.json({ user })
})

// ── Real Kakao OAuth ──────────────────────────────────────────────────────
router.get('/kakao/start', (req, res) => {
  if (!kakaoEnabled) {
    return res.status(501).json({ error: 'kakao_not_configured' })
  }
  const redirect = typeof req.query.redirect === 'string' ? req.query.redirect : config.clientOrigin
  const state = Buffer.from(JSON.stringify({ redirect })).toString('base64url')
  return res.redirect(kakaoAuthUrl(state))
})

router.get('/kakao/callback', async (req, res) => {
  if (!kakaoEnabled) return res.status(501).json({ error: 'kakao_not_configured' })
  const code = typeof req.query.code === 'string' ? req.query.code : ''
  if (!code) return res.status(400).json({ error: 'missing_code' })

  let redirect = config.clientOrigin
  try {
    const state = typeof req.query.state === 'string' ? req.query.state : ''
    if (state) redirect = JSON.parse(Buffer.from(state, 'base64url').toString()).redirect ?? redirect
  } catch {
    /* keep default redirect */
  }

  try {
    const { access_token } = await kakaoExchangeCode(code)
    const profile = await kakaoFetchProfile(access_token)
    const user = makeUser('kakao', {
      id: `kakao_${profile.id}`,
      name: profile.kakao_account?.profile?.nickname ?? 'Kakao user',
      email: profile.kakao_account?.email,
    })
    const token = signSession({ userId: user.id })
    setSessionCookie(res, token)
    // Hand control back to the SPA; the funnel resumes from sessionStorage.
    const sep = redirect.includes('#') ? '&' : '#/buy/pay?'
    return res.redirect(`${redirect}${sep}lr_token=${encodeURIComponent(token)}`)
  } catch (e) {
    return res.status(502).json({ error: 'kakao_oauth_failed', detail: String(e) })
  }
})

function setSessionCookie(res: import('express').Response, token: string) {
  const isProd = process.env.NODE_ENV === 'production'
  res.cookie('lr_session', token, {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  })
}

export default router
