// Curated real travel photography (Unsplash CDN, verified to resolve). Swap these
// for licensed LOTTE / L.POINT assets later — the role/area keys stay the same.
const U = (id: string, w = 800, q = 70) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=${q}&auto=format&fit=crop`

export const IMAGES = {
  // S1 Discover hero — Seoul at large
  heroDiscover: U('1538485399081-7191377e8241', 1000, 72),
  // Direction heroes
  heroInbound: U('1538485399081-7191377e8241', 1200, 72),
  heroOutbound: U('1502602898657-3e91760cbb34', 1200, 72),
  // Arrival / airport mood
  arrival: U('1538669715315-155098f0fb1d'),
  // Welcome perk / duty-free / shopping
  dutyFree: U('1601972599720-36938d4ecd31'),
  // Near you — street / Myeongdong
  street: U('1535139262971-c51845709a48'),
  // City skyline / Lotte World Tower area
  skyline: U('1548115184-bc6544d06a58'),
  // Han river / night
  hanRiver: U('1517154421773-0529f29ea451'),
  // Palace / heritage
  palace: U('1583833008338-31a6657917ab'),
  // Food / dining
  food: U('1578637387939-43c525550085'),
} as const

export type ImageKey = keyof typeof IMAGES

// Per-area / per-country photos for the destination tiles (Korea areas + the
// popular outbound countries). Everything else falls back by region.
export const AREA_PHOTOS: Record<string, string> = {
  // Korea stay areas (codes match KOREA_AREAS)
  'KR-SEL': U('1517154421773-0529f29ea451'),
  'KR-PUS': U('1599561046251-bfb9465b4c44'),
  'KR-CJU': U('1635776062043-223faf322554'),
  'KR-ICN': U('1538669715315-155098f0fb1d'),
  'KR-GYG': U('1505993597083-3bd19fb75e57'),
  'KR-GWO': U('1611348586804-61bf6c080437'),
  'KR-GYB': U('1583833008338-31a6657917ab'),
  'KR-ETC': U('1548115184-bc6544d06a58'),
  // Popular outbound countries (codes match DESTINATIONS)
  JP: U('1492571350019-22de08371fd3'),
  CN: U('1547981609-4b6bfe67ca0b'),
  TW: U('1470004914212-05527e49370b'),
  HK: U('1555217851-6141535bd771'),
  VN: U('1528127269322-539801943592'),
  TH: U('1506973035872-a4ec16b8e8d9'),
  SG: U('1525625293386-3f8f99389edd'),
  PH: U('1505228395891-9a51e7e86bf6'),
  US: U('1485738422979-f5c462d49f74'),
  CA: U('1517935706615-2717063c2225'),
  FR: U('1502602898657-3e91760cbb34'),
  GB: U('1513635269975-59663e0ac1ad'),
  DE: U('1599946347371-68eb71b16afc'),
  AU: U('1523482580672-f109ba8cb9be'),
  GU: U('1533050487297-09b450131914'),
}

// Region fallback for any destination without a dedicated photo.
export const REGION_PHOTOS: Record<string, string> = {
  korea: AREA_PHOTOS['KR-ETC'],
  japan: AREA_PHOTOS.JP,
  china: AREA_PHOTOS.CN,
  asia: AREA_PHOTOS.TW,
  sea: AREA_PHOTOS.TH,
  americas: AREA_PHOTOS.US,
  europe: AREA_PHOTOS.FR,
  oceania: AREA_PHOTOS.GU,
}

export function areaPhoto(code?: string | null, regionId?: string | null): string | undefined {
  if (code && AREA_PHOTOS[code]) return AREA_PHOTOS[code]
  if (regionId && REGION_PHOTOS[regionId]) return REGION_PHOTOS[regionId]
  return undefined
}

// Hero slideshow sets — each region's character/landmarks/tradition. Cross-fades
// in the home hero. Keyed by RegionId (+ 'korea' for inbound, 'world' default).
const H = (id: string) => U(id, 1400, 72)
export const HERO_SLIDES: Record<string, string[]> = {
  korea: [
    H('1538485399081-7191377e8241'), // Seoul skyline
    H('1583833008338-31a6657917ab'), // palace
    H('1601628828688-632f38a5a7d0'), // Gyeongbokgung
    H('1517154421773-0529f29ea451'), // Han river at night
  ],
  japan: [
    H('1492571350019-22de08371fd3'), // Tokyo
    H('1493976040374-85c8e12f0c0e'), // Mt. Fuji
    H('1478436127897-769e1b3f0f36'), // torii gate
  ],
  china: [H('1547981609-4b6bfe67ca0b')],
  asia: [H('1470004914212-05527e49370b')],
  sea: [H('1506973035872-a4ec16b8e8d9'), H('1528127269322-539801943592')],
  americas: [H('1485738422979-f5c462d49f74'), H('1501594907352-04cda38ebc29')],
  europe: [H('1502602898657-3e91760cbb34'), H('1467269204594-9661b134dd2b')],
  oceania: [H('1523482580672-f109ba8cb9be'), H('1533050487297-09b450131914')],
  world: [
    H('1502602898657-3e91760cbb34'),
    H('1485738422979-f5c462d49f74'),
    H('1492571350019-22de08371fd3'),
    H('1523482580672-f109ba8cb9be'),
  ],
}

export function heroSlidesFor(direction: 'inbound' | 'outbound', regionId?: string | null): string[] {
  if (direction === 'inbound') return HERO_SLIDES.korea
  if (regionId && HERO_SLIDES[regionId]) return HERO_SLIDES[regionId]
  return HERO_SLIDES.world
}
