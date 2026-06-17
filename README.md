# LOTTE ROAMING — L.POINT 제휴 로밍 서비스 (MVP)

여행지(국가·권역)를 고르고 로밍 상품을 신청하는 흐름을 **끝까지 동작**하게 구현한
데모용 MVP입니다. 데스크탑·모바일 **반응형**이며, L.POINT 디자인 토큰을 적용해
**L.POINT 서비스의 하위 페이지처럼** 보이도록 했습니다. 외부 연동(결제·프로비저닝·
본인확인 등)은 mock 어댑터로 처리하고, 추후 실연동으로 교체 가능한 구조입니다.

## 핵심 사용자 플로우 (실제 동작)

```
홈(소개·혜택·인기 여행지)  →  로밍 상품(여행지 선택 + 필터링)  →  상품 상세(옵션 선택)
  →  로그인/가입(L.POINT)  →  신청 정보 입력(유효성 검사)  →  신청 확인  →  완료(상태·QR)
  →  신청 내역/상세(상태 확인)  →  개통 안내(완료 처리)
```

- 여행지 선택 → 해당 권역에 맞는 상품만 필터링되어 노출
- 상품 옵션(eSIM/USIM·일수·연결망) 선택값이 요약/확인/완료 화면까지 반영
- 신청 정보 입력 검증(이름/이메일/휴대폰/여행기간/USIM 배송주소)
- 신청은 `localStorage`에 저장되어 신청 내역에서 상태 확인 가능
- 상태값: `draft · submitted · pending_payment · pending_provisioning · completed · failed`

## 기술 스택

Vite + React 18 + TypeScript + Tailwind. 클라이언트 라우팅(HashRouter)으로 정적 호스팅·
네이티브 셸 모두 호환. 상태는 Zustand, 신청 데이터는 localStorage 영속화.

## 실행

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
npm run typecheck
```

## 구조 (데이터 기반 · 하드코딩 최소화)

```
src/
  content/ui.ts        모든 UI 카피·라벨·CTA·상태·에러·빈 상태 (운영자 편집 지점)
  data/                destinations · products · benefits · notices · faq (카탈로그 데이터)
  lib/
    domain.ts          Destination/Product/Application/Status 등 도메인 타입
    shop.ts            카탈로그 서비스(여행지·상품 필터링) — 실 API 교체 지점
    applications.ts    신청 영속화 + 제출(mock 결제/프로비저닝)
    validation.ts      신청자 입력 검증
    labels.ts          도메인값 → 한글 라벨
    auth/payments/esim/push + api.ts   외부 연동 어댑터(mock ↔ BFF 전환)
  store/application.ts 신청 퍼널 상태(여행지→상품→옵션→신청자) sessionStorage 동기화
  store/auth.ts        로그인 사용자(L.POINT)
  components/site/      AppShell·SiteHeader·SiteFooter·Container·CheckoutLayout·StepNav
  components/ui/        Badge·StatusBadge·BenefitIcon·TextField
  components/          ProductCard·SummaryCard·ProviderButton·Button·Segmented·Stepper …
  screens/             Landing·Browse·ProductDetail·SignIn·ApplicantInfo·ApplyConfirm·
                       ApplyComplete·Applications·ApplicationDetail·Activate
```

## 반응형

- **데스크탑**: 상단 네비게이션 + 넓은 컨테이너. 상품 탐색은 좌측 필터 사이드바 + 우측
  상품 그리드. 신청 단계는 좌측 입력 / 우측 sticky 요약의 2-column.
- **모바일**: 햄버거 메뉴, 단일 컬럼, 상품 상세 하단 sticky 신청 바, 큰 탭 타깃.

## 디자인 토큰 (L.POINT)

`src/index.css` `:root` 가 단일 소스. 브랜드 레드 `#fb1822`, 쿨그레이 뉴트럴, Pretendard,
radius 8/12/16 등 L.POINT 값(`cnt.lpoint.com` 스타일시트에서 추출)을 반영. 로고는 교체
가능한 `L` 플레이스홀더입니다.

## 외부 연동 / BFF

`server/`(Express+TS BFF)와 클라이언트 어댑터는 `VITE_API_BASE_URL` 설정 시 실 백엔드로
전환됩니다(미설정 시 mock). Kakao OAuth·PortOne 결제는 env 게이팅으로 실연동 예시 포함.
실연동 로드맵은 **`docs/integration.md`** 참고.

> 본 화면은 시연용 MVP입니다. 요금·혜택·약관 등 확정되지 않은 내용은 추후 별도 안내됩니다.
