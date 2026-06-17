import { useState } from 'react'
import { Globe, Check } from 'lucide-react'
import BottomSheet from '../BottomSheet'
import { LANGS, setLang, useLang, useUI } from '../../content'
import { cn } from '../../lib/cn'

// Globe language picker — opens a bottom sheet (modal on desktop) like the
// destination picker, for one consistent selection pattern.
export default function LangSwitch() {
  const UI = useUI()
  const lang = useLang((s) => s.lang)
  const [open, setOpen] = useState(false)
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0]

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Language"
        onClick={() => setOpen(true)}
        className="lang__btn"
      >
        <Globe size={15} strokeWidth={2.2} />
        <span className="lang__btn-label">{current.label}</span>
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title={UI.footer.language}>
        <div className="sheet-list">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              aria-pressed={l.code === current.code}
              className={cn('sheet-opt', l.code === current.code && 'is-active')}
              onClick={() => {
                setLang(l.code)
                setOpen(false)
              }}
            >
              <span className="sheet-opt__name">{l.label}</span>
              {l.code === current.code && <Check size={18} strokeWidth={2.8} className="sheet-opt__check" />}
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  )
}
