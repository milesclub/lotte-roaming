import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import Container from './Container'
import BottomSheet from '../BottomSheet'
import { LANGS, setLang, useLang, useUI } from '../../content'
import { cn } from '../../lib/cn'

// Footer modeled on the L.POINT mobile footer: a collapsible operator-info
// accordion, the sales-intermediary disclaimer, a language control and the
// policy/menu links.
export default function SiteFooter() {
  const UI = useUI()
  const f = UI.footer
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const lang = useLang((s) => s.lang)
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0]

  return (
    <footer className="site-footer">
      <Container size="wide" className="site-footer__inner">
        {/* Operator info — collapsible */}
        <div className={cn('foot-acc', open && 'is-open')}>
          <button
            type="button"
            className="foot-acc__trigger"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="foot-acc__title">{f.company.name}</span>
            <ChevronDown size={20} className="foot-acc__icon" />
          </button>
          {open && (
            <div className="foot-acc__body">
              {f.company.rows.map((row, i) => (
                <div className="foot-acc__row" key={i}>
                  {row.map((cell, j) => (
                    <span className="foot-acc__cell" key={j}>
                      {cell}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="foot__intermediary">{f.intermediary}</p>

        {/* Language — opens a bottom sheet */}
        <div className="foot-lang">
          <button
            type="button"
            className="foot-lang__btn"
            aria-haspopup="dialog"
            aria-expanded={langOpen}
            onClick={() => setLangOpen(true)}
          >
            <span>{f.language}</span>
            <span className="foot-lang__current">{current.label}</span>
            <ChevronDown size={16} className="foot-lang__chev" />
          </button>
        </div>
        <BottomSheet open={langOpen} onClose={() => setLangOpen(false)} title={f.language}>
          <div className="sheet-list">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                aria-pressed={l.code === current.code}
                className={cn('sheet-opt', l.code === current.code && 'is-active')}
                onClick={() => {
                  setLang(l.code)
                  setLangOpen(false)
                }}
              >
                <span className="sheet-opt__name">{l.label}</span>
                {l.code === current.code && <Check size={18} strokeWidth={2.8} className="sheet-opt__check" />}
              </button>
            ))}
          </div>
        </BottomSheet>

        {/* Menu links (placeholders in the demo) */}
        <nav className="foot-menu">
          {f.links.map((label, i) => (
            <button type="button" key={i} className="foot-menu__link">
              {label}
            </button>
          ))}
        </nav>
        <nav className="foot-menu">
          {f.links2.map((label, i) => (
            <button type="button" key={i} className={cn('foot-menu__link', i === 0 && 'is-strong')}>
              {label}
            </button>
          ))}
        </nav>

        <p className="foot__copy">
          © {new Date().getFullYear()} {UI.brand.name} · {f.demoNote}
        </p>
      </Container>
    </footer>
  )
}
