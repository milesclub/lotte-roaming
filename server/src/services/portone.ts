import { config } from '../config'

// Real PortOne (아임포트) server-side verification. The client completes the
// payment via the PortOne SDK and sends the resulting `imp_uid`; the server
// fetches the authoritative record and confirms status + amount.
// Docs: https://developers.portone.io

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://api.iamport.kr/users/getToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imp_key: config.portone.apiKey,
      imp_secret: config.portone.apiSecret,
    }),
  })
  const json = (await res.json()) as { response?: { access_token: string } }
  if (!json.response?.access_token) throw new Error('portone token failed')
  return json.response.access_token
}

export interface PortonePayment {
  status: string // 'paid' | 'ready' | 'failed' | 'cancelled'
  amount: number
  merchant_uid: string
  fail_reason?: string
}

export async function portoneVerify(impUid: string): Promise<PortonePayment> {
  const token = await getAccessToken()
  const res = await fetch(`https://api.iamport.kr/payments/${encodeURIComponent(impUid)}`, {
    headers: { Authorization: token },
  })
  const json = (await res.json()) as { response?: PortonePayment }
  if (!json.response) throw new Error('portone payment lookup failed')
  return json.response
}
