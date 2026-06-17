import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Segmented from './Segmented'
import Stepper from './Stepper'
import Button from './Button'
import CountrySheet from './CountrySheet'
import DataTierSelect from './DataTierSelect'
import ChipSelect from './ChipSelect'
import { useUI } from '../content'
import {
  dataIdFor,
  dataOption,
  getDestinations,
  getProductsFor,
  VALIDITY_OPTIONS,
  VOLUME_GB_OPTIONS,
} from '../lib/shop'
import { productName } from '../lib/localize'
import { planPriceText } from '../lib/labels'
import { useApplication } from '../store/application'
import { cn } from '../lib/cn'
import type { ProductKind } from '../lib/domain'

// Pick the primary product of a kind for the chosen destination.
function pickProduct(direction: 'inbound' | 'outbound', code: string | null, kind: ProductKind) {
  if (direction === 'outbound' && !code) return undefined
  const list = getProductsFor(direction, code).filter((p) => p.kind === kind)
  return list.find((p) => p.recommended) ?? list[0]
}

// Step-by-step plan configurator on the landing: destination → plan type →
// days/data → estimated price → opens the product detail to apply.
export default function PlanBuilder() {
  const UI = useUI()
  const navigate = useNavigate()
  const direction = useApplication((s) => s.direction)
  const destinationCode = useApplication((s) => s.destinationCode)
  const selectCountry = useApplication((s) => s.selectCountry)
  const selectProduct = useApplication((s) => s.selectProduct)
  const setPlan = useApplication((s) => s.setPlan)

  const [kind, setKind] = useState<ProductKind>('daily')
  const [days, setDays] = useState(3)
  const [dataId, setDataId] = useState('2gb')
  const [validity, setValidity] = useState(30)
  const [volGb, setVolGb] = useState(30)
  const [sheetOpen, setSheetOpen] = useState(false)

  const code = direction === 'inbound' ? 'KR' : destinationCode
  const product = pickProduct(direction, code, kind)

  // Inbound is Korea-only, so the destination step is skipped — steps start at
  // the plan type and renumber accordingly.
  const showDest = direction === 'outbound'
  const typeNum = showDest ? 2 : 1
  const amountNum = showDest ? 3 : 2

  // Reset the amount to the product's defaults when the product changes.
  useEffect(() => {
    if (!product) return
    if (product.kind === 'daily') {
      setDays(product.defaultDays ?? 3)
      setDataId(dataIdFor(product.dailyGb, false))
    } else {
      setValidity(product.validityDays ?? 30)
      setVolGb(product.totalGb ?? 30)
    }
  }, [product?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const countries = getDestinations()
  const selectedCountry = countries.find((c) => c.code === destinationCode)
  const destLabel =
    direction === 'inbound'
      ? `🇰🇷 ${UI.browse.koreaName}`
      : selectedCountry
        ? `${selectedCountry.flag} ${selectedCountry.name}`
        : UI.builder.pickDestination

  const dataOpt = dataOption(dataId)
  const currentPlan =
    kind === 'daily'
      ? ({
          type: 'daily',
          gbPerDay: dataOpt.unlimited ? 0 : dataOpt.gbPerDay,
          unlimited: dataOpt.unlimited,
          days,
        } as const)
      : ({ type: 'volume', totalGb: volGb, validityDays: validity } as const)

  const goDetail = () => {
    if (!product) return
    selectProduct(product.id)
    setPlan(currentPlan)
    navigate(`/roaming/${product.id}`)
  }

  return (
    <>
      <div className="builder">
        {/* Step 1 — destination (outbound only; inbound is Korea) */}
        {showDest && (
          <div className="builder-step">
            <span className="builder-step__num">1</span>
            <div className="builder-step__main">
              <span className="builder-step__label">{UI.builder.step1}</span>
              <button
                type="button"
                className={cn('dest-select', 'builder-dest', !selectedCountry && 'is-empty')}
                onClick={() => setSheetOpen(true)}
              >
                <span className="dest-select__name">{destLabel}</span>
                <ChevronDown size={18} className="dest-select__chev" />
              </button>
            </div>
          </div>
        )}

        {/* Plan type */}
        <div className={cn('builder-step', !product && 'is-disabled')}>
          <span className="builder-step__num">{typeNum}</span>
          <div className="builder-step__main">
            <span className="builder-step__label">{UI.builder.step2}</span>
            <Segmented
              ariaLabel={UI.builder.step2}
              value={kind}
              onChange={(v) => setKind(v)}
              options={[
                { value: 'daily', label: UI.builder.daily },
                { value: 'volume', label: UI.builder.volume },
              ]}
            />
            <p className="builder-kind-desc">
              {kind === 'daily' ? UI.builder.dailyDesc : UI.builder.volumeDesc}
            </p>
          </div>
        </div>

        {/* Days / data amount */}
        <div className={cn('builder-step', !product && 'is-disabled')}>
          <span className="builder-step__num">{amountNum}</span>
          <div className="builder-step__main">
            {kind === 'daily' ? (
              <>
                <span className="builder-step__label">{UI.builder.dataLabel}</span>
                <DataTierSelect value={dataId} onChange={setDataId} ariaLabel={UI.builder.dataLabel} />
                <span className="builder-step__label builder-step__label--mt">{UI.builder.step3Daily}</span>
                <Stepper
                  ariaLabel={UI.builder.step3Daily}
                  value={UI.product.daysUnit(days)}
                  canDec={days > 1}
                  canInc={days < 30}
                  onDec={() => setDays((d) => Math.max(1, d - 1))}
                  onInc={() => setDays((d) => Math.min(30, d + 1))}
                />
              </>
            ) : (
              <>
                <span className="builder-step__label">{UI.builder.dataLabel}</span>
                <ChipSelect
                  ariaLabel={UI.builder.dataLabel}
                  value={String(volGb)}
                  onChange={(v) => setVolGb(Number(v))}
                  options={VOLUME_GB_OPTIONS.map((g) => ({ value: String(g), label: `${g}GB` }))}
                />
                <span className="builder-step__label builder-step__label--mt">{UI.builder.step3Volume}</span>
                <Segmented
                  ariaLabel={UI.builder.step3Volume}
                  value={String(validity)}
                  onChange={(v) => setValidity(Number(v))}
                  options={VALIDITY_OPTIONS.map((d) => ({
                    value: String(d),
                    label: UI.product.daysUnit(d),
                  }))}
                />
              </>
            )}
          </div>
        </div>

        {/* Step 4 — price + go to detail */}
        <div className="builder-summary">
          <div className="builder-summary__info">
            <span className="builder-summary__name">{product ? productName(product) : '—'}</span>
            <span className="builder-summary__price-label">{UI.builder.priceLabel}</span>
            <span className="builder-summary__price">
              {product ? planPriceText(product, currentPlan) : '₩—'}
            </span>
            <span className="builder-summary__note">{UI.product.priceNote}</span>
          </div>
          <Button className="btn--lg" onClick={goDetail} disabled={!product}>
            {UI.builder.cta}
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      {/* Destination sheet (outbound) — searchable */}
      <CountrySheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={UI.builder.step1}
        countries={countries}
        value={destinationCode}
        onSelect={(c) => {
          selectCountry(c)
          setSheetOpen(false)
        }}
      />
    </>
  )
}
