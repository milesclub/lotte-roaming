// Practical destination facts for the Travel tab. Deliberately language-neutral
// (numbers, plug codes, currency, UTC offset) so cards need no translation.
// Keyed by region with country overrides where it matters. Currency rates are
// illustrative samples — labelled as such in the UI.

export interface CountryInfo {
  police: string
  medical: string
  voltage: string
  plugType: string
  // Local currency; omit `code` to mean "same as KRW" (no converter shown).
  currency?: { code: string; symbol: string; perKRW: number } // local units per 1 KRW
  utcOffset: number // hours
}

const REGION_INFO: Record<string, CountryInfo> = {
  korea: { police: '112', medical: '119', voltage: '220V', plugType: 'C · F', utcOffset: 9 },
  japan: {
    police: '110', medical: '119', voltage: '100V', plugType: 'A · B',
    currency: { code: 'JPY', symbol: '¥', perKRW: 0.11 }, utcOffset: 9,
  },
  china: {
    police: '110', medical: '120', voltage: '220V', plugType: 'A · C · I',
    currency: { code: 'CNY', symbol: '¥', perKRW: 0.0052 }, utcOffset: 8,
  },
  asia: {
    police: '110', medical: '119', voltage: '110V', plugType: 'A · B',
    currency: { code: 'TWD', symbol: 'NT$', perKRW: 0.023 }, utcOffset: 8,
  },
  sea: {
    police: '191', medical: '1669', voltage: '220V', plugType: 'A · C',
    currency: { code: 'THB', symbol: '฿', perKRW: 0.026 }, utcOffset: 7,
  },
  americas: {
    police: '911', medical: '911', voltage: '120V', plugType: 'A · B',
    currency: { code: 'USD', symbol: '$', perKRW: 0.00072 }, utcOffset: -5,
  },
  europe: {
    police: '112', medical: '112', voltage: '230V', plugType: 'C · E · F',
    currency: { code: 'EUR', symbol: '€', perKRW: 0.00068 }, utcOffset: 1,
  },
  oceania: {
    police: '000', medical: '000', voltage: '230V', plugType: 'I',
    currency: { code: 'USD', symbol: '$', perKRW: 0.00072 }, utcOffset: 10,
  },
}

// Country-level overrides (currency/plug/offset that differ from the region).
const PLACE_INFO: Record<string, Partial<CountryInfo>> = {
  VN: { currency: { code: 'VND', symbol: '₫', perKRW: 18 }, utcOffset: 7 },
  SG: { police: '999', medical: '995', currency: { code: 'SGD', symbol: 'S$', perKRW: 0.00097 }, utcOffset: 8 },
  GB: { currency: { code: 'GBP', symbol: '£', perKRW: 0.00058 }, utcOffset: 0 },
  US: { utcOffset: -5 },
  AU: { currency: { code: 'AUD', symbol: 'A$', perKRW: 0.0011 }, utcOffset: 10 },
  GU: { currency: { code: 'USD', symbol: '$', perKRW: 0.00072 }, utcOffset: 10 },
}

export function countryInfoFor(placeCode?: string | null, regionId?: string | null): CountryInfo {
  const base = REGION_INFO[regionId ?? ''] ?? REGION_INFO.korea
  if (placeCode === 'KR') return REGION_INFO.korea
  const over = placeCode ? PLACE_INFO[placeCode] : undefined
  return over ? { ...base, ...over } : base
}
