import { useMemo } from 'react'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import en, { type Content } from './en'
import ko from './ko'
import zh from './zh'
import ja from './ja'

// Locale catalog. English is the base; ko/zh/ja override keys and fall back to
// English. Selection persists to localStorage.

export type LangCode = 'en' | 'ko' | 'zh' | 'ja'
export const LANGS: { code: LangCode; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'ko', label: '한국어' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
]

const CATALOG = { en, ko, zh, ja } as const

function initialLang(): LangCode {
  const nav = navigator.language?.slice(0, 2)
  if (nav === 'ko' || nav === 'zh' || nav === 'ja') return nav
  return 'en'
}

interface LangState {
  lang: LangCode
  setLang: (l: LangCode) => void
}

export const useLang = create<LangState>()(
  persist(
    (set) => ({ lang: initialLang(), setLang: (lang) => set({ lang }) }),
    { name: 'lr.lang', storage: createJSONStorage(() => localStorage) },
  ),
)

export const setLang = (l: LangCode) => useLang.getState().setLang(l)
export const getLang = (): LangCode => useLang.getState().lang

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function merge<T>(base: T, ext: unknown): T {
  if (!ext) return base
  const out: Record<string, unknown> = Array.isArray(base)
    ? ([...(base as unknown[])] as unknown as Record<string, unknown>)
    : { ...(base as Record<string, unknown>) }
  for (const k of Object.keys(ext as Record<string, unknown>)) {
    const b = (base as Record<string, unknown>)?.[k]
    const e = (ext as Record<string, unknown>)[k]
    out[k] = isPlainObject(b) && isPlainObject(e) ? merge(b, e) : e
  }
  return out as T
}

const CACHE: Partial<Record<LangCode, Content>> = {}
function build(lang: LangCode): Content {
  if (lang === 'en') return en
  if (!CACHE[lang]) CACHE[lang] = merge(en, CATALOG[lang])
  return CACHE[lang] as Content
}

// Non-reactive access (services, validation, labels).
export function getUI(): Content {
  return build(getLang())
}

// Reactive access for components — re-renders on language change.
export function useUI(): Content {
  const lang = useLang((s) => s.lang)
  return useMemo(() => build(lang), [lang])
}
