# LOTTE ROAMING — 실서비스 개발 요청 프롬프트 (for Claude Code)

> 아래 전체를 그대로 Claude Code에 붙여넣어 사용하세요.
> 첨부물: `LOTTE ROAMING Wireframes.dc.html` (승인된 mid-fi 와이어프레임 — 9→통합 10화면, 단일 구매 플로우).
> 와이어프레임의 **구조·플로우·카피·상태**가 정답지입니다. 비주얼 디테일(여백·색·폰트)은 아래 디자인 토큰을 따르세요.

---

## 0. 한 줄 요약

방한 외국인 관광객용 **한국 집중 트래블 데이터 앱**(eSIM·USIM)을 만든다. 단일 구매 플로우 — **Discover → SIM type → Plan → Network → Sign in → Pay & receive → Confirm → Activation → Active home → Lifecycle push** — 를 모바일 우선으로 실제 동작하는 서비스로 구현한다. UI 텍스트는 **영어 기본 + 다국어(EN/中文/日本語)**.

## 1. 제품·사용자 컨텍스트

- **사용자:** 한국 여행 중인 외국인(중국·일본·대만·미국 등). 한국어 모름. 도착 직전~직후 빠르게 데이터를 켜야 함. 시니어 포함 고려.
- **제품:** 한국 여행용 선불 데이터. 약정 없음. eSIM(즉시 QR) + USIM(실물, 공항 픽업/배송) 둘 다 판매. 글로벌 플랜도 있으나 화면 중심은 한국.
- **차별점("여행 컴패니언"):** 단순 데이터 판매가 아니라, 체류 내내 켜져 있는 회선을 활용해 도착 안내·동선 추천·혜택을 **생애주기 푸시**로 정밀 전달. 이 정체성이 홈(Active home)과 푸시 화면의 핵심.
- **핵심 KPI:** 가입 = L.POINT 글로벌 회원 획득.
- **브랜드 정서:** 롯데멤버스 계열의 신뢰감 + 여행의 설렘.

## 2. 기술 스택 (제안 — 합리적이면 조정 가능)

- **프레임워크:** Next.js (App Router) + TypeScript. 모바일 우선 PWA.
- **스타일:** Tailwind CSS. 아래 디자인 토큰을 `tailwind.config`의 theme + CSS 변수로 등록.
- **상태:** 구매 플로우는 단일 store(Zustand 등)에 누적 — `simType`, `planType`, `planConfig`, `network`, `payment`, `receiveMethod`. 새로고침 견디게 sessionStorage 동기화.
- **i18n:** `next-intl` 또는 동급. 모든 UI 문자열을 `en` / `zh` / `ja` 메시지 카탈로그로 분리. 기본 `en`. 우상단 글로브 피커로 전환, 선택은 localStorage 유지.
- **결제/eSIM/SMS-DP+ 연동은 추상화:** 실제 PG·eSIM 프로비저닝 API는 미정 → `lib/payments`, `lib/esim` 인터페이스로 감싸고 **목(mock) 어댑터**로 동작시킬 것. 교체 가능하게.
- **백엔드:** 카탈로그/주문은 API route + mock JSON으로 시작. 실제 서버 스펙은 추후.
- 접근성: 시맨틱 HTML, 키보드 포커스, 대비 AA, 탭 타깃 ≥ 44px.

## 3. 디자인 토큰 (반드시 토큰화 — 추후 실제 롯데/L.POINT 자산으로 교체 전제)

```
--brand-primary:  #E4002B   /* CTA·강조·선택 상태에만 절제 사용. 임시값, 실제 가이드로 교체 */
--brand-primary-tint: #FBE3E8
--ink:            #1A1A1A   /* 기본 텍스트 */
--muted:          #52525B   /* 보조 텍스트 */
--subtle:         #71717A   /* 캡션 */
--hairline:       #E2E2E6   /* 보더 */
--bg:             #FFFFFF
--bg-soft:        #FAFAFA / #F4F4F5
--success:        #16A34A
radius: 카드 14–16px, 버튼/인풋 11–13px, 칩 8–10px
font: 다국어 안전 산세리프(라틴+CJK 안정). Pretendard 또는 system sans 권장. 헤드라인 800, 본문 600.
```

- 레드는 CTA/추천 배지/선택 링/진행 인디케이터에만. 배경·대면적은 화이트+뉴트럴 그레이.
- 로고/브랜드마크는 임시 "L" 플레이스홀더. 실제 자산 슬롯만 만들어 둘 것.
- 와이어프레임의 줄무늬 박스 = **실제 사진 슬롯**(명동/한강/고궁/잠실 등 한국 여행 이미지). 지금은 플레이스홀더 컴포넌트로.

## 4. 글로벌 UX 규칙

- 모든 화면 우상단 **글로브 언어 피커**(EN / 中文 / 日本語).
- 구매 퍼널(S2–S6)은 **단일 5단계 인디케이터**: `SIM · Plan · Network · Account · Pay`. 뒤로가기 헤더 제공, 하단 탭바는 숨김.
- 비퍼널 화면(Discover, Active home, Push의 인앱)에는 **하단 탭바**: `Home · Plans · Perks · Account`.
- 가격·총액·기간·통화 항상 명확히. 가격은 현재 `₩—` 플레이스홀더(실제 SKU·가격 미정) — 통화 선택 UI는 구현하되 값은 카탈로그에서.
- 신뢰 요소: "Secure payment", 롯데 브랜드 슬롯.
- **빈/로딩/에러 상태 각각 최소 1종** 구현(특히 결제 실패).
- Lorem ipsum 금지. 아래 영어 카피 사용.

## 5. 두 개의 분기 (핵심 — 끝까지 전파)

1. **SIM type → 수령 방식.**
   - eSIM ⇒ S6 결제 후 즉시 **QR**, S7 = "You're all set" + QR 카드 + Install now / Install later(email).
   - USIM ⇒ S6 결제 시 **수령 방법 선택**(공항 픽업 / 호텔 배송), S7 = "Pickup reserved" + 픽업 코드(예 `LR-4827`) + 위치/시간.
2. **Plan type → 데이터 과금.**
   - Daily ⇒ 매일 리필, 일일 한도 소진 시 저속 무제한. (예: 5GB/day × 3일)
   - Volume(종량제) ⇒ 단일 풀, 기간 내 자유 사용, 탑업 가능. (예: 50GB / 30일)

주문 요약(S6/S7)과 Active home는 이 선택들을 실제로 반영해야 함.

## 6. 화면 명세 (와이어프레임 기준, 순서대로)

각 화면: **목적 / 요소 / 상태**. 영어 샘플 카피는 그대로 사용.

### S1 · Discover (홈, 비로그인)
- 목적: "한국 여행 데이터"임을 즉시 이해 → 플로우 진입. 컴패니언 정체성 강조.
- 요소: 한국 여행 히어로 이미지 + 헤드라인 `Your Korea, connected.` / `Your Korea starts the moment you land.`, 서브 `Travel data for Korea — activate in minutes, no contract.`, 메인 CTA `Get connected`, 보조 `Going elsewhere? Global plans`, "arrival kit" 3카드(Arrival guide / Welcome perk / Near you), 우상단 언어 피커, 하단 탭바.
- 승인된 방향: **B · Companion-forward**(arrival kit 선행). 나머지 3안은 와이어프레임 참고.

### S2 · SIM type  (Step 1/5)
- 목적: eSIM/USIM 선택. 이후 수령 단계 결정.
- 요소: 카드 2종 — **eSIM**(배지 `INSTANT`, "Install instantly with a QR code. No physical SIM. iPhone XS or newer & most Android."), **USIM**("A physical SIM card. Pick up at the airport counter or get it delivered to your hotel."). 보조 링크 `Check compatibility`. CTA `Continue`.
- 상태: 선택 시 레드 링 하이라이트. eSIM 기본 추천.

### S3 · Plan  (Step 2/5)
- 목적: 과금 타입 선택 + 사이즈 구성. (구 고정 SKU 목록 대체)
- 요소: ① 타입 선택(Daily / Volume) ② **Daily 구성**(데이터/일, 일수 스테퍼 + "5GB/day × 3 days" 요약 + 불릿: `Unlimited low-speed (1 Mbps) after the daily 5GB`, `Resets daily at 00:00 KST`, `5G where available`) ③ **Volume 구성**(총량 25/50/100GB, 유효기간 15/30일 + "50GB total · 30 days" + 불릿: `No daily limit — one shared pool`, `Top up more data anytime`, `5G where available`). 총액 `₩—`. CTA `Continue to network`.
- 상태: 추천 강조, 선택 하이라이트.

### S4 · Network  (Step 3/5)
- 목적: 망 선택.
- 요소: **Roaming network**("Connects through partner carriers. Works the moment you land." / Coverage Nationwide · Speed Standard · Setup Automatic), **SKT local network**(배지 `FASTEST`, "Connects directly to Korea's local network. Best in cities." / Coverage Korea-wide · Speed Fastest · Best for Heavy use). CTA `Continue to sign in`.

### S5 · Sign in / Sign up  (Step 4/5)
- 목적: 가입 = L.POINT 회원. 마찰 최소.
- 요소: `Continue with Google` / `Continue with Apple` / `Continue with email`. 동의 체크(약관[필수], 푸시, 마케팅[선택]). 하단 고지: `Creating an account also sets up your L.POINT membership for travel perks.`

### S6 · Pay & receive  (Step 5/5) — 분기 + 에러
- 목적: 막힘없는 결제 + 수령.
- 요소: 주문 요약(SIM·plan·network 전부 반영), 결제수단 `International card` / `Alipay+` / `WeChat Pay` / (보조)국내 간편결제, 통화 표기, 총액 강조, `Secure payment`.
  - eSIM: CTA `Pay & get eSIM`.
  - USIM: 수령방법(공항 픽업 Incheon T1/T2 24h / 호텔 배송 1–2일) → CTA `Pay & reserve pickup`.
- 상태: **에러 1종 필수** — "Payment didn't go through / Your card was declined. No charge was made." + `Try again` / `Change payment method` / `Contact support`.

### S7 · Confirmation — 분기
- eSIM: ✓ `You're all set` + 주문요약 + **QR 카드** + `Activate when you arrive in Korea.` + CTA `Install now` / `Install later (email sent)`.
- USIM: ✓ `Pickup reserved` + **픽업 코드**(`LR-4827`) + `Incheon Airport · T1 counter / Arrivals 1F · open 24h` + CTA `View pickup details` / `Add code to Wallet`.

### S8 · Activation guide
- 목적: 비기술 사용자 셀프 개통.
- 요소: 단말 토글 `iPhone / Android`, 3스텝(① Scan QR code [`Scan QR` / `Manual setup`] ② Install plan ③ Turn on data roaming), 단계 진행 표시, `Need help?`, 다국어. (USIM은 "insert the card" 분기 문구.)

### S9 · Active home / Companion
- 목적: "데이터 켜짐 + 여행 컴패니언" 한 화면.
- 요소: **데이터 잔량 게이지**(예 `7.4GB left · 3 days`), `Top up`, 컴패니언 카드(`Welcome offer` 10% 듀티프리 / `Near you · Myeongdong` / `Duty-free pickup` 리마인더), 하단 탭바.
- 승인된 방향: **B · Companion-led**(컴팩트 데이터 바 + 혜택/추천 우선). 나머지 3안 참고.

### S10 · Lifecycle notifications (핵심 메커니즘)
- 3종 메시지를 **잠금화면 + 인앱 배너** 두 형태로:
  1. 입국 감지 환영 — `Welcome to Korea! Your eSIM is now active. Here's your arrival guide + a welcome perk.`
  2. 체류 중 추천 — `You're near Lotte World Tower. Tap for nearby highlights and a perk.`
  3. 출국 직전 라스트콜 — `Heading home soon? Don't forget your duty-free pickup before you fly.`
- 구현: 푸시 페이로드/딥링크 스키마 + 인앱 배너 컴포넌트(트리거 조건 = 도착감지 / 위치근접 / 출국임박 — 지금은 mock 트리거). 잠금화면 형태는 데모용 미리보기 화면으로.

## 7. 데이터 모델 (시작점)

```ts
type SimType = 'esim' | 'usim';
type PlanType = 'daily' | 'volume';
type Network = 'roaming' | 'skt_local';
interface PlanConfig { type: PlanType; gbPerDay?: number; days?: number; totalGb?: number; validityDays?: number; }
interface Order { simType: SimType; plan: PlanConfig; network: Network;
  receive?: { method: 'airport_pickup' | 'delivery'; code?: string };
  priceKRW: number | null; currency: string; status: 'cart'|'paid'|'failed'; }
```

## 8. 산출물 & 수용 기준

- [ ] S1–S10 전 화면, 모바일 뷰포트(≈390px) 기준으로 실제 라우팅·네비게이션 동작.
- [ ] 구매 플로우가 store에 누적되고, S6/S7 주문요약·확인이 선택을 정확히 반영(두 분기 모두).
- [ ] 5단계 인디케이터·하단 탭바·언어 피커 전 화면 일관.
- [ ] 결제 실패 등 에러/로딩/빈 상태 구현(목 어댑터로 실패 시뮬레이션 토글 가능).
- [ ] i18n: EN/中文/日本語 카탈로그 키 분리, 전환·유지 동작(번역값은 EN 우선, 나머지는 키만 채워도 OK).
- [ ] 디자인 토큰 1곳에서 관리 — `--brand-primary` 한 줄 바꾸면 전체 테마 교체.
- [ ] PG·eSIM·푸시는 인터페이스+목으로 추상화(실연동 자리만).
- [ ] 가격은 `₩—`/카탈로그 플레이스홀더 유지, 통화 표기 UI는 구현.

## 9. 하지 말 것 / 주의

- 특정 회사의 독점 UI를 베끼지 말 것. 위 토큰·구조로 **오리지널** 구현. 브랜드 자산은 교체 가능한 슬롯만.
- Lorem ipsum 금지. 위 영어 카피 사용.
- 레드 남용 금지. 그라데이션·이모지 남발·불필요한 통계 금지. 여백 넉넉, 큰 탭 타깃.
- SVG로 복잡한 일러스트 그리지 말 것 — 사진 슬롯/플레이스홀더 사용.

---

**먼저 할 일:** 첨부 와이어프레임을 화면별로 정독 → 위 스택으로 프로젝트 스캐폴드 → 디자인 토큰/공통 컴포넌트(PhoneShell·StepIndicator·TabBar·LangPicker·Card·Button) 먼저 → 그다음 S1부터 순서대로. 진행 전 불명확한 점(스택 선택, 실제 API 유무)을 먼저 질문해 주세요.
