# LOTTE ROAMING — Real Integration Guide

The app runs as a **standalone demo on local mock adapters** by default. Every
external dependency sits behind an interface; flipping it to production is
"point the adapter at the BFF + configure the provider." This doc is the map.

## Architecture

```
React SPA (src/)                    BFF (server/)                 External
─────────────────                   ─────────────                ────────
lib/auth.ts      ─┐                 /api/auth/*        ──▶ Kakao / LINE / Google / Apple / WeChat
lib/payments.ts   ├─ apiFetch ──▶   /api/payments/*    ──▶ PortOne / PG (cards, Alipay+, WeChat Pay)
lib/esim.ts       │  (when          /api/esim/*        ──▶ SM-DP+ (GSMA RSP) via network partner
lib/push.ts       │  VITE_API_      /api/push/*        ──▶ APNs / FCM
lib/catalog.ts   ─┘  BASE_URL set)  /api/catalog,/orders   DB / rate engine / L.POINT / fulfilment
```

The client picks the adapter at load time:

```ts
// src/lib/api.ts
export const USE_BACKEND = (import.meta.env.VITE_API_BASE_URL ?? '') !== ''
// each lib/*.ts:  export const X = USE_BACKEND ? httpXAdapter : mockXAdapter
```

So with no env set → 100% mock (today's demo). With `VITE_API_BASE_URL` set →
auth / payments / eSIM / push route through the BFF.

## Run both locally

```bash
# terminal 1 — BFF (mock mode out of the box)
cd server && cp .env.example .env && npm install && npm run dev   # :8787

# terminal 2 — client pointed at the BFF
cd .. && echo "VITE_API_BASE_URL=http://localhost:8787" > .env.local && npm run dev   # :5173
```

`GET http://localhost:8787/api/health` reports which integrations are live vs mock.

---

## 0. Prerequisite — the BFF owns all secrets

PG capture, SM-DP+ provisioning, OAuth token exchange, L.POINT linkage and push
dispatch must not run client-side. They live in `server/`. Never ship a provider
secret in the Vite bundle.

---

## 1. Social login — `server/src/routes/auth.ts`, `services/kakao.ts`

Two paths:

- **Dev/JSON** (`POST /api/auth/:provider`) returns a user immediately. Used by
  the demo and local dev.
- **Real OAuth redirect** (`GET /api/auth/:provider/start` → provider →
  `…/callback`). Implemented end-to-end for **Kakao**; the callback exchanges the
  code, fetches the profile, issues a signed session cookie, and redirects back
  to the SPA (which resumes the funnel from `sessionStorage`). Turn it on client-
  side with `VITE_USE_OAUTH_REDIRECT=true`.

| Provider | Console | Env |
|---|---|---|
| Kakao | developers.kakao.com (REST API key, Redirect URI, biz-app for email) | `KAKAO_REST_API_KEY`, `KAKAO_CLIENT_SECRET`, `KAKAO_REDIRECT_URI` |
| LINE | LINE Login channel | add `services/line.ts` mirroring kakao.ts |
| Google | Google Cloud OAuth client | add `services/google.ts` (or Google Identity SDK on native) |
| Apple | Apple Developer · Sign in with Apple (Service ID + key) | add `services/apple.ts` |
| WeChat | WeChat Open Platform (overseas approval) | add `services/wechat.ts` |

**To add a provider:** copy `services/kakao.ts`, add `start`/`callback` routes,
set the env. The client already renders the button (`PROVIDER_ORDER`,
`ProviderButton`).

**Production cookie note:** for the redirect flow, serve the SPA and BFF on the
**same site/domain** (e.g. `app.example.com` + `app.example.com/api`) so the
session cookie is first-party. Cross-origin dev relies on the JSON path instead.

## 2. L.POINT membership (KPI)

In `makeUser()` (`server/src/store.ts`) the user is flagged `lpointLinked`.
Replace with a call to the **Lotte Members / L.POINT global membership API** to
create/link the membership at sign-up, and store the membership id.

## 3. Payments — `server/src/routes/payments.ts`, `services/portone.ts`

Cross-border is the point (international card + Alipay+ + WeChat Pay + KR
easy-pay). **PortOne (아임포트)** is wired as the example:

1. Client completes payment with the PortOne SDK → gets `imp_uid`.
2. Client sends `impUid` in `POST /api/payments/charge`.
3. Server `portoneVerify(impUid)` checks `status === 'paid'` and the amount.

Set `PORTONE_API_KEY` / `PORTONE_API_SECRET` to go live; otherwise the mock
honors the S6 "simulate declined card" toggle. Wire `POST /api/payments/webhook`
to PortOne's webhook (verify signature, reconcile, idempotency). Alternatives:
Toss Payments, NICE, KG Inicis; or Adyen/Stripe for Alipay+/WeChat Pay channels.

## 4. eSIM provisioning — `server/src/routes/esim.ts`

Needs a **network partnership** (the screens' "Roaming" partner + "SKT local")
that exposes an **SM-DP+ (GSMA RSP)** platform/API. On payment success the server
allocates a profile and returns the `LPA:1$…` activation code → the S7 QR. Fill
the `smdpEnabled` branch with the chosen platform's API. Also: re-issue, status,
and termination endpoints; map Daily/Volume metering to the partner's charging.

## 5. USIM fulfilment

Not yet a code path. Add: a **delivery address form** (S6, for the delivery
branch), airport-counter **pickup reservation/inventory** integration (Incheon
T1/T2 partner), and a courier API (e.g. CJ Logistics) with tracking. The pickup
code (`LR-####`) should be issued/validated by that system.

## 6. Catalog & pricing — `server/src/routes/catalog.ts`

`POST /api/catalog/quote` returns a real KRW figure today (sample rate engine).
Replace with the real product/rate service. The client currently shows `₩—`;
wire `Plan.tsx` / `Pay.tsx` totals to the quote endpoint to surface real prices.

## 7. Push & lifecycle triggers — `server/src/routes/push.ts`

Dispatch via **APNs/FCM** to the user's device tokens. The three triggers:

- **arrival** — cleanest signal is the **network-registration event** from the
  partner (eSIM attaches to a KR network) via webhook; or device geofence.
- **nearby** — **geofencing** (needs background-location permission; privacy +
  battery; location-info-business filing in KR).
- **predeparture** — flight info / airport geofence / stay-duration timer.

The in-app banner system already exists client-side; the server adds real
delivery + the trigger rules engine.

## 8. Compliance (Korea-specific)

- **Telecom real-name / identity verification** is legally required to activate a
  SIM/eSIM in Korea (passport for foreigners). Add a KYC step before
  provisioning — this is a new flow not in the current funnel.
- **PIPA** (privacy policy, cross-border transfer consent), **PCI-DSS** (keep
  card data in the PG via tokenization), e-commerce refund/withdrawal notices,
  location-info business registration if geofencing.

## 9. Native app (Capacitor)

The SPA is already native-ready (HashRouter, relative `base`, PWA manifest).

```bash
npm i -D @capacitor/cli && npm i @capacitor/core @capacitor/ios @capacitor/android
npx cap init "LOTTE ROAMING" co.kr.themiles.lotteroaming
npm run build && npx cap add ios && npx cap add android && npx cap sync
```

Then add native plugins: social SDKs, push (APNs/FCM), geolocation/geofence,
camera (QR), and Wallet. iOS: Sign in with Apple is mandatory if other social
logins are offered; declare location/push usage strings.

## Suggested order

1. BFF + auth (1–2 providers) + L.POINT — land the membership KPI.
2. Catalog/pricing + payments (one PG) — the revenue path.
3. eSIM (SM-DP+) + identity verification — **start the partner contracts early**
   (longest lead time).
4. USIM fulfilment, push + triggers, native wrapping.
