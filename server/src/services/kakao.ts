import { config } from '../config'

// Real Kakao Login (OAuth 2.0 Authorization Code). Docs:
// https://developers.kakao.com/docs/latest/en/kakaologin/rest-api

export function kakaoAuthUrl(state: string): string {
  const p = new URLSearchParams({
    client_id: config.kakao.restApiKey,
    redirect_uri: config.kakao.redirectUri,
    response_type: 'code',
    state,
    scope: 'profile_nickname account_email',
  })
  return `https://kauth.kakao.com/oauth/authorize?${p.toString()}`
}

export async function kakaoExchangeCode(code: string): Promise<{ access_token: string }> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: config.kakao.restApiKey,
    redirect_uri: config.kakao.redirectUri,
    code,
  })
  if (config.kakao.clientSecret) body.set('client_secret', config.kakao.clientSecret)

  const res = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body,
  })
  if (!res.ok) throw new Error(`kakao token exchange failed: ${await res.text()}`)
  return (await res.json()) as { access_token: string }
}

export async function kakaoFetchProfile(accessToken: string): Promise<{
  id: number
  kakao_account?: { email?: string; profile?: { nickname?: string } }
}> {
  const res = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`kakao profile fetch failed: ${await res.text()}`)
  return (await res.json()) as {
    id: number
    kakao_account?: { email?: string; profile?: { nickname?: string } }
  }
}
