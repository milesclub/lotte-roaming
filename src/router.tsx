import { createHashRouter, Navigate } from 'react-router-dom'
import AppShell from './components/site/AppShell'
import Hub from './screens/Hub'
import Landing from './screens/Landing'
import Travel from './screens/Travel'
import ProductDetail from './screens/ProductDetail'
import ApplyIndex from './screens/ApplyIndex'
import SignIn from './screens/SignIn'
import ApplicantInfo from './screens/ApplicantInfo'
import ApplyConfirm from './screens/ApplyConfirm'
import ApplyComplete from './screens/ApplyComplete'
import Applications from './screens/Applications'
import ApplicationDetail from './screens/ApplicationDetail'
import Activate from './screens/Activate'
import Plans from './screens/Plans'
import PlanDetail from './screens/PlanDetail'
import SubscribeIndex from './screens/subscribe/SubscribeIndex'
import SubscriberInfo from './screens/subscribe/SubscriberInfo'
import SubscribeConfirm from './screens/subscribe/SubscribeConfirm'
import SubscribeComplete from './screens/subscribe/SubscribeComplete'
import SubscriptionDetail from './screens/SubscriptionDetail'

// 100% client-side routing (HashRouter) so the build runs from any static host
// or a native shell without server rewrites.
export const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Hub /> }, // 홈 허브: 일상(MVNO) / 여행(로밍)

      // ── 여행 · 로밍 ──────────────────────────────────────────────────
      { path: 'roaming', element: <Landing /> }, // 로밍 홈 · 빌더 · 혜택
      { path: 'travel', element: <Travel /> }, // 여행: 활성 로밍 여행지 혜택·정보
      { path: 'roaming/:productId', element: <ProductDetail /> }, // 로밍 상품 상세

      // ── 일상 · MVNO 요금제 ──────────────────────────────────────────
      { path: 'plans', element: <Plans /> }, // 알뜰폰 요금제 카탈로그
      { path: 'plans/:planId', element: <PlanDetail /> }, // 요금제 상세
      { path: 'subscribe', element: <SubscribeIndex /> }, // 가입 게이트(로그인)
      { path: 'subscribe/info', element: <SubscriberInfo /> }, // 1 가입자 정보·본인인증
      { path: 'subscribe/confirm', element: <SubscribeConfirm /> }, // 2 확인·결제 동의
      { path: 'subscribe/complete', element: <SubscribeComplete /> }, // 3 완료
      { path: 'subscriptions/:id', element: <SubscriptionDetail /> }, // 구독 상세·청구·사용량

      // ── 공용 ────────────────────────────────────────────────────────
      { path: 'signin', element: <SignIn /> }, // 로그인 (구매와 분리)
      { path: 'apply', element: <ApplyIndex /> }, // 로밍 신청 게이트
      { path: 'apply/info', element: <ApplicantInfo /> },
      { path: 'apply/confirm', element: <ApplyConfirm /> },
      { path: 'apply/complete', element: <ApplyComplete /> },
      { path: 'applications', element: <Applications /> }, // MY: 신청·구독 내역
      { path: 'applications/:id', element: <ApplicationDetail /> },
      { path: 'activate', element: <Activate /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
