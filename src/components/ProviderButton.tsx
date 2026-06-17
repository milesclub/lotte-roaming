import { Apple, Mail, Loader2 } from 'lucide-react'
import type { AuthProvider } from '../lib/auth'
import { cn } from '../lib/cn'

// Brand-styled "Continue with …" buttons. Colors follow each provider's
// published sign-in button guidelines; marks are simple representative glyphs
// (not pixel-exact logos) so nothing copyrighted is reproduced.

export interface ProviderStyle {
  bg: string
  fg: string
  ring?: boolean
  Mark: (p: { className?: string }) => JSX.Element
}

export const PROVIDER_META: Record<AuthProvider, ProviderStyle> = {
  kakao: { bg: '#FEE500', fg: '#191600', Mark: ChatBubble },
  line: { bg: '#06C755', fg: '#ffffff', Mark: LineMark },
  google: { bg: '#ffffff', fg: '#1f1f1f', ring: true, Mark: GoogleG },
  apple: { bg: '#000000', fg: '#ffffff', Mark: (p) => <Apple {...p} size={19} fill="currentColor" strokeWidth={0} /> },
  wechat: { bg: '#07C160', fg: '#ffffff', Mark: WeChatMark },
  email: { bg: '#f4f4f5', fg: '#1a1a1a', Mark: (p) => <Mail {...p} size={18} strokeWidth={2.2} /> },
}

export default function ProviderButton({
  provider,
  label,
  onClick,
  disabled,
  loading,
}: {
  provider: AuthProvider
  label: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}) {
  const m = PROVIDER_META[provider]
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn('provider-btn', m.ring && 'provider-btn--ring')}
      style={{ background: m.bg, color: m.fg }}
    >
      <span className="provider-btn__mark">
        {loading ? <Loader2 size={18} className="spin" /> : <m.Mark />}
      </span>
      {label}
    </button>
  )
}

// ── Marks ────────────────────────────────────────────────────────────────
function ChatBubble({ className }: { className?: string }) {
  // Rounded speech bubble (Kakao-style) — inherits currentColor.
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12 3.2c-5 0-9 3.1-9 7 0 2.5 1.7 4.7 4.3 6-.2.7-.7 2.5-.8 2.9-.1.4.1.4.3.3.3-.1 2.8-1.9 3.4-2.3.6.1 1.2.1 1.8.1 5 0 9-3.1 9-7s-4-7-9-7Z" />
    </svg>
  )
}

function LineMark({ className }: { className?: string }) {
  // White rounded bubble on LINE green.
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M12 3.4c-5.1 0-9.2 3.3-9.2 7.3 0 3.6 3.2 6.6 7.6 7.2.3.1.7.2.8.5.1.3 0 .7 0 .9l-.1.8c0 .2-.2.9.8.5s5.3-3.1 7.2-5.3c1.3-1.4 2-2.9 2-4.6 0-4-4.1-7.3-9.1-7.3Z" />
    </svg>
  )
}

function WeChatMark({ className }: { className?: string }) {
  // Two overlapping bubbles (WeChat-style), white on green.
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M9 4C5.1 4 2 6.6 2 9.8c0 1.8 1 3.4 2.6 4.5l-.6 1.9 2.2-1.1c.6.2 1.2.3 1.8.3-.1-.4-.2-.9-.2-1.3 0-3 2.9-5.3 6.4-5.3h.3C13.9 6 11.7 4 9 4Z" />
      <path d="M22 14.4c0-2.6-2.6-4.7-5.8-4.7s-5.8 2.1-5.8 4.7 2.6 4.7 5.8 4.7c.6 0 1.2-.1 1.8-.3l1.9 1-.5-1.6c1.6-.9 2.6-2.2 2.6-3.8Z" />
    </svg>
  )
}

function GoogleG({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.3C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.6 5.1C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.3C39.9 35.7 44 30.4 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  )
}
