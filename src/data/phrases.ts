import type { LangCode } from '../content'

// Travel phrasebook. Each phrase carries its meaning in the four app languages;
// the *local* phrasing (the language actually spoken at the destination) is
// produced on the fly by the translation engine, so we don't hand-author every
// target language. `localLangFor` maps a destination to a MyMemory language code.

export type PhraseCategory = 'basics' | 'directions' | 'dining' | 'shopping' | 'emergency'

export interface Phrase {
  id: string
  category: PhraseCategory
  // Meaning label shown to the traveler, per app language.
  text: Record<LangCode, string>
}

export const PHRASE_CATEGORIES: PhraseCategory[] = [
  'basics',
  'directions',
  'dining',
  'shopping',
  'emergency',
]

const P = (
  id: string,
  category: PhraseCategory,
  en: string,
  ko: string,
  zh: string,
  ja: string,
): Phrase => ({ id, category, text: { en, ko, zh, ja } })

export const PHRASES: Phrase[] = [
  // Basics
  P('hello', 'basics', 'Hello', '안녕하세요', '你好', 'こんにちは'),
  P('thanks', 'basics', 'Thank you', '감사합니다', '谢谢', 'ありがとう'),
  P('sorry', 'basics', 'Excuse me / Sorry', '실례합니다', '不好意思', 'すみません'),
  P('yesno', 'basics', 'Yes / No', '네 / 아니요', '是 / 不是', 'はい / いいえ'),
  // Directions
  P('where', 'directions', 'Where is the restroom?', '화장실이 어디예요?', '洗手间在哪里？', 'トイレはどこですか？'),
  P('station', 'directions', 'How do I get to the station?', '역까지 어떻게 가요?', '怎么去车站？', '駅へはどう行きますか？'),
  P('howmuchtaxi', 'directions', 'How much is the fare?', '요금이 얼마예요?', '车费多少钱？', '料金はいくらですか？'),
  // Dining
  P('menu', 'dining', 'Can I see the menu?', '메뉴 좀 볼 수 있을까요?', '可以看一下菜单吗？', 'メニューを見せてください'),
  P('recommend', 'dining', 'What do you recommend?', '추천 메뉴가 뭐예요?', '有什么推荐的？', 'おすすめは何ですか？'),
  P('checkplease', 'dining', 'Check, please', '계산서 주세요', '请结账', 'お会計お願いします'),
  // Shopping
  P('howmuch', 'shopping', 'How much is this?', '이거 얼마예요?', '这个多少钱？', 'これはいくらですか？'),
  P('card', 'shopping', 'Can I pay by card?', '카드로 결제돼요?', '可以刷卡吗？', 'カードで払えますか？'),
  P('taxfree', 'shopping', 'Is tax-free available?', '택스 프리 되나요?', '可以免税吗？', '免税できますか？'),
  // Emergency
  P('help', 'emergency', 'Please help me', '도와주세요', '请帮帮我', '助けてください'),
  P('hospital', 'emergency', 'I need a hospital', '병원에 가야 해요', '我需要去医院', '病院に行きたいです'),
  P('police', 'emergency', 'Call the police, please', '경찰을 불러주세요', '请叫警察', '警察を呼んでください'),
]

export function phrasesByCategory(category: PhraseCategory): Phrase[] {
  return PHRASES.filter((p) => p.category === category)
}

// MyMemory language code spoken at a destination. Country-specific where it
// matters, with a regional fallback.
const PLACE_LANG: Record<string, string> = {
  // East Asia
  JP: 'ja', CN: 'zh-CN', TW: 'zh-CN', HK: 'zh-CN',
  // Southeast Asia
  VN: 'vi', TH: 'th', SG: 'en', PH: 'tl', ID: 'id', MY: 'ms',
  // Americas
  US: 'en', CA: 'en',
  // Europe
  FR: 'fr', GB: 'en', DE: 'de', IT: 'it', ES: 'es',
  // Oceania & more
  AU: 'en', GU: 'en', SA: 'en',
}

const REGION_LANG: Record<string, string> = {
  korea: 'ko',
  japan: 'ja',
  china: 'zh-CN',
  asia: 'zh-CN',
  sea: 'en',
  americas: 'en',
  europe: 'en',
  oceania: 'en',
}

export function localLangFor(placeCode?: string | null, regionId?: string | null): string {
  if (placeCode === 'KR') return 'ko'
  if (placeCode && PLACE_LANG[placeCode]) return PLACE_LANG[placeCode]
  if (regionId && REGION_LANG[regionId]) return REGION_LANG[regionId]
  return 'en'
}
