import { useState } from 'react'

// Guide-card thumbnail: shows the item's real photo, falling back to the emoji
// tile if there's no photo or the image fails to load.
export default function GuideThumb({ photo, emoji }: { photo?: string; emoji: string }) {
  const [failed, setFailed] = useState(false)
  if (!photo || failed) {
    return (
      <span className="guide-card__emoji" aria-hidden>
        {emoji}
      </span>
    )
  }
  return (
    <img
      className="guide-card__photo"
      src={photo}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
