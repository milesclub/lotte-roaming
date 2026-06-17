import type { Benefit, Notice, Product } from '../lib/domain'

// Roaming products — data/duration use the brief's example values only; price
// stays null. Display text is English (base locale). Products are organized by
// region so each destination shows its own roaming plans (Korea, Japan, Asia,
// Europe, North America, Oceania) plus a worldwide fallback.
// One product per country/region. Each supports both daily and volume plans;
// the plan type is chosen in the builder/detail. dailyKRW = per-day (2GB tier),
// volumeKRW = per-GB.
export const PRODUCTS: Product[] = [
  // ── Inbound · Korea ──────────────────────────────────────────────────
  {
    id: 'korea',
    name: 'Korea',
    tagline: 'Prepaid data for your trip to Korea — daily or one pool.',
    dailyGb: 2,
    defaultDays: 3,
    dailyKRW: 3300,
    totalGb: 50,
    validityDays: 30,
    volumeKRW: 780,
    throttleNote: 'Unlimited low-speed (up to 1 Mbps) after the daily cap',
    simTypes: ['esim', 'usim'],
    networks: ['roaming', 'local'],
    directions: ['inbound'],
    coverage: ['korea'],
    benefitIds: ['point', 'install', 'nocontract', '5g', 'support'],
    noticeIds: ['throttle', 'volume', 'esim', 'usim_deliver', 'coverage', 'price'],
    badge: 'Popular',
    recommended: true,
  },

  // ── Outbound · Japan ─────────────────────────────────────────────────
  {
    id: 'japan',
    name: 'Japan',
    tagline: 'Prepaid data for your trip to Japan. Connects on arrival.',
    dailyGb: 2,
    defaultDays: 3,
    dailyKRW: 3500,
    totalGb: 30,
    validityDays: 30,
    volumeKRW: 900,
    throttleNote: 'Unlimited low-speed (up to 1 Mbps) after the daily cap',
    simTypes: ['esim', 'usim'],
    networks: ['roaming'],
    directions: ['outbound'],
    coverage: ['japan'],
    benefitIds: ['point', 'install', 'nocontract', '5g', 'support'],
    noticeIds: ['throttle', 'volume', 'esim', 'usim_deliver', 'coverage', 'price'],
    badge: 'Japan',
    recommended: true,
  },

  // ── Outbound · Asia (China · Taiwan/HK · Southeast Asia) ──────────────
  {
    id: 'asia',
    name: 'Asia',
    tagline: 'Prepaid data across China, Taiwan & Southeast Asia.',
    dailyGb: 2,
    defaultDays: 3,
    dailyKRW: 3200,
    totalGb: 30,
    validityDays: 30,
    volumeKRW: 850,
    throttleNote: 'Unlimited low-speed (up to 1 Mbps) after the daily cap',
    simTypes: ['esim', 'usim'],
    networks: ['roaming'],
    directions: ['outbound'],
    coverage: ['china', 'asia', 'sea'],
    benefitIds: ['point', 'install', 'nocontract', '5g', 'support'],
    noticeIds: ['throttle', 'volume', 'esim', 'coverage', 'price'],
    badge: 'Asia',
  },

  // ── Outbound · Europe ────────────────────────────────────────────────
  {
    id: 'europe',
    name: 'Europe',
    tagline: 'One plan across Europe — daily or one data pool.',
    dailyGb: 2,
    defaultDays: 5,
    dailyKRW: 4500,
    totalGb: 30,
    validityDays: 30,
    volumeKRW: 1300,
    throttleNote: 'Unlimited low-speed (up to 1 Mbps) after the daily cap',
    simTypes: ['esim'],
    networks: ['roaming'],
    directions: ['outbound'],
    coverage: ['europe'],
    benefitIds: ['point', 'install', 'nocontract', '5g', 'support'],
    noticeIds: ['throttle', 'volume', 'esim', 'coverage', 'price'],
    badge: 'Europe',
  },

  // ── Outbound · North America ─────────────────────────────────────────
  {
    id: 'americas',
    name: 'North America',
    tagline: 'Prepaid data across the US & Canada.',
    dailyGb: 2,
    defaultDays: 5,
    dailyKRW: 4800,
    totalGb: 30,
    validityDays: 30,
    volumeKRW: 1400,
    throttleNote: 'Unlimited low-speed (up to 1 Mbps) after the daily cap',
    simTypes: ['esim'],
    networks: ['roaming'],
    directions: ['outbound'],
    coverage: ['americas'],
    benefitIds: ['point', 'install', 'nocontract', '5g', 'support'],
    noticeIds: ['throttle', 'volume', 'esim', 'coverage', 'price'],
    badge: 'N. America',
  },

  // ── Outbound · Oceania (Australia, Guam, Saipan) ─────────────────────
  {
    id: 'oceania',
    name: 'Oceania',
    tagline: 'Prepaid data across Australia, Guam & Saipan.',
    dailyGb: 2,
    defaultDays: 4,
    dailyKRW: 4200,
    totalGb: 20,
    validityDays: 30,
    volumeKRW: 1500,
    throttleNote: 'Unlimited low-speed (up to 1 Mbps) after the daily cap',
    simTypes: ['esim'],
    networks: ['roaming'],
    directions: ['outbound'],
    coverage: ['oceania'],
    benefitIds: ['point', 'install', 'nocontract', '5g', 'support'],
    noticeIds: ['throttle', 'volume', 'esim', 'coverage', 'price'],
    badge: 'Oceania',
  },

  // ── Outbound · Worldwide (covers any destination) ────────────────────
  {
    id: 'global',
    name: 'Global',
    tagline: 'One plan, worldwide — great for multi-country trips.',
    dailyGb: 2,
    defaultDays: 3,
    dailyKRW: 5500,
    totalGb: 50,
    validityDays: 30,
    volumeKRW: 1200,
    throttleNote: 'Unlimited low-speed (up to 1 Mbps) after the daily cap',
    simTypes: ['esim', 'usim'],
    networks: ['roaming'],
    directions: ['outbound'],
    coverage: 'global',
    benefitIds: ['point', 'install', 'nocontract', '5g', 'support'],
    noticeIds: ['throttle', 'volume', 'esim', 'usim_deliver', 'coverage', 'price'],
    badge: 'Worldwide',
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
