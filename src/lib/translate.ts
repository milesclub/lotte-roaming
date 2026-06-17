import type { LangCode } from '../content'

// On-demand machine translation for user-generated content (reviews).
//
// Engine: MyMemory Translation API (https://mymemory.translated.net) — a free,
// key-less, CORS-enabled REST endpoint, well suited to a client-only demo.
// When the browser ships the on-device Translation API (Chrome/Edge), we use
// that first for instant, offline, quota-free results and fall back to MyMemory.
//
// Results are cached in-memory and in localStorage so a given string is
// translated at most once per (from→to) pair.

const MM_ENDPOINT = 'https://api.mymemory.translated.net/get'

// MyMemory expects regioned codes for Chinese.
const MM_LANG: Record<LangCode, string> = { en: 'en', ko: 'ko', zh: 'zh-CN', ja: 'ja' }

const STORE_KEY = 'lr.tx'
const memCache = new Map<string, string>()

function cacheKey(text: string, from: string, to: string) {
  return `${from}>${to}:${text}`
}

function loadStore(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}')
  } catch {
    return {}
  }
}

function persist(key: string, value: string) {
  try {
    const store = loadStore()
    store[key] = value
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
  } catch {
    /* storage unavailable — in-memory cache still applies */
  }
}

// Browser on-device Translation API (experimental; Chrome 138+/Edge). Returns
// null when unavailable so the caller can fall back to the remote engine.
async function viaBrowser(text: string, from: string, to: string): Promise<string | null> {
  try {
    const api = (globalThis as { Translator?: { create: (o: unknown) => Promise<unknown> } }).Translator
    if (!api?.create) return null
    const translator = (await api.create({
      sourceLanguage: from,
      targetLanguage: to,
    })) as { translate: (t: string) => Promise<string> }
    const out = await translator.translate(text)
    return out?.trim() || null
  } catch {
    return null
  }
}

async function viaMyMemory(text: string, from: string, to: string): Promise<string> {
  const langpair = `${from}|${to}`
  const url = `${MM_ENDPOINT}?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`translate http ${res.status}`)
  const json = (await res.json()) as {
    responseStatus?: number | string
    responseData?: { translatedText?: string }
  }
  const status = Number(json.responseStatus)
  const out = json.responseData?.translatedText
  if (status && status !== 200) throw new Error(`translate status ${json.responseStatus}`)
  if (!out || typeof out !== 'string') throw new Error('translate empty')
  return out
}

// Low-level translate between arbitrary MyMemory language codes (e.g. 'en',
// 'ko', 'zh-CN', 'th', 'fr'). Cached. Throws on engine failure.
export async function translateRaw(text: string, from: string, to: string): Promise<string> {
  if (from === to || !text.trim()) return text

  const key = cacheKey(text, from, to)
  const hit = memCache.get(key) ?? loadStore()[key]
  if (hit) {
    memCache.set(key, hit)
    return hit
  }

  const result = (await viaBrowser(text, from, to)) ?? (await viaMyMemory(text, from, to))
  memCache.set(key, result)
  persist(key, result)
  return result
}

// Translate `text` between two app languages. No-ops when languages match.
export function translateText(text: string, from: LangCode, to: LangCode): Promise<string> {
  return translateRaw(text, MM_LANG[from], MM_LANG[to])
}
