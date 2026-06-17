import type { Benefit, Notice, Product } from '../lib/domain'

// Roaming products — data/duration use the brief's example values only; price
// stays null. Display text is English (base locale). Products are organized by
// region so each destination shows its own roaming plans (Korea, Japan, Asia,
// Europe, North America, Oceania) plus a worldwide fallback.
export const PRODUCTS: Product[] = [
  // ── Inbound (한국 방문) products ──────────────────────────────────────
  {
    id: 'korea-daily-5gb',
    kind: 'daily',
    name: 'Korea Daily',
    tagline: 'Fresh data every day in Korea. Great for short trips.',
    dailyGb: 2,
    defaultDays: 3,
    throttleNote: 'Unlimited low-speed (up to 1 Mbps) after the daily cap',
    simTypes: ['esim', 'usim'],
    networks: ['roaming', 'local'],
    directions: ['inbound'],
    coverage: ['korea'],
    benefitIds: ['point', 'install', 'nocontract', '5g'],
    noticeIds: ['throttle', 'esim', 'coverage', 'price'],
    badge: 'Popular',
    recommended: true,
    priceKRW: 3300, // unit: per day (daily) / per GB (volume)
  },
  {
    id: 'korea-volume-50gb',
    kind: 'volume',
    name: 'Korea Volume',
    tagline: 'One data pool for your whole stay in Korea.',
    totalGb: 50,
    validityDays: 30,
    simTypes: ['esim', 'usim'],
    networks: ['roaming', 'local'],
    directions: ['inbound'],
    coverage: ['korea'],
    benefitIds: ['point', 'nocontract', 'support'],
    noticeIds: ['volume', 'esim', 'coverage', 'price'],
    badge: 'Long stay',
    priceKRW: 780, // unit: per day (daily) / per GB (volume)
  },
  {
    id: 'korea-esim-daily',
    kind: 'daily',
    name: 'Korea eSIM Daily',
    tagline: 'SKT local-network priority. Fast from the moment you land.',
    dailyGb: 2,
    defaultDays: 3,
    throttleNote: 'Unlimited low-speed (up to 1 Mbps) after the daily cap',
    simTypes: ['esim'],
    networks: ['local', 'roaming'],
    directions: ['inbound'],
    coverage: ['korea'],
    benefitIds: ['point', 'install', '5g', 'support'],
    noticeIds: ['throttle', 'esim', 'coverage', 'price'],
    badge: 'eSIM',
    priceKRW: 3800, // unit: per day (daily) / per GB (volume)
  },
  {
    id: 'korea-usim-volume',
    kind: 'volume',
    name: 'Korea USIM',
    tagline: 'Physical USIM for Korea — airport pickup or delivery.',
    totalGb: 50,
    validityDays: 30,
    simTypes: ['usim'],
    networks: ['roaming'],
    directions: ['inbound'],
    coverage: ['korea'],
    benefitIds: ['point', 'nocontract', 'support'],
    noticeIds: ['volume', 'usim_deliver', 'price'],
    badge: 'USIM',
    priceKRW: 760, // unit: per day (daily) / per GB (volume)
  },

  // ── Outbound · Japan ─────────────────────────────────────────────────
  {
    id: 'japan-daily-5gb',
    kind: 'daily',
    name: 'Japan Daily',
    tagline: 'Local-network priority across Japan. Fast on arrival.',
    dailyGb: 2,
    defaultDays: 3,
    throttleNote: 'Unlimited low-speed (up to 1 Mbps) after the daily cap',
    simTypes: ['esim', 'usim'],
    networks: ['local', 'roaming'],
    directions: ['outbound'],
    coverage: ['japan'],
    benefitIds: ['point', 'install', '5g', 'support'],
    noticeIds: ['throttle', 'esim', 'coverage', 'price'],
    badge: 'Japan',
    recommended: true,
    priceKRW: 3500, // unit: per day (daily) / per GB (volume)
  },
  {
    id: 'japan-volume-30gb',
    kind: 'volume',
    name: 'Japan Volume',
    tagline: 'One data pool for your whole trip to Japan.',
    totalGb: 30,
    validityDays: 30,
    simTypes: ['esim', 'usim'],
    networks: ['roaming'],
    directions: ['outbound'],
    coverage: ['japan'],
    benefitIds: ['point', 'nocontract', 'support'],
    noticeIds: ['volume', 'esim', 'coverage', 'price'],
    badge: 'Japan',
    priceKRW: 900, // unit: per day (daily) / per GB (volume)
  },

  // ── Outbound · Asia (China · Taiwan/HK · Southeast Asia) ──────────────
  {
    id: 'asia-daily-5gb',
    kind: 'daily',
    name: 'Asia Daily',
    tagline: 'Local-network priority across Asia. Fast on arrival.',
    dailyGb: 2,
    defaultDays: 3,
    throttleNote: 'Unlimited low-speed (up to 1 Mbps) after the daily cap',
    simTypes: ['esim'],
    networks: ['local', 'roaming'],
    directions: ['outbound'],
    coverage: ['china', 'asia', 'sea'],
    benefitIds: ['point', 'install', '5g', 'support'],
    noticeIds: ['throttle', 'esim', 'coverage', 'price'],
    badge: 'Asia',
    priceKRW: 3200, // unit: per day (daily) / per GB (volume)
  },
  {
    id: 'asia-volume-30gb',
    kind: 'volume',
    name: 'Asia Volume',
    tagline: 'One data pool across Asia for your whole trip.',
    totalGb: 30,
    validityDays: 30,
    simTypes: ['esim', 'usim'],
    networks: ['roaming'],
    directions: ['outbound'],
    coverage: ['china', 'asia', 'sea'],
    benefitIds: ['point', 'nocontract', 'support'],
    noticeIds: ['volume', 'esim', 'coverage', 'price'],
    badge: 'Asia',
    priceKRW: 850, // unit: per day (daily) / per GB (volume)
  },

  // ── Outbound · Europe ────────────────────────────────────────────────
  {
    id: 'europe-daily-5gb',
    kind: 'daily',
    name: 'Europe Daily',
    tagline: 'Fresh data every day across Europe. One plan, many countries.',
    dailyGb: 2,
    defaultDays: 5,
    throttleNote: 'Unlimited low-speed (up to 1 Mbps) after the daily cap',
    simTypes: ['esim'],
    networks: ['roaming'],
    directions: ['outbound'],
    coverage: ['europe'],
    benefitIds: ['point', 'install', '5g'],
    noticeIds: ['throttle', 'esim', 'coverage', 'price'],
    badge: 'Europe',
    priceKRW: 4500, // unit: per day (daily) / per GB (volume)
  },
  {
    id: 'europe-volume-30gb',
    kind: 'volume',
    name: 'Europe Volume',
    tagline: 'One data pool for your whole European trip.',
    totalGb: 30,
    validityDays: 30,
    simTypes: ['esim'],
    networks: ['roaming'],
    directions: ['outbound'],
    coverage: ['europe'],
    benefitIds: ['point', 'nocontract', 'support'],
    noticeIds: ['volume', 'esim', 'coverage', 'price'],
    badge: 'Europe',
    priceKRW: 1300, // unit: per day (daily) / per GB (volume)
  },

  // ── Outbound · North America ─────────────────────────────────────────
  {
    id: 'americas-daily-5gb',
    kind: 'daily',
    name: 'North America Daily',
    tagline: 'Fresh data every day across the US & Canada.',
    dailyGb: 2,
    defaultDays: 5,
    throttleNote: 'Unlimited low-speed (up to 1 Mbps) after the daily cap',
    simTypes: ['esim'],
    networks: ['roaming'],
    directions: ['outbound'],
    coverage: ['americas'],
    benefitIds: ['point', 'install', '5g'],
    noticeIds: ['throttle', 'esim', 'coverage', 'price'],
    badge: 'N. America',
    priceKRW: 4800, // unit: per day (daily) / per GB (volume)
  },
  {
    id: 'americas-volume-30gb',
    kind: 'volume',
    name: 'North America Volume',
    tagline: 'One data pool for your whole trip to the US or Canada.',
    totalGb: 30,
    validityDays: 30,
    simTypes: ['esim'],
    networks: ['roaming'],
    directions: ['outbound'],
    coverage: ['americas'],
    benefitIds: ['point', 'nocontract', 'support'],
    noticeIds: ['volume', 'esim', 'coverage', 'price'],
    badge: 'N. America',
    priceKRW: 1400, // unit: per day (daily) / per GB (volume)
  },

  // ── Outbound · Oceania (Australia, Guam, Saipan) ─────────────────────
  {
    id: 'oceania-daily-5gb',
    kind: 'daily',
    name: 'Oceania Daily',
    tagline: 'Fresh data every day across Australia, Guam & Saipan.',
    dailyGb: 2,
    defaultDays: 4,
    throttleNote: 'Unlimited low-speed (up to 1 Mbps) after the daily cap',
    simTypes: ['esim'],
    networks: ['roaming'],
    directions: ['outbound'],
    coverage: ['oceania'],
    benefitIds: ['point', 'install', '5g'],
    noticeIds: ['throttle', 'esim', 'coverage', 'price'],
    badge: 'Oceania',
    priceKRW: 4200, // unit: per day (daily) / per GB (volume)
  },
  {
    id: 'oceania-volume-20gb',
    kind: 'volume',
    name: 'Oceania Volume',
    tagline: 'One data pool for your trip down under.',
    totalGb: 20,
    validityDays: 30,
    simTypes: ['esim'],
    networks: ['roaming'],
    directions: ['outbound'],
    coverage: ['oceania'],
    benefitIds: ['point', 'nocontract', 'support'],
    noticeIds: ['volume', 'esim', 'coverage', 'price'],
    badge: 'Oceania',
    priceKRW: 1500, // unit: per day (daily) / per GB (volume)
  },

  // ── Outbound · Worldwide (covers any destination) ────────────────────
  {
    id: 'global-daily-5gb',
    kind: 'daily',
    name: 'Global Daily',
    tagline: 'Fresh data every day, worldwide. Great for multi-country trips.',
    dailyGb: 2,
    defaultDays: 3,
    throttleNote: 'Unlimited low-speed (up to 1 Mbps) after the daily cap',
    simTypes: ['esim', 'usim'],
    networks: ['roaming'],
    directions: ['outbound'],
    coverage: 'global',
    benefitIds: ['point', 'install', 'nocontract', '5g'],
    noticeIds: ['throttle', 'esim', 'coverage', 'price'],
    badge: 'Worldwide',
    priceKRW: 5500, // unit: per day (daily) / per GB (volume)
  },
  {
    id: 'global-volume-50gb',
    kind: 'volume',
    name: 'Global Volume',
    tagline: 'One data pool for your whole trip abroad.',
    totalGb: 50,
    validityDays: 30,
    simTypes: ['esim', 'usim'],
    networks: ['roaming'],
    directions: ['outbound'],
    coverage: 'global',
    benefitIds: ['point', 'nocontract', 'support'],
    noticeIds: ['volume', 'esim', 'coverage', 'price'],
    badge: 'Worldwide',
    priceKRW: 1200, // unit: per day (daily) / per GB (volume)
  },
]

// L.POINT partner benefits — kept in an "to be announced" tone until confirmed.
export const BENEFITS: Record<string, Benefit> = {
  point: {
    id: 'point',
    icon: 'point',
    title: 'L.POINT rewards',
    desc: 'Link your L.POINT membership at sign-up — rewards to be announced',
  },
  install: { id: 'install', icon: 'sparkles', title: 'Instant setup', desc: 'eSIM installs instantly via QR' },
  nocontract: { id: 'nocontract', icon: 'shield', title: 'No contract', desc: 'Prepaid · no cancellation fees' },
  '5g': { id: '5g', icon: 'sparkles', title: '5G ready', desc: '5G where the local network supports it' },
  support: { id: 'support', icon: 'shield', title: '24/7 support', desc: 'Customer support around the clock' },
  welcome: { id: 'welcome', icon: 'gift', title: 'Welcome gift', desc: 'New-applicant partner perks to be announced' },
}

// Product notices.
export const NOTICES: Record<string, Notice> = {
  throttle: {
    id: 'throttle',
    text: 'After the daily cap, unlimited low-speed (up to 1 Mbps) applies until the next reset at 00:00 local time.',
  },
  volume: {
    id: 'volume',
    text: 'Volume plans let you use the data freely within the validity period; a top-up is needed once it runs out.',
  },
  esim: {
    id: 'esim',
    text: 'eSIM works on eSIM-capable devices only (iPhone XS or newer and most Android phones).',
  },
  usim_deliver: {
    id: 'usim_deliver',
    text: 'USIM delivery takes 1–2 days after applying and must be received before departure.',
  },
  coverage: {
    id: 'coverage',
    text: 'Speeds may vary depending on local network conditions and where you use the service.',
  },
  price: {
    id: 'price',
    text: 'Prices and benefits will be announced once confirmed; amounts shown here are placeholders (₩—).',
  },
}
