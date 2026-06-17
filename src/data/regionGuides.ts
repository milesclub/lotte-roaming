// Per-area recommendations for inbound travelers. Selecting a Korea stay area
// surfaces Lotte-affiliated stays / tours / shopping near it, so the area choice
// actually shapes what we recommend. Text is English (base locale); ko/zh/ja
// override via catalog.areaGuides. All perks stay "to be announced".

export type HighlightCategory = 'stay' | 'tour' | 'shopping' | 'food'

export interface AreaHighlight {
  id: string
  category: HighlightCategory
  emoji: string
  title: string
  desc: string
}

export interface AreaGuide {
  code: string // matches TravelArea.code
  tagline: string
  highlights: AreaHighlight[]
}

export const AREA_GUIDES: Record<string, AreaGuide> = {
  'KR-SEL': {
    code: 'KR-SEL',
    tagline: 'Stay, shop and play around Jamsil, Myeongdong and the Han River.',
    highlights: [
      {
        id: 'sel-stay',
        category: 'stay',
        emoji: '🏨',
        title: 'SIGNIEL Seoul',
        desc: 'Luxury stay at Lotte World Tower — L.POINT member perks to be announced',
      },
      {
        id: 'sel-tour',
        category: 'tour',
        emoji: '🗼',
        title: 'SEOUL SKY · Lotte World',
        desc: "Observatory & theme-park partner perks at Korea's tallest tower — to be announced",
      },
      {
        id: 'sel-shopping',
        category: 'shopping',
        emoji: '🛍️',
        title: 'Lotte Dept. Store Myeongdong',
        desc: 'Flagship store & Lotte Duty Free — member discounts to be announced',
      },
    ],
  },
  'KR-PUS': {
    code: 'KR-PUS',
    tagline: 'Beaches, seafood and shopping around Haeundae and Gwangbok.',
    highlights: [
      {
        id: 'pus-stay',
        category: 'stay',
        emoji: '🏖️',
        title: 'Lotte Hotel Busan',
        desc: 'Stay near Seomyeon & Haeundae — member benefits to be announced',
      },
      {
        id: 'pus-shopping',
        category: 'shopping',
        emoji: '🛍️',
        title: 'Lotte Dept. Store Gwangbok',
        desc: 'Seaside department store with rooftop garden — perks to be announced',
      },
      {
        id: 'pus-tour',
        category: 'tour',
        emoji: '🌊',
        title: 'Haeundae & Gwangalli',
        desc: 'Partner attraction & tour perks along the coast — to be announced',
      },
    ],
  },
  'KR-CJU': {
    code: 'KR-CJU',
    tagline: 'Island nature, resorts and duty-free on Jeju.',
    highlights: [
      {
        id: 'cju-stay',
        category: 'stay',
        emoji: '🌴',
        title: 'Lotte Hotel Jeju',
        desc: 'Resort stay in Jungmun — member benefits to be announced',
      },
      {
        id: 'cju-dutyfree',
        category: 'shopping',
        emoji: '🛍️',
        title: 'Lotte Duty Free Jeju',
        desc: 'Pick up duty-free before you fly — perks to be announced',
      },
      {
        id: 'cju-tour',
        category: 'tour',
        emoji: '🌋',
        title: 'Jeju nature tours',
        desc: 'Partner tour & attraction perks across the island — to be announced',
      },
    ],
  },
  'KR-ICN': {
    code: 'KR-ICN',
    tagline: 'Airport, transit and the gateway to Korea.',
    highlights: [
      {
        id: 'icn-pickup',
        category: 'shopping',
        emoji: '✈️',
        title: 'Lotte Duty Free airport pickup',
        desc: 'Order online, collect at Incheon T1/T2 — perks to be announced',
      },
      {
        id: 'icn-stay',
        category: 'stay',
        emoji: '🏨',
        title: 'Airport-area stays',
        desc: 'Partner hotels for early flights & layovers — to be announced',
      },
    ],
  },
  'KR-GYG': {
    code: 'KR-GYG',
    tagline: 'Theme parks, outlets and day trips around the capital area.',
    highlights: [
      {
        id: 'gyg-shopping',
        category: 'shopping',
        emoji: '🛍️',
        title: 'Lotte Premium Outlets',
        desc: 'Brand outlets around Gyeonggi — member perks to be announced',
      },
      {
        id: 'gyg-tour',
        category: 'tour',
        emoji: '🎢',
        title: 'Theme parks & day trips',
        desc: 'Partner attraction perks near Seoul — to be announced',
      },
    ],
  },
  'KR-GWO': {
    code: 'KR-GWO',
    tagline: 'Mountains, coast and resorts in Gangwon.',
    highlights: [
      {
        id: 'gwo-stay',
        category: 'stay',
        emoji: '⛰️',
        title: 'Resort & leisure stays',
        desc: 'Partner resorts near the coast & slopes — to be announced',
      },
      {
        id: 'gwo-tour',
        category: 'tour',
        emoji: '🚞',
        title: 'Coast & mountain tours',
        desc: 'Partner tour perks across Gangwon — to be announced',
      },
    ],
  },
  'KR-GYB': {
    code: 'KR-GYB',
    tagline: 'History and heritage in the old Silla capital.',
    highlights: [
      {
        id: 'gyb-tour',
        category: 'tour',
        emoji: '🏯',
        title: 'Heritage tours',
        desc: 'Partner heritage-site & tour perks in Gyeongju — to be announced',
      },
      {
        id: 'gyb-stay',
        category: 'stay',
        emoji: '🏨',
        title: 'Heritage-area stays',
        desc: 'Partner stays near the historic district — to be announced',
      },
    ],
  },
  'KR-ETC': {
    code: 'KR-ETC',
    tagline: 'Traveling all over Korea? These come with you everywhere.',
    highlights: [
      {
        id: 'etc-lpoint',
        category: 'shopping',
        emoji: '💳',
        title: 'L.POINT nationwide',
        desc: 'Earn & use L.POINT across Lotte partners countrywide — when membership is linked',
      },
      {
        id: 'etc-stay',
        category: 'stay',
        emoji: '🏨',
        title: 'Lotte Hotels & Resorts',
        desc: 'Stays in major cities nationwide — member benefits to be announced',
      },
      {
        id: 'etc-dutyfree',
        category: 'shopping',
        emoji: '🛍️',
        title: 'Lotte Duty Free',
        desc: 'Downtown & airport duty-free — perks to be announced',
      },
    ],
  },
}

export function getAreaGuide(code: string | null | undefined): AreaGuide | undefined {
  if (!code) return undefined
  return AREA_GUIDES[code]
}

// Curated Korea-trip recommendations for inbound travelers — shown after the
// roaming plans, independent of any stay-area selection.
const INBOUND_PICKS: [string, string][] = [
  ['KR-SEL', 'sel-stay'],
  ['KR-SEL', 'sel-tour'],
  ['KR-SEL', 'sel-shopping'],
  ['KR-CJU', 'cju-stay'],
  ['KR-PUS', 'pus-shopping'],
  ['KR-ETC', 'etc-dutyfree'],
]

export function inboundHighlights(): { code: string; highlight: AreaHighlight }[] {
  const out: { code: string; highlight: AreaHighlight }[] = []
  for (const [code, id] of INBOUND_PICKS) {
    const h = AREA_GUIDES[code]?.highlights.find((x) => x.id === id)
    if (h) out.push({ code, highlight: h })
  }
  return out
}
