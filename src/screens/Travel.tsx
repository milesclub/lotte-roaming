import { useState } from 'react'
import { ChevronRight, MapPin, Eye, ChevronDown } from 'lucide-react'
import Container from '../components/site/Container'
import PageHeader from '../components/site/PageHeader'
import CountrySheet from '../components/CountrySheet'
import UsageCard from '../components/UsageCard'
import Phrasebook from '../components/Phrasebook'
import InfoPack from '../components/InfoPack'
import { localLangFor } from '../data/phrases'
import { useUI } from '../content'
import { listApplications } from '../lib/applications'
import { getDestinations } from '../lib/shop'
import { areaPhoto } from '../lib/images'
import { lottePerksFor } from '../data/lottePerks'
import { inboundHighlights } from '../data/regionGuides'
import { highlightDesc, highlightTitle, lottePerkDesc, lottePerkTitle } from '../lib/localize'
import type { TravelDirection } from '../lib/domain'
import { cn } from '../lib/cn'

interface Place {
  code: string
  name: string
  flag: string
  region: string
  direction: TravelDirection
}

type TravelTab = 'benefits' | 'info' | 'phrases' | 'guide'

// "Travel" tab — a destination explorer. If roaming is active, the active
// destination is selected by default and flagged; otherwise any country can be
// previewed for its Lotte benefits and local tips before departure.
export default function Travel() {
  const UI = useUI()
  const apps = listApplications()
  const latest = apps[0]
  // The destination of an active plan: Korea for inbound, the country otherwise.
  const activeCode = latest ? (latest.direction === 'inbound' ? 'KR' : latest.destinationCode) : null

  const places: Place[] = [
    { code: 'KR', name: UI.browse.koreaName, flag: '🇰🇷', region: 'korea', direction: 'inbound' },
    ...getDestinations().map((d) => ({
      code: d.code,
      name: d.name,
      flag: d.flag,
      region: d.regionId,
      direction: 'outbound' as const,
    })),
  ]

  const [code, setCode] = useState<string>(activeCode ?? 'KR')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [tab, setTab] = useState<TravelTab>('benefits')
  const place = places.find((p) => p.code === code) ?? places[0]
  const isActive = !!activeCode && activeCode === place.code

  const perks = lottePerksFor(place.direction, place.region)
  const highlights = place.direction === 'inbound' ? inboundHighlights() : []
  const photo = areaPhoto(place.code, place.region)

  // Tab set — the guide tab only exists where there are recommendations.
  const tabs: { key: TravelTab; label: string }[] = [
    { key: 'benefits', label: UI.travel.tabBenefits },
    { key: 'info', label: UI.travel.tabInfo },
    { key: 'phrases', label: UI.travel.tabPhrases },
    ...(highlights.length > 0 ? [{ key: 'guide' as const, label: UI.travel.tabGuide }] : []),
  ]
  // Keep the active tab valid when switching to a place without a guide.
  const activeTab: TravelTab = tabs.some((t) => t.key === tab) ? tab : 'benefits'

  return (
    <div>
      <PageHeader title={UI.travel.title} subtitle={UI.travel.subtitle} />
      <Container className="browse-body">
        {/* Selected destination banner + picker */}
        <div className="travel-banner">
          {photo && <img className="travel-banner__bg" src={photo} alt="" aria-hidden />}
          <span className="travel-banner__scrim" aria-hidden />
          <div className="travel-banner__content">
            <span className={cn('travel-banner__active', !isActive && 'is-preview')}>
              {isActive ? <MapPin size={14} /> : <Eye size={14} />}
              {isActive ? UI.travel.active : UI.travel.preview}
            </span>
            <span className="travel-banner__place">
              <span aria-hidden>{place.flag}</span> {place.name}
            </span>
            <button
              type="button"
              className="travel-banner__change"
              onClick={() => setSheetOpen(true)}
            >
              {UI.travel.pickPlace}
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Live data usage — only for the destination you're actually roaming in */}
        {isActive && latest && (
          <div className="travel-usage">
            <UsageCard application={latest} />
          </div>
        )}

        {/* Section tabs — split the long page into focused views */}
        <div className="travel-tabs" role="tablist" aria-label={UI.travel.title}>
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={activeTab === t.key}
              className={cn('travel-tab', activeTab === t.key && 'is-active')}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Lotte benefits for this destination */}
        {activeTab === 'benefits' && (
          <section className="travel-section">
            <h2 className="section-title">{UI.travel.offersTitle}</h2>
            <div className="benefit-grid travel-perks">
              {perks.map((b, i) => (
                <div key={b.id} className={`benefit-face benefit-face--${b.category}`}>
                  <span className="benefit-face__emoji" aria-hidden>
                    {b.emoji}
                  </span>
                  <div className="benefit-face__top">
                    <span className="benefit-face__cat">{UI.direction.categories[b.category]}</span>
                    <span className="benefit-face__no">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="benefit-face__title">{lottePerkTitle(b)}</h3>
                  <p className="benefit-face__desc">{lottePerkDesc(b)}</p>
                  <div className="benefit-face__foot">
                    <span className="benefit-face__brand">
                      <span className="benefit-face__dot" aria-hidden />
                      {UI.direction.brandTag}
                    </span>
                    <ChevronRight size={18} className="benefit-face__arrow" />
                  </div>
                </div>
              ))}
            </div>
            <p className="partner-note">{UI.direction.partnerNote}</p>
          </section>
        )}

        {/* Good to know — emergency / power / time / currency */}
        {activeTab === 'info' && (
          <section className="travel-section">
            <h2 className="section-title">{UI.travel.infoTitle}</h2>
            <InfoPack placeCode={place.code} regionId={place.region} />
          </section>
        )}

        {/* Travel phrasebook — powered by the translation engine */}
        {activeTab === 'phrases' && (
          <section className="travel-section">
            <h2 className="section-title">{UI.travel.phrasesTitle}</h2>
            <Phrasebook localLang={localLangFor(place.code, place.region)} />
          </section>
        )}

        {/* Korea trip recommendations (Korea only) */}
        {activeTab === 'guide' && highlights.length > 0 && (
          <section className="travel-section">
            <h2 className="section-title">{UI.direction.koreaGuideTitle}</h2>
            <div className="guide-grid">
              {highlights.map(({ code: hc, highlight: h }) => (
                <div key={`${hc}-${h.id}`} className="guide-card">
                  <span className="guide-card__emoji" aria-hidden>
                    {h.emoji}
                  </span>
                  <div className="guide-card__body">
                    <span className="guide-card__cat">{UI.direction.guideCategories[h.category]}</span>
                    <div className="guide-card__title">{highlightTitle(hc, h)}</div>
                    <div className="guide-card__desc">{highlightDesc(hc, h)}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </Container>

      <CountrySheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={UI.travel.pickPlace}
        countries={places}
        value={code}
        onSelect={(c) => {
          setCode(c)
          setSheetOpen(false)
        }}
      />
    </div>
  )
}
