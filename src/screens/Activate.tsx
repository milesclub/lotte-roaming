import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { QrCode, Download, Signal, HelpCircle, type LucideIcon } from 'lucide-react'
import Container from '../components/site/Container'
import Segmented from '../components/Segmented'
import Button from '../components/Button'
import { useUI } from '../content'
import { getApplication, updateStatus } from '../lib/applications'

const ICONS: LucideIcon[] = [QrCode, Download, Signal]

// 개통 안내 — 셀프 개통(스캔 → 설치 → 로밍 ON). 완료 시 신청 상태를 completed 로.
export default function Activate() {
  const UI = useUI()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const id = params.get('id') ?? ''
  const application = getApplication(id)
  const [device, setDevice] = useState<'iphone' | 'android'>('iphone')

  const finish = () => {
    if (application) {
      updateStatus(application.id, 'completed')
      navigate(`/applications/${application.id}`, { replace: true })
    } else {
      navigate('/applications')
    }
  }

  return (
    <div className="activate-wrap">
      <Container size="narrow">
        <div className="activate-card">
          <h1 className="activate__title">{UI.activate.title}</h1>
          <p className="activate__sub">{UI.activate.subtitle}</p>

          <div className="activate__device">
            <Segmented
              ariaLabel="device"
              options={[
                { value: 'iphone', label: UI.activate.iphone },
                { value: 'android', label: UI.activate.android },
              ]}
              value={device}
              onChange={setDevice}
            />
          </div>

          <ol className="steps">
            {UI.activate.steps.map((s, i) => {
              const Icon = ICONS[i] ?? QrCode
              const last = i === UI.activate.steps.length - 1
              return (
                <li key={s.title} className="step">
                  <div className="step__rail">
                    <span className="step__icon">
                      <Icon size={19} strokeWidth={2.3} />
                    </span>
                    {!last && <span className="step__line" />}
                  </div>
                  <div className="step__body">
                    <div className="step__title">{s.title}</div>
                    <div className="step__desc">{s.desc}</div>
                  </div>
                </li>
              )
            })}
          </ol>

          <p className="activate__note">{UI.activate.doneNote}</p>

          <Button full className="mt-5" onClick={finish}>
            {UI.activate.done}
          </Button>
          <button type="button" className="activate__help">
            <HelpCircle size={15} /> {UI.activate.help}
          </button>
        </div>
      </Container>
    </div>
  )
}
