import { useState } from 'react'
import { cn } from '../lib/cn'

// Destination tile — a real place photo with the name overlaid. Falls back to a
// brand-tinted emoji tile if the photo fails to load.
export default function AreaTile({
  name,
  emoji,
  photo,
  active,
  onClick,
}: {
  name: string
  emoji: string
  photo?: string
  active?: boolean
  onClick?: () => void
}) {
  const [failed, setFailed] = useState(false)
  const showPhoto = photo && !failed
  return (
    <button type="button" onClick={onClick} className={cn('area-tile', active && 'is-active')}>
      {showPhoto ? (
        <img
          className="area-tile__img"
          src={photo}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="area-tile__emoji" aria-hidden>
          {emoji}
        </span>
      )}
      <span className="area-tile__scrim" aria-hidden />
      <span className="area-tile__name">{name}</span>
    </button>
  )
}
