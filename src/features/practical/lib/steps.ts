import { garnishById, glassById, ingredientById } from '../../../data/practical'
import type { MethodId, PourUnit, Recipe } from '../../../types/practical'

const FRACS: [number, string][] = [[1 / 4, '1/4'], [1 / 3, '1/3'], [1 / 2, '1/2'], [2 / 3, '2/3'], [3 / 4, '3/4']]

/** 계량 표기: 1.5 → "1 1/2", 1/3 → "1/3" */
export function fmtAmount(amount: number, unit: PourUnit): string {
  if (unit === 'fill') return '잔을 채움'
  const whole = Math.floor(amount + 1e-6)
  const rest = amount - whole
  const frac = FRACS.find(([v]) => Math.abs(v - rest) < 0.01)?.[1]
  const num = rest < 0.01 ? `${whole}` : frac ? (whole ? `${whole} ${frac}` : frac) : `${Math.round(amount * 100) / 100}`
  const label = unit === 'part' ? '' : unit === 'ea' ? '개' : unit
  return unit === 'oz' || unit === 'tsp' || unit === 'dash' ? `${num} ${label}` : `${num}${label}`
}

const GROUP: Record<MethodId, { vessel: string; verb: string }> = {
  shake: { vessel: '셰이커에 얼음과', verb: '넣고 흔든다' },
  stir: { vessel: '믹싱 글라스에 얼음과', verb: '넣고 바 스푼으로 젓는다' },
  blend: { vessel: '블렌더에 얼음과', verb: '넣고 간다' },
  build: { vessel: '잔에', verb: '순서대로 넣는다' },
  float: { vessel: '잔에', verb: '바 스푼에 대고 천천히 띄운다 (층이 섞이지 않게)' },
}

/** 재료 via · chill · glassIce · rim · 가니쉬로 만드는 순서 문장을 만든다 */
export function buildSteps(r: Recipe): string[] {
  const glass = glassById(r.glassId)?.nameKo ?? '잔'
  const steps: string[] = []
  if (r.rim) steps.push(`${glass} 테두리에 ${r.rim === 'salt' ? '소금' : '설탕'}을 묻힌다`)
  if (r.chill) steps.push(`${glass}에 얼음을 채워 칠링한다`)
  if (r.glassIce) steps.push(`${glass}에 ${r.glassIce === 'cube' ? '각얼음을' : '크러시드 아이스를'} 채운다`)
  const order = [...new Set(r.ingredients.map((x) => x.via))]
  let discarded = !r.chill
  for (const via of order) {
    const names = r.ingredients.filter((x) => x.via === via).map((x) => ingredientById(x.ingredientId)?.nameKo ?? x.ingredientId)
    const g = GROUP[via]
    const vessel = via === 'build' && r.glassIce ? '얼음을 채운 잔에' : g.vessel
    steps.push(`${vessel} ${names.join(', ')} ${g.verb}`)
    if (via === 'shake' || via === 'stir' || via === 'blend') {
      if (!discarded) {
        steps.push('칠링 얼음을 버린다')
        discarded = true
      }
      steps.push(via === 'blend' ? '잔에 따른다' : '스트레이너로 걸러 잔에 따른다')
    }
  }
  if (r.garnishIds.length) {
    const names = r.garnishIds.map((id) => garnishById(id)?.nameKo ?? id).join(', ')
    steps.push(`${names}(으)로 장식한다`)
  }
  return steps
}
