import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { LangCode } from '../content'
import type { Review } from '../data/reviews'
import type { TravelDirection } from '../lib/domain'

// User-submitted reviews, persisted locally. They merge with the seeded sample
// reviews on the landing and — being tagged with the author's language — are
// machine-translated for readers in other languages, same as any review.

export interface DraftReview {
  direction: TravelDirection
  lang: LangCode
  author: string
  rating: number
  text: string
  emoji: string
  grad: string
  tag: string
}

interface ReviewState {
  reviews: Review[]
  add: (d: DraftReview) => void
  remove: (id: string) => void
}

let seq = 0

export const useReviews = create<ReviewState>()(
  persist(
    (set) => ({
      reviews: [],
      add: (d) =>
        set((s) => {
          // Stable-ish id without Math.random in hot paths.
          seq += 1
          const id = `rv-user-${Date.now()}-${seq}`
          const date = new Date().toISOString().slice(0, 7) // yyyy-mm
          const review: Review = {
            id,
            direction: d.direction,
            lang: d.lang,
            author: d.author,
            initial: d.author.trim().charAt(0).toUpperCase() || '★',
            flag: LANG_FLAG[d.lang],
            rating: d.rating,
            date,
            tag: d.tag,
            photo: { grad: d.grad, emoji: d.emoji, url: '' },
            text: d.text,
          }
          return { reviews: [review, ...s.reviews] }
        }),
      remove: (id) => set((s) => ({ reviews: s.reviews.filter((r) => r.id !== id) })),
    }),
    { name: 'lr.userReviews', storage: createJSONStorage(() => localStorage) },
  ),
)

export const LANG_FLAG: Record<LangCode, string> = {
  ko: '🇰🇷',
  en: '🇺🇸',
  zh: '🇨🇳',
  ja: '🇯🇵',
}

// Reviews for a direction = user reviews first (newest), then sample reviews.
export function userReviewsFor(direction: TravelDirection): Review[] {
  return useReviews.getState().reviews.filter((r) => r.direction === direction)
}
