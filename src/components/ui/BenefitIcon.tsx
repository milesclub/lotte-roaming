import { Coins, Gift, BadgePercent, ShieldCheck, Sparkles, CreditCard, type LucideIcon } from 'lucide-react'
import type { Benefit } from '../../lib/domain'

const MAP: Record<Benefit['icon'], LucideIcon> = {
  point: Coins,
  gift: Gift,
  percent: BadgePercent,
  shield: ShieldCheck,
  sparkles: Sparkles,
  card: CreditCard,
}

export default function BenefitIcon({ icon, size = 20 }: { icon: Benefit['icon']; size?: number }) {
  const Icon = MAP[icon] ?? Sparkles
  return <Icon size={size} strokeWidth={2.2} />
}
