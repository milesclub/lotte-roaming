import { useEffect, useMemo, useState } from 'react'
import { Volume2, ArrowRight } from 'lucide-react'
import { useUI, useLang } from '../content'
import { translateRaw } from '../lib/translate'
import {
  PHRASE_CATEGORIES,
  phrasesByCategory,
  type PhraseCategory,
} from '../data/phrases'

// App language → MyMemory code for the source side of free-text translation.
const SRC: Record<string, string> = { en: 'en', ko: 'ko', zh: 'zh-CN', ja: 'ja' }

// Speak the translated phrase aloud when the device supports it.
function speak(text: string, lang: string) {
  try {
    const synth = window.speechSynthesis
    if (!synth) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = lang
    synth.cancel()
    synth.speak(u)
  } catch {
    /* no speech synthesis — silently ignore */
  }
}

// Destination phrasebook: tap a phrase to reveal its local-language form
// (machine-translated + cached), or translate your own text.
export default function Phrasebook({ localLang }: { localLang: string }) {
  const UI = useUI()
  const lang = useLang((s) => s.lang)
  const [cat, setCat] = useState<PhraseCategory>('basics')
  const [local, setLocal] = useState<Record<string, string>>({})
  const [input, setInput] = useState('')
  const [out, setOut] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const list = useMemo(() => phrasesByCategory(cat), [cat])

  // Translate the visible category's phrases into the local language.
  useEffect(() => {
    let alive = true
    list.forEach((p) => {
      const key = `${p.id}:${localLang}`
      if (local[key]) return
      translateRaw(p.text.en, 'en', localLang)
        .then((t) => alive && setLocal((m) => (m[key] ? m : { ...m, [key]: t })))
        .catch(() => {})
    })
    return () => {
      alive = false
    }
  }, [list, localLang]) // eslint-disable-line react-hooks/exhaustive-deps

  const runInput = () => {
    const text = input.trim()
    if (!text) return
    setBusy(true)
    setOut(null)
    translateRaw(text, SRC[lang] ?? 'en', localLang)
      .then((t) => setOut(t))
      .catch(() => setOut(null))
      .finally(() => setBusy(false))
  }

  return (
    <div className="phrasebook">
      <p className="phrasebook__intro">{UI.phrases.intro}</p>

      <div className="phrasebook__cats">
        {PHRASE_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`phrase-cat ${c === cat ? 'is-active' : ''}`}
            onClick={() => setCat(c)}
          >
            {UI.phrases.categories[c]}
          </button>
        ))}
      </div>

      <ul className="phrase-list">
        {list.map((p) => {
          const localText = local[`${p.id}:${localLang}`]
          return (
            <li key={p.id} className="phrase-row">
              <div className="phrase-row__main">
                <span className="phrase-row__meaning">{p.text[lang]}</span>
                <span className="phrase-row__local">
                  {localText ?? <span className="phrase-row__dots">···</span>}
                </span>
              </div>
              {localText && (
                <button
                  type="button"
                  className="phrase-row__speak"
                  aria-label="play"
                  onClick={() => speak(localText, localLang)}
                >
                  <Volume2 size={17} />
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <div className="phrase-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && runInput()}
          placeholder={UI.phrases.inputPlaceholder}
          className="phrase-input__field"
        />
        <button type="button" className="phrase-input__go" onClick={runInput} disabled={busy}>
          <ArrowRight size={18} />
        </button>
      </div>
      {(busy || out) && (
        <div className="phrase-output">
          {busy ? (
            <span className="phrase-row__dots">···</span>
          ) : (
            <>
              <span className="phrase-output__text">{out}</span>
              <button
                type="button"
                className="phrase-row__speak"
                aria-label="play"
                onClick={() => out && speak(out, localLang)}
              >
                <Volume2 size={17} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
