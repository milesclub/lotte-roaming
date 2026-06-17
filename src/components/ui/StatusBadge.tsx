import { useUI } from '../../content'
import type { ApplicationStatus } from '../../lib/domain'

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  const UI = useUI()
  return (
    <span className={`status status--${status}`}>
      <span className="status__dot" />
      {UI.status[status]}
    </span>
  )
}
