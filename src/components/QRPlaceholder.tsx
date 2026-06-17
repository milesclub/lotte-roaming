import { cn } from '../lib/cn'

// Visual QR stand-in (the mock eSIM adapter supplies the real LPA payload via
// data-payload for any future real QR renderer to consume).
export default function QRPlaceholder({
  size = 124,
  payload,
  className,
}: {
  size?: number
  payload?: string
  className?: string
}) {
  return (
    <div
      data-payload={payload}
      className={cn('qr', className)}
      style={{
        width: size,
        height: size,
        background: 'repeating-conic-gradient(#1A1A1A 0deg 6deg, #fff 6deg 12deg)',
      }}
      role="img"
      aria-label="eSIM QR code"
    />
  )
}
