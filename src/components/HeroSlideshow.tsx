import { useEffect, useState } from 'react'
import { cn } from '../lib/cn'

// Cross-fading background slideshow for the hero. Cycles when given >1 image.
export default function HeroSlideshow({ images, className }: { images: string[]; className?: string }) {
  const [i, setI] = useState(0)

  // Reset + (re)start the timer whenever the image set changes.
  useEffect(() => {
    setI(0)
    if (images.length < 2) return
    const id = setInterval(() => setI((p) => (p + 1) % images.length), 5000)
    return () => clearInterval(id)
  }, [images])

  return (
    <div className={cn('hero-slides', className)} aria-hidden>
      {images.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt=""
          loading={idx === 0 ? 'eager' : 'lazy'}
          className={cn('hero-slide', idx === i && 'is-on')}
        />
      ))}
    </div>
  )
}
