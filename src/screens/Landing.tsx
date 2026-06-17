import { useState } from 'react'
import { ChevronRight, PenLine } from 'lucide-react'
import Container from '../components/site/Container'
import ReviewCard from '../components/ReviewCard'
import ReviewForm from '../components/ReviewForm'
import Reveal from '../components/Reveal'
import Carousel from '../components/Carousel'
import CardStack from '../components/CardStack'
import PlanBuilder from '../components/PlanBuilder'
import TripReminder from '../components/TripReminder'
import GuideThumb from '../components/GuideThumb'
import HeroSlideshow from '../components/HeroSlideshow'
import Stars from '../components/ui/Stars'
import { heroSlidesFor, guidePhoto } from '../lib/images'
import { useUI } from '../content'
import { useApplication } from '../store/application'
import { useReviews } from '../store/reviews'
import { getDestination } from '../lib/shop'
import { inboundHighlights } from '../data/regionGuides'
import { lottePerksFor } from '../data/lottePerks'
import { reviewStats, reviewsFor } from '../data/reviews'
import { faqItems, highlightDesc, highlightTitle, lottePerkDesc, lottePerkTitle } from '../lib/localize'
import { cn } from '../lib/cn'
import type { TravelDirection } from '../lib/domain'

// Interactive landing — branches on travel direction (한국으로 / 해외로).
export default function Landing() {
  const UI = useUI()
  const direction = useApplication((s) => s.direction)
  const setDirection = useApplication((s) => s.setDirection)
  const destinationCode = useApplication((s) => s.destinationCode)

  const faqs = faqItems(direction)
  // Inbound: curated Korea-trip recommendations (shown after the roaming plans).
  const koreaPicks = direction === 'inbound' ? inboundHighlights() : []
  // User-written reviews (persisted) appear first, then the seeded samples.
  const userReviews = useReviews((s) => s.reviews).filter((r) => r.direction === direction)
  const reviews = [...userReviews, ...reviewsFor(direction)]
  const sampleStats = reviewStats(direction)
  const count = sampleStats.count + userReviews.length
  const avg =
    count === 0
      ? 0
      : Math.round(
          ((sampleStats.avg * sampleStats.count + userReviews.reduce((a, r) => a + r.rating, 0)) /
            count) *
            10,
        ) / 10
  const stats = { avg, count }
  const [writeOpen, setWriteOpen] = useState(false)

  // Region drives the hero slideshow + the Lotte benefits shown.
  const region = direction === 'inbound' ? 'korea' : getDestination(destinationCode)?.regionId
  const heroSlides = heroSlidesFor(direction, region)
  const perks = lottePerksFor(direction, region)
  const flowKey = `${direction}-${destinationCode ?? 'none'}`

  const DIR_EMOJI: Record<TravelDirection, string> = { inbound: '🇰🇷', outbound: '🌏' }

  const perkFaces = perks.map((b, i) => (
    <div key={b.id} className={`benefit-face benefit-face--${b.category}`}>
      <span className="benefit-face__emoji" aria-hidden>
        {b.emoji}
      </span>
      <div className="benefit-face__top">
        <span className="benefit-face__cat">{UI.direction.categories[b.category]}</span>
        <span className="benefit-face__no">{String(i + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="benefit-face__title">{lottePerkTitle(b)}</h3>
      <p className="benefit-face__desc">{lottePerkDesc(b)}</p>
      <div className="benefit-face__foot">
        <span className="benefit-face__brand">
          <span className="benefit-face__dot" aria-hidden />
          {UI.direction.brandTag}
        </span>
        <ChevronRight size={18} className="benefit-face__arrow" />
      </div>
    </div>
  ))

  return (
    <Container size="wide" className="page-pad stack">
      {/* Pre-trip / in-trip reminder (driven by the latest application) */}
      <TripReminder />

      {/* Hero — direction toggle + plan builder over a trip photo */}
      <section className="shop-hero shop-hero--builder">
        <HeroSlideshow className="shop-hero__bg" images={heroSlides} />
        <span className="shop-hero__veil" aria-hidden />
        <div className="shop-hero__content">
          {/* <span className="hero__eyebrow">{UI.brand.affiliate}</span> */}
          <h1 className="shop-hero__title">{UI.direction.question}</h1>
          <div className="dir-seg" role="radiogroup" aria-label={UI.direction.question}>
            {(['inbound', 'outbound'] as TravelDirection[]).map((d) => (
              <button
                key={d}
                type="button"
                role="radio"
                aria-checked={direction === d}
                onClick={() => setDirection(d)}
                className={cn('dir-seg__btn', direction === d && 'is-active')}
              >
                <span className="dir-seg__emoji" aria-hidden>
                  {DIR_EMOJI[d]}
                </span>
                {UI.direction[d].tab}
              </button>
            ))}
          </div>

          {/* Build a plan (destination → type → amount → price → detail) */}
          <PlanBuilder />
        </div>
      </section>

      {/* Korea-trip recommendations (inbound) — after the roaming plans */}
      {koreaPicks.length > 0 && (
        <Reveal as="section">
          <div className="section-head">
            <h2 className="section-title">{UI.direction.koreaGuideTitle}</h2>
          </div>
          <p className="guide-tagline">{UI.direction.koreaGuideSub}</p>
          <div className="guide-grid stagger">
            {koreaPicks.map(({ code, highlight: h }) => (
              <div key={`${code}-${h.id}`} className="guide-card">
                <GuideThumb photo={guidePhoto(h.id)} emoji={h.emoji} />
                <div className="guide-card__body">
                  <span className="guide-card__cat">{UI.direction.guideCategories[h.category]}</span>
                  <div className="guide-card__title">{highlightTitle(code, h)}</div>
                  <div className="guide-card__desc">{highlightDesc(code, h)}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="partner-note">{UI.direction.guideNote}</p>
        </Reveal>
      )}

      {/* Lotte benefits — region-aware. Mobile: swipe deck · Desktop: grid */}
      <Reveal as="section">
        <div className="section-head">
          <h2 className="section-title">{UI.direction.partnersTitle}</h2>
          <span className="swipe-hint benefit-mobile">{UI.direction.swipeHint}</span>
        </div>
        <div className="benefit-mobile">
          <CardStack className="cardstack--benefits" ariaLabel={UI.direction.partnersTitle} key={`perks-m-${flowKey}`}>
            {perkFaces}
          </CardStack>
        </div>
        <div className="benefit-grid benefit-desktop" key={`perks-d-${flowKey}`}>
          {perkFaces}
        </div>
        <p className="partner-note">{UI.direction.partnerNote}</p>
      </Reveal>

      {/* Reviews */}
      {reviews.length > 0 && (
        <Reveal as="section">
          <div className="section-head">
            <h2 className="section-title">{UI.direction.reviewsTitle}</h2>
            <span className="reviews-summary">
              <Stars rating={stats.avg} size={15} />
              <span>
                {stats.avg.toFixed(1)} · {stats.count} {UI.direction.reviewsUnit}
              </span>
            </span>
          </div>
          <Carousel
            className="carousel--reviews"
            ariaLabel={UI.direction.reviewsTitle}
            key={`reviews-${direction}-${userReviews.length}`}
          >
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </Carousel>
          <button type="button" className="review-write" onClick={() => setWriteOpen(true)}>
            <PenLine size={16} /> {UI.direction.reviewWrite}
          </button>
        </Reveal>
      )}

      <ReviewForm open={writeOpen} onClose={() => setWriteOpen(false)} direction={direction} />

      {/* FAQ (per direction) */}
      <Reveal as="section" className="faq-card">
        <h2 className="faq__title">{UI.home.faqTitle}</h2>
        <div>
          {faqs.map((f) => (
            <details key={f.q} className="faq__item">
              <summary className="faq__q">
                {f.q}
                <ChevronRight size={18} className="faq__chevron" />
              </summary>
              <p className="faq__a">{f.a}</p>
            </details>
          ))}
        </div>
      </Reveal>
    </Container>
  )
}
