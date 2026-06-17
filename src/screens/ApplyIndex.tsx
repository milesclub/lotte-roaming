import { Navigate } from 'react-router-dom'
import { useApplication } from '../store/application'
import { useAuth } from '../store/auth'

// Routes /apply to the right step based on what's already done.
export default function ApplyIndex() {
  const productId = useApplication((s) => s.productId)
  const user = useAuth((s) => s.user)
  if (!productId) return <Navigate to="/" replace />
  // Purchase requires login — gate through the standalone sign-in, then continue.
  if (!user) return <Navigate to="/signin?next=/apply/info" replace />
  return <Navigate to="/apply/info" replace />
}
