import type { MethodId, PourUnit } from '../../../types/practical'
import type { Vessel } from './types'

const OPTIONS: Record<PourUnit, number[]> = {
  oz: [1 / 4, 1 / 3, 1 / 2, 3 / 4, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4],
  part: [1 / 3, 1 / 2, 1],
  tsp: [1 / 2, 1, 2],
  dash: [1, 2],
  ea: [1 / 2, 1],
  fill: [0],
}

/** 단위별로 고를 수 있는 계량값 (전 레시피 값 포함) */
export const amountOptions = (unit: PourUnit): number[] => OPTIONS[unit]

const FRAC: [number, string][] = [
  [1 / 4, '1/4'],
  [1 / 3, '1/3'],
  [1 / 2, '1/2'],
  [2 / 3, '2/3'],
  [3 / 4, '3/4'],
]

const num = (n: number): string => {
  const whole = Math.floor(n + 1e-9)
  const rest = n - whole
  if (rest < 1e-6) return String(whole)
  const f = FRAC.find(([v]) => Math.abs(v - rest) < 1e-6)
  if (!f) return String(Math.round(n * 100) / 100)
  return whole ? `${whole} ${f[1]}` : f[1]
}

const UNIT_SUFFIX: Record<PourUnit, string> = { oz: 'oz', part: ' part', tsp: 'tsp', dash: 'dash', ea: '개', fill: '' }

/** 예: 1.5 oz → "1 1/2oz", fill → "가득 채움" */
export const formatAmount = (amount: number, unit: PourUnit): string =>
  unit === 'fill' ? '가득 채움' : `${num(amount)}${UNIT_SUFFIX[unit]}`

export const VIA_LABEL: Record<MethodId, string> = {
  shake: '셰이커(셰이크)',
  stir: '믹싱 글라스(스터)',
  blend: '블렌더(블렌드)',
  build: '잔에 직접(빌드)',
  float: '잔 위에 띄움(플로트)',
}

export const VESSEL_LABEL: Record<Vessel, string> = { shaker: '셰이커', mixingGlass: '믹싱 글라스', blender: '블렌더' }
export const VESSEL_METHOD: Record<Vessel, MethodId> = { shaker: 'shake', mixingGlass: 'stir', blender: 'blend' }
export const ICE_LABEL = { cube: '큐브드 아이스', crushed: '크러시드 아이스' } as const

/** 한국어 조사: josa('레몬', '을') → '레몬을'/'레몬를' 중 맞는 것. 받침 판정은 마지막 글자(한글 아니면 받침 없음으로 본다) */
export function josa(word: string, p: '을' | '이' | '은' | '으로'): string {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  const jong = code >= 0 && code < 11172 ? code % 28 : 0
  const has = jong !== 0 && !(p === '으로' && jong === 8)
  const pick = { 을: ['을', '를'], 이: ['이', '가'], 은: ['은', '는'], 으로: ['으로', '로'] }[p]
  return word + (has ? pick[0] : pick[1])
}
