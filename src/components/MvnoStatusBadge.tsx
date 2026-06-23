import { useUI } from '../content'
import type { MvnoStatus } from '../lib/mvno'

// Maps MVNO statuses onto the existing .status--* color styles.
const TONE: Record<MvnoStatus, string> = {
  submitted: 'submitted',
  pending_activation: 'pending_provisioning',
  active: 'completed',
  failed: 'failed',
}

export default function MvnoStatusBadge({ status }: { status: MvnoStatus }) {
  const UI = useUI()
  return (
    <span className={`status status--${TONE[status]}`}>
      <span className="status__dot" />
      {UI.mvnoStatus[status]}
    </span>
  )
}
