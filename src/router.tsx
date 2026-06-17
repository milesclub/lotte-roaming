import { createHashRouter, Navigate } from 'react-router-dom'
import AppShell from './components/site/AppShell'
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

// 100% client-side routing (HashRouter) so the build runs from any static host
// or a native shell without server rewrites.
export const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Landing /> }, // 진입 · 빌더 · 혜택
      { path: 'travel', element: <Travel /> }, // 여행: 활성 로밍 여행지 혜택·정보
      { path: 'roaming/:productId', element: <ProductDetail /> }, // 상품 상세 + 옵션
      { path: 'signin', element: <SignIn /> }, // 로그인 (구매와 분리)
      { path: 'apply', element: <ApplyIndex /> }, // 단계 라우팅 (로그인 게이트)
      { path: 'apply/info', element: <ApplicantInfo /> }, // 1 신청 정보
      { path: 'apply/confirm', element: <ApplyConfirm /> }, // 2 신청 확인
      { path: 'apply/complete', element: <ApplyComplete /> }, // 3 완료
      { path: 'applications', element: <Applications /> }, // 신청 내역
      { path: 'applications/:id', element: <ApplicationDetail /> }, // 신청 상세 · 상태
      { path: 'activate', element: <Activate /> }, // 개통 안내
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
