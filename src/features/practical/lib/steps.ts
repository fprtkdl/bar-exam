import { garnishById, glassById, ingredientById } from '../../../data/practical'
import type { MethodId, PourUnit, Recipe } from '../../../types/practical'
import { josa } from '../../game/engine/amount'
import { preIceIds } from '../../game/engine/judge'

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

const VESSEL: Partial<Record<MethodId, { prep: string; out: string }>> = {
  shake: { prep: '셰이커에 큐브드 아이스와 {}을 넣고 흔든다', out: '셰이커 내용물을 스트레이너로 걸러 잔에 따른다' },
  stir: { prep: '믹싱 글라스에 큐브드 아이스와 {}을 넣고 바 스푼으로 젓는다', out: '믹싱 글라스 내용물을 스트레이너로 걸러 잔에 따른다' },
  blend: { prep: '블렌더에 크러시드 아이스와 {}을 넣고 간다', out: '블렌더 내용물을 얼음째 잔에 따른다' },
}

/** 만드는 순서 문장. 게임 채점(solve)과 같은 순서: 칠링 → 용기 작업 → 칠링 얼음 버리기 → 림 → 잔 얼음 → 잔에 담기 → 장식 */
export function buildSteps(r: Recipe): string[] {
  const glass = glassById(r.glassId)?.nameKo ?? '잔'
  const name = (id: string) => ingredientById(id)?.nameKo ?? id
  const names = (ids: string[]) => josa(ids.map(name).join(', '), '을')
  const pre = preIceIds(r)
  const vias = [...new Set(r.ingredients.map((x) => x.via))]
  const idsOf = (via: MethodId) => r.ingredients.filter((x) => x.via === via && !pre.includes(x.ingredientId)).map((x) => x.ingredientId)
  const steps: string[] = []

  if (r.chill) steps.push(`${glass}에 얼음을 채워 칠링한다`)
  for (const via of vias) {
    const v = VESSEL[via]
    if (v) steps.push(v.prep.replace('{}을', names(idsOf(via))))
  }
  if (r.chill) steps.push('칠링 얼음과 녹은 물을 버린다')
  if (r.rim) steps.push(`잔 테두리에 ${r.rim === 'salt' ? '소금' : '설탕'}을 묻힌다`)
  if (pre.length) steps.push(`${glass}에 ${names(pre)} 넣어 녹인다`)
  if (r.glassIce) steps.push(`${r.chill || pre.length ? '잔' : glass}에 ${r.glassIce === 'cube' ? '큐브드 아이스를' : '크러시드 아이스를'} 채운다`)
  for (const via of vias) {
    const v = VESSEL[via]
    const ids = idsOf(via)
    if (v) steps.push(v.out)
    else if (via === 'build' && ids.length) steps.push(`잔에 ${names(ids)} ${ids.length > 1 ? '순서대로 ' : ''}넣는다`)
    else if (via === 'float' && ids.length) steps.push(`${names(ids)} 바 스푼 뒤로 천천히 흘려 ${ids.length > 1 ? '아래층부터 차례로 ' : ''}띄운다 (층이 섞이지 않게)`)
  }
  if (r.garnishIds.length) steps.push(`${josa(r.garnishIds.map((id) => garnishById(id)?.nameKo ?? id).join(', '), '으로')} 장식한다`)
  return steps
}
