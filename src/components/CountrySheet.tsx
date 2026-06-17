import { useEffect, useState } from 'react'
import { Check, Search } from 'lucide-react'
import BottomSheet from './BottomSheet'
import { useUI } from '../content'
import { cn } from '../lib/cn'

export interface SheetCountry {
  code: string
  name: string
  flag: string
}

// Destination picker sheet with a search field. Used by the plan builder (and
// anywhere a country needs choosing).
export default function CountrySheet({
  open,
  onClose,
  title,
  countries,
  value,
  onSelect,
}: {
  open: boolean
  onClose: () => void
  title: string
  countries: SheetCountry[]
  value?: string | null
  onSelect: (code: string) => void
}) {
  const UI = useUI()
  const [q, setQ] = useState('')

  // Clear the query each time the sheet opens.
  useEffect(() => {
    if (open) setQ('')
  }, [open])

  const query = q.trim().toLowerCase()
  const filtered = query
    ? countries.filter(
        (c) => c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query),
      )
    : countries

  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <div className="sheet-search">
        <Search size={16} className="sheet-search__icon" />
        <input
          type="text"
          className="sheet-search__input"
          placeholder={UI.builder.searchPlaceholder}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="sheet-empty">{UI.builder.noResults}</p>
      ) : (
        <div className="sheet-list">
          {filtered.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => onSelect(c.code)}
              aria-pressed={value === c.code}
              className={cn('sheet-opt', value === c.code && 'is-active')}
            >
              <span className="sheet-opt__flag" aria-hidden>
                {c.flag}
              </span>
              <span className="sheet-opt__name">{c.name}</span>
              {value === c.code && <Check size={18} strokeWidth={2.8} className="sheet-opt__check" />}
            </button>
          ))}
        </div>
      )}
    </BottomSheet>
  )
}
