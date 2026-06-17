import type { PartnerBenefit, PartnerCategory } from '../lib/domain'

// Lotte / L.POINT partner benefits shown on the landing, branched by travel
// direction. Text is intentionally "to be announced" — no invented numbers.
// English is the base; ko/zh/ja override via catalog.partners[id].

export const PARTNER_CATEGORIES: PartnerCategory[] = [
  'shopping',
  'tour',
  'stay',
  'dutyfree',
  'lpoint',
]

export const PARTNER_BENEFITS: PartnerBenefit[] = [
  // ── Inbound (한국 방문) ──────────────────────────────────────────────
  {
    id: 'in-shopping',
    category: 'shopping',
    directions: ['inbound'],
    title: 'Lotte shopping in Korea',
    desc: 'Lotte Dept. Store · Mart · World Mall partner discounts — to be announced for L.POINT members',
  },
  {
    id: 'in-tour',
    category: 'tour',
    directions: ['inbound'],
    title: 'Tours & attractions',
    desc: 'Lotte World · SEOUL SKY and partner attraction perks — to be announced',
  },
  {
    id: 'in-stay',
    category: 'stay',
    directions: ['inbound'],
    title: 'Stay & leisure',
    desc: 'Lotte Hotels & Resorts · SIGNIEL stay benefits — to be announced',
  },
  {
    id: 'in-dutyfree',
    category: 'dutyfree',
    directions: ['inbound'],
    title: 'Lotte Duty Free',
    desc: 'In-store and downtown duty-free perks — select partners, to be announced',
  },
  {
    id: 'in-lpoint',
    category: 'lpoint',
    directions: ['inbound'],
    title: 'L.POINT membership',
    desc: 'Earn & use L.POINT across partners during your stay — available when your membership is linked',
  },

  // ── Outbound (해외 출국) ─────────────────────────────────────────────
  {
    id: 'out-shopping',
    category: 'shopping',
    directions: ['outbound'],
    title: 'Overseas shopping',
    desc: 'Lotte & partner overseas shopping benefits — to be announced',
  },
  {
    id: 'out-tour',
    category: 'tour',
    directions: ['outbound'],
    title: 'Tours & attractions abroad',
    desc: 'Partner tour and attraction perks at your destination — to be announced',
  },
  {
    id: 'out-stay',
    category: 'stay',
    directions: ['outbound'],
    title: 'Stay, transit & airport',
    desc: 'Partner hotels, airport and transit benefits abroad — to be announced',
  },
  {
    id: 'out-dutyfree',
    category: 'dutyfree',
    directions: ['outbound'],
    title: 'Duty-free & airport pickup',
    desc: 'Lotte Duty Free online order with airport pickup — select partners, to be announced',
  },
  {
    id: 'out-lpoint',
    category: 'lpoint',
    directions: ['outbound'],
    title: 'L.POINT on return',
    desc: 'Earn L.POINT after your trip once roaming use is complete — conditions apply',
  },
]
