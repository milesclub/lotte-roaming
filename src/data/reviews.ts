import type { TravelDirection } from '../lib/domain'
import type { LangCode } from '../content'

// Example user reviews shown on the landing (per direction). Each review is
// stored in the language its author actually wrote in (`lang`); when the UI
// language differs, ReviewCard translates it on the fly (see lib/translate).
// "photo" is a real trip image with a brand gradient tile + emoji fallback.
// Ratings and names are illustrative sample content for the demo.

export interface Review {
  id: string
  direction: TravelDirection
  lang: LangCode // language the review was originally written in
  author: string
  initial: string
  flag: string
  rating: number // 1–5
  date: string // yyyy-mm
  tag: string // product / area context
  photo: { grad: string; emoji: string; url: string }
  text: string
}

const RV = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&q=70&auto=format&fit=crop`

export const REVIEWS: Review[] = [
  // ── Inbound (visiting Korea) ─────────────────────────────────────────
  {
    id: 'rv-in-1',
    direction: 'inbound',
    lang: 'en',
    author: 'Mei L.',
    initial: 'M',
    flag: '🇹🇼',
    rating: 5,
    date: '2026-05',
    tag: 'Korea Daily · Seoul',
    photo: { grad: 'grad-a', emoji: '🗼', url: RV('1517154421773-0529f29ea451') },
    text: 'Scanned the eSIM QR before my flight and had data the second I landed at Incheon. Used L.POINT at Lotte Department Store too!',
  },
  {
    id: 'rv-in-2',
    direction: 'inbound',
    lang: 'en',
    author: 'Kenji T.',
    initial: 'K',
    flag: '🇯🇵',
    rating: 5,
    date: '2026-04',
    tag: 'Korea eSIM Daily · Busan',
    photo: { grad: 'grad-b', emoji: '🌊', url: RV('1599561046251-bfb9465b4c44') },
    text: 'Local network was fast even at Haeundae beach. Setup took two minutes and there was no contract to cancel afterwards.',
  },
  {
    id: 'rv-in-3',
    direction: 'inbound',
    lang: 'en',
    author: 'Sophie R.',
    initial: 'S',
    flag: '🇫🇷',
    rating: 4,
    date: '2026-03',
    tag: 'Korea Volume · Jeju',
    photo: { grad: 'grad-c', emoji: '🍊', url: RV('1635776062043-223faf322554') },
    text: 'One data pool for the whole trip was perfect for Jeju. Maps and translation worked everywhere I went.',
  },
  {
    id: 'rv-in-4',
    direction: 'inbound',
    lang: 'en',
    author: 'David K.',
    initial: 'D',
    flag: '🇺🇸',
    rating: 5,
    date: '2026-05',
    tag: 'Korea USIM · Seoul',
    photo: { grad: 'grad-d', emoji: '🛍️', url: RV('1601972599720-36938d4ecd31') },
    text: 'Picked up the USIM at the airport counter. Smooth process and the duty-free perk reminder was a nice touch.',
  },

  // ── Outbound (going abroad) ──────────────────────────────────────────
  {
    id: 'rv-out-1',
    direction: 'outbound',
    lang: 'ko',
    author: '지현 김',
    initial: '김',
    flag: '🇰🇷',
    rating: 5,
    date: '2026-05',
    tag: 'Japan Daily · Osaka',
    photo: { grad: 'grad-b', emoji: '🏯', url: RV('1480796927426-f609979314bd') },
    text: '오사카 도착하자마자 바로 연결됐어요. 매일 충전되는 데일리라 데이터 걱정 없이 다녔습니다.',
  },
  {
    id: 'rv-out-2',
    direction: 'outbound',
    lang: 'ko',
    author: '민준 이',
    initial: '이',
    flag: '🇰🇷',
    rating: 4,
    date: '2026-04',
    tag: 'Europe Daily · Paris',
    photo: { grad: 'grad-e', emoji: '🗼', url: RV('1502602898657-3e91760cbb34') },
    text: '유럽 여러 나라를 한 상품으로 쓰니 편했어요. 도착 후 로밍만 켜면 끝이라 설정이 간단했습니다.',
  },
  {
    id: 'rv-out-3',
    direction: 'outbound',
    lang: 'ko',
    author: '서연 박',
    initial: '박',
    flag: '🇰🇷',
    rating: 5,
    date: '2026-03',
    tag: 'Asia Daily · Bangkok',
    photo: { grad: 'grad-c', emoji: '🛺', url: RV('1506973035872-a4ec16b8e8d9') },
    text: '방콕에서 속도 빠르고 안정적이었어요. 귀국 후 L.POINT 적립 안내도 받아서 좋았습니다.',
  },
  {
    id: 'rv-out-4',
    direction: 'outbound',
    lang: 'ko',
    author: '현우 정',
    initial: '정',
    flag: '🇰🇷',
    rating: 5,
    date: '2026-05',
    tag: 'Oceania Daily · Guam',
    photo: { grad: 'grad-a', emoji: '🏝️', url: RV('1533050487297-09b450131914') },
    text: '괌 가족여행에 데일리로 충분했어요. 면세 공항 수령이랑 같이 준비하니 출발이 깔끔했습니다.',
  },
]

export function reviewsFor(direction: TravelDirection): Review[] {
  return REVIEWS.filter((r) => r.direction === direction)
}

// Average + count for the summary header.
export function reviewStats(direction: TravelDirection): { avg: number; count: number } {
  const list = reviewsFor(direction)
  if (!list.length) return { avg: 0, count: 0 }
  const sum = list.reduce((a, r) => a + r.rating, 0)
  return { avg: Math.round((sum / list.length) * 10) / 10, count: list.length }
}
