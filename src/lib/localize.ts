import { getUI } from '../content'
import { FAQ } from '../data/faq'
import { getDestination } from './shop'
import type { AreaGuide, AreaHighlight } from '../data/regionGuides'
import type { Review } from '../data/reviews'
import type {
  Benefit,
  FaqItem,
  Notice,
  PartnerBenefit,
  Product,
  TravelDirection,
} from './domain'

// Localized accessors for catalog content (product/benefit/notice/faq text).
// Prefer the active locale's catalog, fall back to the English text in src/data.

export const productName = (p: Product): string =>
  getUI().catalog.products[p.id]?.name ?? p.name

export const productTagline = (p: Product): string =>
  getUI().catalog.products[p.id]?.tagline ?? p.tagline

export const benefitTitle = (b: Benefit): string =>
  getUI().catalog.benefits[b.id]?.title ?? b.title

export const benefitDesc = (b: Benefit): string =>
  getUI().catalog.benefits[b.id]?.desc ?? b.desc

export const noticeText = (n: Notice): string => getUI().catalog.notices[n.id] ?? n.text

export const faqItems = (direction: TravelDirection): FaqItem[] =>
  getUI().catalog.faq[direction] ?? FAQ

export const partnerTitle = (b: PartnerBenefit): string =>
  getUI().catalog.partners?.[b.id]?.title ?? b.title

export const partnerDesc = (b: PartnerBenefit): string =>
  getUI().catalog.partners?.[b.id]?.desc ?? b.desc

export const lottePerkTitle = (p: { id: string; title: string }): string =>
  getUI().catalog.lottePerks?.[p.id]?.title ?? p.title
export const lottePerkDesc = (p: { id: string; desc: string }): string =>
  getUI().catalog.lottePerks?.[p.id]?.desc ?? p.desc

// Area guides (inbound region recommendations).
export const areaTagline = (g: AreaGuide): string =>
  getUI().catalog.areaGuides?.[g.code]?.tagline ?? g.tagline

export const highlightTitle = (code: string, h: AreaHighlight): string =>
  getUI().catalog.areaGuides?.[code]?.highlights?.[h.id]?.title ?? h.title

export const highlightDesc = (code: string, h: AreaHighlight): string =>
  getUI().catalog.areaGuides?.[code]?.highlights?.[h.id]?.desc ?? h.desc

// Reviews.
export const reviewText = (r: Review): string => getUI().catalog.reviews?.[r.id]?.text ?? r.text
export const reviewTag = (r: Review): string => getUI().catalog.reviews?.[r.id]?.tag ?? r.tag

// Destination display for summaries: inbound → Korea; outbound → the country.
export function destinationDisplay(
  direction: TravelDirection,
  code: string | null | undefined,
): { emoji: string; name: string } {
  if (direction === 'inbound') return { emoji: '🇰🇷', name: getUI().browse.koreaName }
  const d = getDestination(code)
  return d ? { emoji: d.flag, name: d.name } : { emoji: '🌐', name: '—' }
}
