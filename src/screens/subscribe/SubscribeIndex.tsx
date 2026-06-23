import { Navigate } from 'react-router-dom'
import { useSubscribe } from '../../store/subscribe'
import { useAuth } from '../../store/auth'

// Gate: need a chosen plan + a signed-in user before entering the funnel.
export default function SubscribeIndex() {
  const planId = useSubscribe((s) => s.planId)
  const user = useAuth((s) => s.user)
  if (!planId) return <Navigate to="/plans" replace />
  if (!user) return <Navigate to="/signin?next=/subscribe/info" replace />
  return <Navigate to="/subscribe/info" replace />
}
