import { useState } from 'react'
import Container from '../components/site/Container'
import PageHeader from '../components/site/PageHeader'
import MvnoPlanCard from '../components/MvnoPlanCard'
import { useUI } from '../content'
import { filterPlans, MVNO_NETWORKS, type MvnoNetwork, type MvnoTech } from '../lib/mvno'
import { cn } from '../lib/cn'

type TechFilter = MvnoTech | 'all'
type NetFilter = MvnoNetwork | 'all'

// MVNO (알뜰폰) plan catalog with simple tech + network filters.
export default function Plans() {
  const UI = useUI()
  const [tech, setTech] = useState<TechFilter>('all')
  const [network, setNetwork] = useState<NetFilter>('all')

  const plans = filterPlans({ tech, network })

  const techOpts: { value: TechFilter; label: string }[] = [
    { value: 'all', label: UI.mvno.all },
    { value: 'lte', label: 'LTE' },
    { value: '5g', label: '5G' },
  ]
  const netOpts: { value: NetFilter; label: string }[] = [
    { value: 'all', label: UI.mvno.all },
    ...MVNO_NETWORKS.map((n) => ({ value: n as NetFilter, label: UI.mvno.networkName[n] })),
  ]

  return (
    <div>
      <PageHeader title={UI.mvno.catalogTitle} subtitle={UI.mvno.catalogSub} />
      <Container className="browse-body">
        <div className="plan-filters">
          <div className="plan-filter-row" role="radiogroup" aria-label={UI.mvno.techLabel}>
            {techOpts.map((o) => (
              <button
                key={o.value}
                type="button"
                aria-checked={tech === o.value}
                role="radio"
                className={cn('plan-chip', tech === o.value && 'is-active')}
                onClick={() => setTech(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="plan-filter-row" role="radiogroup" aria-label={UI.mvno.networkLabel}>
            {netOpts.map((o) => (
              <button
                key={o.value}
                type="button"
                aria-checked={network === o.value}
                role="radio"
                className={cn('plan-chip', network === o.value && 'is-active')}
                onClick={() => setNetwork(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {plans.length === 0 ? (
          <p className="sheet-empty">{UI.mvno.noResults}</p>
        ) : (
          <div className="plan-grid">
            {plans.map((p) => (
              <MvnoPlanCard key={p.id} plan={p} />
            ))}
          </div>
        )}
        <p className="partner-note">{UI.mvno.catalogNote}</p>
      </Container>
    </div>
  )
}
