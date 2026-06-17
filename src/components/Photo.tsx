import { useState } from 'react'
import { IMAGES, type ImageKey } from '../lib/images'
import { cn } from '../lib/cn'

// Real photography with a graceful brand-gradient fallback if the image fails.
export default function Photo({
  img,
  alt,
  className,
  overlay = false,
  children,
}: {
  img: ImageKey
  alt: string
  className?: string
  overlay?: boolean
  children?: React.ReactNode
}) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={cn('photo', className)}>
      {failed ? (
        <div className="photo__fallback" aria-hidden />
      ) : (
        <img
          src={IMAGES[img]}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="photo__img"
        />
      )}
      {overlay && <div className="photo__overlay" aria-hidden />}
      {children && <div className="photo__content">{children}</div>}
    </div>
  )
}
