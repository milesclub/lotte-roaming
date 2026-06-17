import type { PartnerCategory, TravelDirection } from '../lib/domain'

// Lotte / L.POINT benefits available per region worldwide (e.g. Lotte New York
// Palace in North America). English is the base; ko overrides via
// catalog.lottePerks[id]. All perks stay "to be announced" — no invented numbers.
export interface LottePerk {
  id: string
  category: PartnerCategory
  emoji: string
  title: string
  desc: string
}

export const LOTTE_PERKS: Record<string, LottePerk[]> = {
  korea: [
    { id: 'kr-signiel', category: 'stay', emoji: '🏨', title: 'SIGNIEL Seoul', desc: 'Luxury stay at Lotte World Tower — member perks to be announced' },
    { id: 'kr-world', category: 'tour', emoji: '🎢', title: 'Lotte World · SEOUL SKY', desc: 'Theme-park & observatory partner perks — to be announced' },
    { id: 'kr-dept', category: 'shopping', emoji: '🛍️', title: 'Lotte Department Store', desc: 'Flagship stores nationwide — member discounts to be announced' },
    { id: 'kr-duty', category: 'dutyfree', emoji: '✈️', title: 'Lotte Duty Free', desc: 'Downtown & airport duty-free — perks to be announced' },
  ],
  japan: [
    { id: 'jp-stay', category: 'stay', emoji: '🏨', title: 'Lotte partner hotels', desc: 'Partner stays in Tokyo & Osaka — to be announced' },
    { id: 'jp-shop', category: 'shopping', emoji: '🛍️', title: 'Shopping & dining', desc: 'Lotte & partner shopping perks — to be announced' },
    { id: 'jp-duty', category: 'dutyfree', emoji: '✈️', title: 'Duty-free pickup', desc: 'Lotte Duty Free online order + airport pickup — to be announced' },
  ],
  china: [
    { id: 'cn-duty', category: 'dutyfree', emoji: '✈️', title: 'Lotte Duty Free', desc: 'Downtown & online duty-free — perks to be announced' },
    { id: 'cn-shop', category: 'shopping', emoji: '🛍️', title: 'Partner shopping', desc: 'Lotte & partner shopping — to be announced' },
    { id: 'cn-stay', category: 'stay', emoji: '🏨', title: 'Partner hotels', desc: 'Partner stays — to be announced' },
  ],
  asia: [
    { id: 'as-duty', category: 'dutyfree', emoji: '✈️', title: 'Lotte Duty Free', desc: 'Downtown & airport duty-free — perks to be announced' },
    { id: 'as-shop', category: 'shopping', emoji: '🛍️', title: 'Partner shopping', desc: 'Lotte & partner shopping — to be announced' },
    { id: 'as-tour', category: 'tour', emoji: '🎟️', title: 'Tours & attractions', desc: 'Partner attraction perks — to be announced' },
  ],
  sea: [
    { id: 'sea-hotel', category: 'stay', emoji: '🏨', title: 'Lotte Hotel Hanoi · Saigon', desc: 'Landmark stays in Vietnam — member perks to be announced' },
    { id: 'sea-dept', category: 'shopping', emoji: '🛍️', title: 'Lotte Dept. Store · Mart', desc: 'Hanoi & partner stores — discounts to be announced' },
    { id: 'sea-duty', category: 'dutyfree', emoji: '✈️', title: 'Lotte Duty Free', desc: 'Da Nang & partner duty-free — perks to be announced' },
  ],
  americas: [
    { id: 'us-palace', category: 'stay', emoji: '🏨', title: 'Lotte New York Palace', desc: 'Iconic Midtown Manhattan stay — member perks to be announced' },
    { id: 'us-seattle', category: 'stay', emoji: '🌆', title: 'Lotte Hotel Seattle', desc: 'Downtown Seattle landmark — perks to be announced' },
    { id: 'us-duty', category: 'dutyfree', emoji: '✈️', title: 'Duty-free & partners', desc: 'Lotte Duty Free online + partner offers — to be announced' },
  ],
  europe: [
    { id: 'eu-duty', category: 'dutyfree', emoji: '✈️', title: 'Lotte Duty Free', desc: 'Online order with airport pickup — perks to be announced' },
    { id: 'eu-shop', category: 'shopping', emoji: '🛍️', title: 'Partner shopping', desc: 'Lotte & partner shopping benefits — to be announced' },
    { id: 'eu-stay', category: 'stay', emoji: '🏨', title: 'Partner hotels', desc: 'Partner stays across Europe — to be announced' },
  ],
  oceania: [
    { id: 'oc-guam', category: 'stay', emoji: '🏝️', title: 'Lotte Hotel Guam', desc: 'Tumon Bay beachfront stay — member perks to be announced' },
    { id: 'oc-duty', category: 'dutyfree', emoji: '✈️', title: 'Lotte Duty Free Guam', desc: 'Tumon flagship duty-free — perks to be announced' },
    { id: 'oc-tour', category: 'tour', emoji: '🤿', title: 'Island tours & leisure', desc: 'Partner tour & activity perks — to be announced' },
  ],
  world: [
    { id: 'w-stay', category: 'stay', emoji: '🏨', title: 'Lotte Hotels & Resorts', desc: 'Global Lotte properties — member perks to be announced' },
    { id: 'w-duty', category: 'dutyfree', emoji: '✈️', title: 'Lotte Duty Free', desc: 'Online order + airport pickup — perks to be announced' },
    { id: 'w-lpoint', category: 'lpoint', emoji: '💳', title: 'L.POINT on return', desc: 'Earn L.POINT after your trip — conditions apply' },
  ],
}

export function lottePerksFor(direction: TravelDirection, regionId?: string | null): LottePerk[] {
  if (direction === 'inbound') return LOTTE_PERKS.korea
  return (regionId && LOTTE_PERKS[regionId]) || LOTTE_PERKS.world
}
