import { useEffect, useState } from 'react'
import { Languages } from 'lucide-react'
import Stars from './ui/Stars'
import { useUI, useLang } from '../content'
import { reviewTag } from '../lib/localize'
import { translateText } from '../lib/translate'
import type { Review } from '../data/reviews'

// User review card — avatar, star rating, a real trip photo and text. Reviews
// written in another language are machine-translated to the active language and
// flagged "Translated", with a toggle back to the original.
export default function ReviewCard({ review }: { review: Review }) {
  const UI = useUI()
  const lang = useLang((s) => s.lang)
  const [failed, setFailed] = useState(false)

  const needsTx = review.lang !== lang
  const [translated, setTranslated] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  // Default to showing the translation when one is needed.
  const [showOriginal, setShowOriginal] = useState(!needsTx)

  // Fetch the translation once per (review, language) pair.
  useEffect(() => {
    setShowOriginal(!needsTx)
    setTranslated(null)
    if (!needsTx) {
      setStatus('idle')
      return
    }
    let alive = true
    setStatus('loading')
    translateText(review.text, review.lang, lang)
      .then((out) => {
        if (!alive) return
        setTranslated(out)
        setStatus('done')
      })
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
    }
  }, [review.id, review.text, review.lang, lang, needsTx])

  const showingTranslation = needsTx && !showOriginal && status === 'done' && translated
  const bodyText = showingTranslation ? translated! : review.text

  return (
    <article className="review-card">
      <div className={`review-card__photo ${failed ? review.photo.grad : ''}`}>
        {failed ? (
          <span className="review-card__photo-emoji" aria-hidden>
            {review.photo.emoji}
          </span>
        ) : (
          <img
            className="review-card__img"
            src={review.photo.url}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
          />
        )}
        <span className="review-card__tag">{reviewTag(review)}</span>
      </div>
      <div className="review-card__body">
        <div className="review-card__head">
          <span className="review-card__avatar" aria-hidden>
            {review.initial}
          </span>
          <div className="review-card__who">
            <span className="review-card__author">
              <span aria-hidden>{review.flag}</span> {review.author}
            </span>
            <span className="review-card__verified">{UI.direction.reviewVerified}</span>
          </div>
        </div>
        <div className="review-card__rate">
          <Stars rating={review.rating} />
          <span className="review-card__date">{review.date}</span>
        </div>
        <p className="review-card__text">{bodyText}</p>

        {needsTx && status === 'loading' && (
          <span className="review-card__txstate">
            <Languages size={13} /> {UI.direction.reviewTranslating}
          </span>
        )}
        {needsTx && status === 'done' && translated && (
          <div className="review-card__txrow">
            {!showOriginal && (
              <span className="review-card__txbadge">
                <Languages size={13} /> {UI.direction.reviewTranslated}
              </span>
            )}
            <button
              type="button"
              className="review-card__txtoggle"
              onClick={() => setShowOriginal((v) => !v)}
            >
              {showOriginal ? UI.direction.reviewShowTranslation : UI.direction.reviewShowOriginal}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
