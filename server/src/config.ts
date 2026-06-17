import 'dotenv/config'

export const config = {
  port: Number(process.env.PORT ?? 8787),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  sessionSecret: process.env.SESSION_SECRET ?? 'dev-insecure-secret',
  kakao: {
    restApiKey: process.env.KAKAO_REST_API_KEY ?? '',
    clientSecret: process.env.KAKAO_CLIENT_SECRET ?? '',
    redirectUri: process.env.KAKAO_REDIRECT_URI ?? '',
  },
  portone: {
    apiKey: process.env.PORTONE_API_KEY ?? '',
    apiSecret: process.env.PORTONE_API_SECRET ?? '',
  },
  smdp: {
    baseUrl: process.env.SMDP_BASE_URL ?? '',
    apiKey: process.env.SMDP_API_KEY ?? '',
  },
}

// Feature flags: real integrations turn on only when fully configured.
export const kakaoEnabled = Boolean(config.kakao.restApiKey && config.kakao.redirectUri)
export const portoneEnabled = Boolean(config.portone.apiKey && config.portone.apiSecret)
export const smdpEnabled = Boolean(config.smdp.baseUrl && config.smdp.apiKey)
