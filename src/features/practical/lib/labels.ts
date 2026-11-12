import type { BaseCategory } from '../../../types/practical'
import type { Tone } from '../../../ui'

export const BASE_LABEL: Record<BaseCategory, string> = {
  gin: '진', vodka: '보드카', rum: '럼', tequila: '테킬라', whiskey: '위스키', brandy: '브랜디',
  liqueur: '리큐르', wine: '와인', traditional: '전통주', 'non-alcoholic': '무알코올',
}

export const BASE_TONE: Record<BaseCategory, Tone> = {
  gin: 'sky', vodka: 'sky', rum: 'butter', tequila: 'mint', whiskey: 'peach', brandy: 'peach',
  liqueur: 'lavender', wine: 'lavender', traditional: 'mint', 'non-alcoholic': 'good',
}
