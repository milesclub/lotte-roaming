import { useState } from 'react'
import { Phone, Plug, Banknote, Clock } from 'lucide-react'
import { useUI } from '../content'
import { countryInfoFor } from '../data/countryInfo'

function localClock(utcOffset: number): string {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000
  const d = new Date(utc + utcOffset * 3_600_000)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

// Language-neutral destination facts: emergency numbers, power, a currency
// converter, and the local time.
export default function InfoPack({
  placeCode,
  regionId,
}: {
  placeCode?: string | null
  regionId?: string | null
}) {
  const UI = useUI()
  const info = countryInfoFor(placeCode, regionId)
  const [krw, setKrw] = useState('10000')

  const amount = Number(krw.replace(/[^0-9]/g, '')) || 0
  const converted = info.currency
    ? (amount * info.currency.perKRW).toLocaleString(undefined, { maximumFractionDigits: 2 })
    : ''
  // Time difference vs Korea (UTC+9).
  const diff = info.utcOffset - 9
  const diffLabel = diff === 0 ? '±0h' : `${diff > 0 ? '+' : ''}${diff}h`

  return (
    <div className="info-pack">
      <div className="info-tile">
        <span className="info-tile__icon"><Phone size={16} /></span>
        <span className="info-tile__label">{UI.info.emergency}</span>
        <div className="info-tile__rows">
          <span><b>{info.police}</b> · {UI.info.police}</span>
          <span><b>{info.medical}</b> · {UI.info.medical}</span>
        </div>
      </div>

      <div className="info-tile">
        <span className="info-tile__icon"><Plug size={16} /></span>
        <span className="info-tile__label">{UI.info.power}</span>
        <div className="info-tile__rows">
          <span><b>{info.voltage}</b> · {UI.info.voltage}</span>
          <span><b>{info.plugType}</b> · {UI.info.plugType}</span>
        </div>
      </div>

      <div className="info-tile">
        <span className="info-tile__icon"><Clock size={16} /></span>
        <span className="info-tile__label">{UI.info.localTime}</span>
        <div className="info-tile__rows">
          <span className="info-tile__big">{localClock(info.utcOffset)}</span>
          <span>{UI.info.timeDiff} {diffLabel}</span>
        </div>
      </div>

      {info.currency && (
        <div className="info-tile info-tile--currency">
          <span className="info-tile__icon"><Banknote size={16} /></span>
          <span className="info-tile__label">{UI.info.currency} · {info.currency.code}</span>
          <div className="info-conv">
            <span className="info-conv__krw">
              <input
                inputMode="numeric"
                value={krw}
                onChange={(e) => setKrw(e.target.value)}
                className="info-conv__input"
                aria-label="KRW"
              />
              <span className="info-conv__cur">KRW</span>
            </span>
            <span className="info-conv__eq">=</span>
            <span className="info-conv__out">
              {info.currency.symbol}{converted}
            </span>
          </div>
          <span className="info-tile__note">{UI.info.rateNote}</span>
        </div>
      )}
    </div>
  )
}
