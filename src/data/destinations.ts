import type { Destination, Region, RegionId, TravelArea } from '../lib/domain'

// Korea stay areas for inbound travelers (where they'll spend time in Korea).
export const KOREA_AREAS: TravelArea[] = [
  { code: 'KR-SEL', name: 'Seoul', emoji: '🏙️', popular: true },
  { code: 'KR-PUS', name: 'Busan', emoji: '🌊', popular: true },
  { code: 'KR-CJU', name: 'Jeju', emoji: '🍊', popular: true },
  { code: 'KR-ICN', name: 'Incheon', emoji: '✈️' },
  { code: 'KR-GYG', name: 'Gyeonggi', emoji: '🎢' },
  { code: 'KR-GWO', name: 'Gangwon', emoji: '⛰️' },
  { code: 'KR-GYB', name: 'Gyeongju', emoji: '🏯' },
  { code: 'KR-ETC', name: 'Anywhere', emoji: '🇰🇷' },
]

// Travel regions — names are English (base locale); zh/ja overrides live in the
// content catalog.
export const REGIONS: Region[] = [
  { id: 'japan', name: 'Japan' },
  { id: 'china', name: 'China' },
  { id: 'asia', name: 'Asia' },
  { id: 'sea', name: 'Southeast Asia' },
  { id: 'americas', name: 'Americas' },
  { id: 'europe', name: 'Europe' },
  { id: 'oceania', name: 'Oceania & more' },
]

export const DESTINATIONS: Destination[] = [
  { code: 'JP', name: 'Japan', regionId: 'japan', flag: '🇯🇵', popular: true },
  { code: 'CN', name: 'China', regionId: 'china', flag: '🇨🇳', popular: true },
  { code: 'TW', name: 'Taiwan', regionId: 'asia', flag: '🇹🇼', popular: true },
  { code: 'HK', name: 'Hong Kong', regionId: 'asia', flag: '🇭🇰' },
  { code: 'VN', name: 'Vietnam', regionId: 'sea', flag: '🇻🇳', popular: true },
  { code: 'TH', name: 'Thailand', regionId: 'sea', flag: '🇹🇭', popular: true },
  { code: 'SG', name: 'Singapore', regionId: 'sea', flag: '🇸🇬' },
  { code: 'PH', name: 'Philippines', regionId: 'sea', flag: '🇵🇭' },
  { code: 'ID', name: 'Indonesia', regionId: 'sea', flag: '🇮🇩' },
  { code: 'MY', name: 'Malaysia', regionId: 'sea', flag: '🇲🇾' },
  { code: 'US', name: 'United States', regionId: 'americas', flag: '🇺🇸', popular: true },
  { code: 'CA', name: 'Canada', regionId: 'americas', flag: '🇨🇦' },
  { code: 'FR', name: 'France', regionId: 'europe', flag: '🇫🇷', popular: true },
  { code: 'GB', name: 'United Kingdom', regionId: 'europe', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', regionId: 'europe', flag: '🇩🇪' },
  { code: 'IT', name: 'Italy', regionId: 'europe', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', regionId: 'europe', flag: '🇪🇸' },
  { code: 'AU', name: 'Australia', regionId: 'oceania', flag: '🇦🇺' },
  { code: 'GU', name: 'Guam', regionId: 'oceania', flag: '🇬🇺', popular: true },
  { code: 'SA', name: 'Saipan', regionId: 'oceania', flag: '🇲🇵' },
]

export function regionName(id: RegionId): string {
  return REGIONS.find((r) => r.id === id)?.name ?? id
}
