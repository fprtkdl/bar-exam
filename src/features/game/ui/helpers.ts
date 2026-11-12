import { type GlassFill, mixColor } from '../../../art'
import { blend } from '../../../art/mixColor'
import { garnishById, glassById, ingredientById } from '../../../data/practical'
import type { PourUnit } from '../../../types/practical'
import { formatAmount, ICE_LABEL, josa, VESSEL_LABEL, type Action, type GameState, type Pour, type Target } from '../engine'

const CLEAR = '#d9eef8'
const OPAQUE = new Set(['light-milk', 'baileys', 'pina-colada-mix'])

export const targetLabel = (t: Target) => (t === 'glass' ? '서빙 잔' : VESSEL_LABEL[t])
export const ingName = (id: string) => ingredientById(id)?.nameKo ?? id

const ounces = (unit: PourUnit, amount: number, cap: number) =>
  ({
    oz: amount,
    part: amount * cap,
    tsp: amount / 6,
    dash: amount / 32,
    ea: 0.3,
    fill: 0,
  })[unit]

/** 붓기 목록 → 한 색으로 섞인 액체 색 (투명 술은 물빛 쪽으로, 우유·크림은 산술평균) */
export function tint(pours: { ingredientId: string; oz: number }[]): string {
  const clear = pours.filter((p) => !OPAQUE.has(p.ingredientId))
  const liquid = mixColor(
    clear.flatMap((p) => {
      const ing = ingredientById(p.ingredientId)
      const op = ing?.opacity ?? 0.85
      return [
        { color: ing?.color ?? CLEAR, amount: p.oz * op },
        { color: CLEAR, amount: p.oz * (1 - op) },
      ]
    }),
  )
  const opaque = pours
    .filter((p) => OPAQUE.has(p.ingredientId))
    .map((p) => ({
      color: ingredientById(p.ingredientId)?.color ?? CLEAR,
      amount: p.oz,
    }))
  return blend([{ color: liquid, amount: clear.reduce((s, p) => s + p.oz, 0) }, ...opaque])
}

/** 엔진의 잔 상태 → GlassArt 채움. 섞이지 않은 플로트는 따로 층(시럽은 바닥으로), 나머지는 한 색 */
export function glassFill(state: GameState): GlassFill {
  const g = state.glass
  const cap = (g.glassId && glassById(g.glassId)?.capacityOz) || 6
  const fixedOz = g.layers.reduce((s, l) => s + ounces(l.unit, l.amount, cap), 0)
  const fills = g.layers.filter((l) => l.unit === 'fill').length
  const fillOz = fills ? Math.max(cap * 0.9 - fixedOz, cap * 0.35) / fills : 0
  const parts = g.layers.map((l) => ({
    ...l,
    oz: l.unit === 'fill' ? fillOz : ounces(l.unit, l.amount, cap),
  }))
  const total = parts.reduce((s, p) => s + p.oz, 0)
  if (!total) return { layers: [], level: 0 }
  const isFloat = (p: (typeof parts)[number]) => p.via === 'float' && !p.mixed
  const sinks = (p: (typeof parts)[number]) => ingredientById(p.ingredientId)?.category === 'syrup'
  const band = (ps: typeof parts) => ({
    color: tint(ps),
    ratio: Math.max(ps.reduce((s, p) => s + p.oz, 0) / total, 0.12),
  })
  const mixed = parts.filter((p) => !isFloat(p))
  const floats = parts.filter(isFloat)
  return {
    layers: [...floats.filter(sinks).map((p) => band([p])), ...(mixed.length ? [band(mixed)] : []), ...floats.filter((p) => !sinks(p)).map((p) => band([p]))],
    level: Math.min(Math.max(total / cap, 0.06), 0.92),
  }
}

export const pourText = (p: Pour) => `${ingName(p.ingredientId)} ${formatAmount(p.amount, p.unit)}`

/** 액션 → 한 줄 한국어 (행동 로그·힌트) */
export function describe(a: Action): string {
  switch (a.type) {
    case 'pickGlass':
      return `${josa(glassById(a.glassId)?.nameKo ?? a.glassId, '을')} 꺼내기`
    case 'chillGlass':
      return '잔에 얼음을 채워 칠링하기'
    case 'dumpChill':
      return '칠링 얼음과 녹은 물 버리기'
    case 'rim':
      return `잔 테두리에 ${a.rim === 'salt' ? '소금' : '설탕'} 리밍`
    case 'addIce':
      return `${targetLabel(a.target)}에 ${ICE_LABEL[a.ice]}`
    case 'pour':
      return `${pourText(a)} → ${targetLabel(a.target)}${a.float ? ' (바 스푼으로 띄우기)' : ''}`
    case 'shake':
      return '셰이커 흔들기'
    case 'stir':
      return a.target === 'glass' ? '잔 안을 바 스푼으로 젓기' : '믹싱 글라스 젓기'
    case 'blend':
      return '블렌더로 갈기'
    case 'strain':
      return `${VESSEL_LABEL[a.from]}에서 잔으로 따르기`
    case 'garnish':
      return `${garnishById(a.garnishId)?.nameKo ?? a.garnishId} 올리기`
    case 'removeGarnish':
      return `${garnishById(a.garnishId)?.nameKo ?? a.garnishId} 치우기`
    case 'reset':
      return '처음부터 다시'
    case 'serve':
      return '손님에게 내기'
  }
}

/** 풀이 중 아직 하지 않은 첫 단계. 순서와 무관하게 로그에 같은 액션이 있으면 한 번 한 것으로 친다 */
export function nextHint(log: Action[], solution: Action[]): Action | null {
  const key = (a: Action) => JSON.stringify(a, Object.keys(a).sort())
  const left = log.map(key)
  for (const a of solution) {
    const i = left.indexOf(key(a))
    if (i < 0) return a
    left.splice(i, 1)
  }
  return null
}
