import { useState } from 'react'
import { Star } from 'lucide-react'
import BottomSheet from './BottomSheet'
import Button from './Button'
import { useUI, useLang } from '../content'
import { useReviews } from '../store/reviews'
import { useAuth } from '../store/auth'
import { cn } from '../lib/cn'
import type { TravelDirection } from '../lib/domain'

const EMOJIS = ['✈️', '🗼', '🏖️', '🍜', '🛍️', '🏯', '🌸', '🗺️']
const GRADS = ['grad-a', 'grad-b', 'grad-c', 'grad-d', 'grad-e']

// Compose + post a user review. Stored locally and tagged with the writer's
// language so it can be machine-translated for other readers.
export default function ReviewForm({
  open,
  onClose,
  direction,
}: {
  open: boolean
  onClose: () => void
  direction: TravelDirection
}) {
  const UI = useUI()
  const lang = useLang((s) => s.lang)
  const user = useAuth((s) => s.user)
  const add = useReviews((s) => s.add)

  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [text, setText] = useState('')
  const [name, setName] = useState(user?.name ?? '')
  const [emoji, setEmoji] = useState(EMOJIS[0])

  const canPost = text.trim().length >= 4

  const post = () => {
    if (!canPost) return
    add({
      direction,
      lang,
      author: name.trim() || 'Traveler',
      rating,
      text: text.trim(),
      emoji,
      grad: GRADS[(rating + emoji.length) % GRADS.length],
      tag: direction === 'inbound' ? 'LOTTE ROAMING · Korea' : 'LOTTE ROAMING',
    })
    // Reset for next time.
    setText('')
    setRating(5)
    setEmoji(EMOJIS[0])
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={UI.direction.reviewFormTitle}>
      <div className="rvform">
        <div className="rvform__block">
          <span className="rvform__label">{UI.direction.reviewRating}</span>
          <div className="rvform__stars" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className="rvform__star"
                aria-label={`${n}`}
                onMouseEnter={() => setHover(n)}
                onClick={() => setRating(n)}
              >
                <Star
                  size={28}
                  className={cn('rvform__staricon', (hover || rating) >= n && 'is-on')}
                  fill={(hover || rating) >= n ? 'currentColor' : 'none'}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="rvform__block">
          <span className="rvform__label">{UI.direction.reviewText}</span>
          <textarea
            className="rvform__textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={UI.direction.reviewTextPh}
            rows={4}
          />
        </div>

        <div className="rvform__block">
          <span className="rvform__label">{UI.direction.reviewName}</span>
          <input
            className="rvform__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={UI.direction.reviewNamePh}
          />
        </div>

        <div className="rvform__block">
          <span className="rvform__label">{UI.direction.reviewPhoto}</span>
          <div className="rvform__emojis">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                className={cn('rvform__emoji', e === emoji && 'is-active')}
                onClick={() => setEmoji(e)}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <Button full disabled={!canPost} onClick={post}>
          {UI.direction.reviewSubmit}
        </Button>
      </div>
    </BottomSheet>
  )
}
