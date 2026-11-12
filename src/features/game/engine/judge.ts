import { garnishById, glassById, ingredientById } from '../../../data/practical'
import type { MethodId, Recipe, RecipeIngredient } from '../../../types/practical'
import { formatAmount, ICE_LABEL, josa, VESSEL_LABEL, VIA_LABEL } from './amount'
import type { GameState, Layer, ScoreItem, ScoreKey, ScoreSheet, Vessel } from './types'

const EPS = 1e-6
const ingName = (id: string) => ingredientById(id)?.nameKo ?? id
const glassName = (id: string) => glassById(id)?.nameKo ?? id
const garnishName = (id: string) => garnishById(id)?.nameKo ?? id
const iceName = (ice: keyof typeof ICE_LABEL | null) => (ice ? ICE_LABEL[ice] : '얼음 없음')
const list = (ids: string[], name: (id: string) => string) => (ids.length ? ids.map(name).join(', ') : '없음')

const VESSEL_OF: Partial<Record<MethodId, Vessel>> = { shake: 'shaker', stir: 'mixingGlass', blend: 'blender' }
const isVesselVia = (via: MethodId) => via in VESSEL_OF

/** 서빙 잔에 얼음을 넣기 전에 넣어도 되는 재료: 빌드 설탕을 녹이는 레시피(올드 패션드·레몬 스쿼시)에서 첫 증류주/채움 전까지 */
export function preIceIds(recipe: Recipe): string[] {
  if (!recipe.glassIce || !recipe.ingredients.some((r) => r.via === 'build' && r.ingredientId === 'powdered-sugar')) return []
  const out: string[] = []
  for (const r of recipe.ingredients) {
    if (r.via !== 'build') continue
    if (r.unit === 'fill' || ingredientById(r.ingredientId)?.category === 'spirit') break
    out.push(r.ingredientId)
  }
  return out
}

/** 블렌드 레시피는 블렌더 얼음(크러시드)이 잔으로 함께 들어간다 */
const expectedGlassIce = (recipe: Recipe) =>
  recipe.glassIce ?? (recipe.ingredients.some((r) => r.via === 'blend') ? 'crushed' : null)

export function judge(state: GameState, recipe: Recipe): ScoreSheet {
  const g = state.glass
  const items: ScoreItem[] = []
  const add = (key: ScoreKey, label: string, max: number, earned: number, message: string) =>
    items.push({ key, label, max, earned: Math.round(earned), ok: Math.round(earned) === max, message })
  const allOrNothing = (key: ScoreKey, label: string, max: number, faults: string[], okMsg: string) =>
    add(key, label, max, faults.length ? 0 : max, faults.length ? faults.join(' ') : okMsg)

  const byId = new Map<string, Layer[]>()
  for (const l of g.layers) byId.set(l.ingredientId, [...(byId.get(l.ingredientId) ?? []), l])
  const recipeIds = new Set(recipe.ingredients.map((r) => r.ingredientId))

  // 1. 잔
  const want = glassName(recipe.glassId)
  if (!g.glassId) add('glass', '잔', 15, 0, `잔: 잔을 고르지 않았습니다. 정답은 ${want}입니다.`)
  else if (g.glassId !== recipe.glassId) add('glass', '잔', 15, 0, `잔: ${josa(glassName(g.glassId), '을')} 골랐습니다. 정답은 ${want}입니다.`)
  else add('glass', '잔', 15, 15, `잔: ${want} — 정답.`)

  // 2. 칠링
  if (g.pouredWhileIcing) add('chill', '칠링', 10, 0, '칠링: 칠링 얼음과 녹은 물을 버리지 않고 음료를 따랐습니다. 칠링 얼음은 따르기 전에 버려야 합니다.')
  else if (g.chill === 'icing') add('chill', '칠링', 10, 0, '칠링: 칠링 얼음과 녹은 물을 버리지 않았습니다.')
  else if (recipe.chill && g.chill !== 'chilled') add('chill', '칠링', 10, 0, `칠링: 잔을 칠링하지 않았습니다. 정답은 ${want}에 얼음을 넣어 칠링한 뒤 얼음·물을 버리고 따르는 것입니다.`)
  else add('chill', '칠링', 10, 10, recipe.chill ? '칠링: 잔을 칠링하고 얼음을 버렸습니다 — 정답.' : '칠링: 이 레시피는 칠링이 필요 없습니다.')

  // 3. 얼음 (서빙 잔 + 용기)
  const iceFaults: string[] = []
  const wantIce = expectedGlassIce(recipe)
  if (g.ice !== wantIce) iceFaults.push(`서빙 잔 얼음: ${iceName(g.ice)}. 정답은 ${iceName(wantIce)}입니다.`)
  for (const via of ['shake', 'stir', 'blend'] as const) {
    const layers = g.layers.filter((l) => l.via === via)
    if (!layers.length) continue
    const need = via === 'blend' ? 'crushed' : 'cube'
    const got = layers[0].vesselIce
    if (got !== need) iceFaults.push(`${VESSEL_LABEL[VESSEL_OF[via]!]} 얼음: ${iceName(got)}. 정답은 ${ICE_LABEL[need]}입니다.`)
  }
  allOrNothing('ice', '얼음', 10, iceFaults.map((f) => `얼음: ${f}`), `얼음: 서빙 잔 ${iceName(wantIce)} — 정답.`)

  // 4. 재료 종류 (누락·불필요·경로)
  const ingFaults: string[] = []
  const matched: RecipeIngredient[] = []
  for (const r of recipe.ingredients) {
    const ls = byId.get(r.ingredientId)
    if (!ls) {
      const left = (['shaker', 'mixingGlass', 'blender'] as const).find((v) => state[v].contents.some((p) => p.ingredientId === r.ingredientId))
      ingFaults.push(
        left
          ? `${josa(ingName(r.ingredientId), '을')} ${VESSEL_LABEL[left]}에 넣었지만 잔으로 옮기지 않았습니다.`
          : `${josa(ingName(r.ingredientId), '이')} 빠졌습니다. 정답은 ${josa(formatAmount(r.amount, r.unit), '을')} ${josa(VIA_LABEL[r.via], '으로')} 넣는 것입니다.`,
      )
      continue
    }
    const wrong = ls.find((l) => l.via !== r.via)
    if (wrong) ingFaults.push(`${ingName(r.ingredientId)}: ${josa(VIA_LABEL[wrong.via], '으로')} 넣었습니다. 정답은 ${VIA_LABEL[r.via]}입니다.`)
    else matched.push(r)
  }
  const extras = [...byId.keys()].filter((id) => !recipeIds.has(id))
  for (const id of extras) ingFaults.push(`${josa(ingName(id), '은')} 이 레시피에 들어가지 않습니다.`)
  const n = recipe.ingredients.length
  add(
    'ingredients',
    '재료',
    20,
    20 * Math.max(0, 1 - ingFaults.length / n),
    ingFaults.length ? `재료: ${ingFaults.join(' ')}` : '재료: 모든 재료를 올바른 경로로 넣었습니다 — 정답.',
  )

  // 5. 계량 (경로까지 맞은 재료만)
  const measureMsgs: string[] = []
  let credit = 0
  for (const r of matched) {
    const ls = byId.get(r.ingredientId)!
    const want = formatAmount(r.amount, r.unit)
    if (ls.some((l) => l.unit !== r.unit)) {
      const l = ls.find((x) => x.unit !== r.unit)!
      measureMsgs.push(`${ingName(r.ingredientId)}: ${josa(formatAmount(l.amount, l.unit), '을')} 넣었습니다. 정답은 ${want}입니다.`)
      continue
    }
    if (r.unit === 'fill') {
      credit += 1
      continue
    }
    const total = ls.reduce((s, l) => s + l.amount, 0)
    const diff = Math.abs(total - r.amount)
    if (diff < EPS) credit += 1
    else {
      const near = r.unit === 'oz' && diff <= 0.25 + EPS
      if (near) credit += 0.5
      measureMsgs.push(`${ingName(r.ingredientId)}: ${josa(formatAmount(total, r.unit), '을')} 넣었습니다. 정답은 ${want}입니다${near ? ' (1/4oz 이내 오차, 부분 점수)' : ''}.`)
    }
  }
  if (!matched.length) add('measure', '계량', 15, 0, '계량: 올바르게 넣은 재료가 없어 계량을 채점할 수 없습니다.')
  else add('measure', '계량', 15, (15 * credit) / matched.length, measureMsgs.length ? `계량: ${measureMsgs.join(' ')}` : '계량: 모든 재료의 양이 정확합니다 — 정답.')

  // 6. 기법
  const techFaults: string[] = []
  const needVias = new Set(recipe.ingredients.map((r) => r.via).filter(isVesselVia))
  for (const via of needVias) {
    if (!g.layers.some((l) => l.via === via)) techFaults.push(`${josa(VESSEL_LABEL[VESSEL_OF[via]!], '을')} 쓰지 않았습니다. 정답은 ${VIA_LABEL[via]}입니다.`)
  }
  for (const via of ['shake', 'stir', 'blend'] as const) {
    const ls = g.layers.filter((l) => l.via === via)
    if (!ls.length) continue
    const vessel = VESSEL_LABEL[VESSEL_OF[via]!]
    if (!needVias.has(via)) techFaults.push(`이 레시피는 ${josa(vessel, '을')} 쓰지 않습니다.`)
    const action = { shake: '흔들지', stir: '젓지', blend: '갈지' }[via]
    if (ls.some((l) => !l.mixed)) techFaults.push(`${vessel} 내용물을 ${action} 않고 따랐습니다.`)
  }
  const fizz = g.layers.filter((l) => l.via === 'shake' && ingredientById(l.ingredientId)?.category === 'mixer')
  for (const l of fizz) techFaults.push(`탄산음료(${ingName(l.ingredientId)})를 셰이커에 넣었습니다. 탄산은 흔들면 안 됩니다.`)
  // 플로트: 레시피에서 앞선 재료가 모두 그 아래(먼저)에 있어야 한다
  const idx = (id: string) => recipe.ingredients.findIndex((r) => r.ingredientId === id)
  const floats = recipe.ingredients.filter((r) => r.via === 'float')
  let floatBroken = false
  g.layers.forEach((l, pos) => {
    if (l.via !== 'float' || idx(l.ingredientId) < 0) return
    if (l.mixed) techFaults.push(`플로트한 ${ingName(l.ingredientId)} 층을 저어 섞었습니다.`)
    if (g.layers.slice(pos + 1).some((later) => idx(later.ingredientId) >= 0 && idx(later.ingredientId) < idx(l.ingredientId))) floatBroken = true
  })
  if (floatBroken) {
    const poured = g.layers.filter((l) => recipeIds.has(l.ingredientId)).map((l) => ingName(l.ingredientId))
    const answer = recipe.ingredients.map((r) => ingName(r.ingredientId))
    techFaults.push(`층 순서가 틀렸습니다. 부은 순서(아래 → 위): ${poured.join(' → ')}. 정답: ${answer.join(' → ')}.`)
  }
  const techOk = floats.length ? '기법: 용기 사용·플로트 층 모두 정답.' : '기법: 조주 기법 정답.'
  allOrNothing('technique', '기법', 15, techFaults.map((f) => `기법: ${f}`), techOk)

  // 7. 가니쉬·림
  const garFaults: string[] = []
  const missing = recipe.garnishIds.filter((id) => !g.garnishIds.includes(id))
  const extraG = g.garnishIds.filter((id) => !recipe.garnishIds.includes(id))
  if (missing.length || extraG.length)
    garFaults.push(`가니쉬: ${josa(list(g.garnishIds, garnishName), '을')} 올렸습니다. 정답은 ${list(recipe.garnishIds, garnishName)}입니다 (${recipe.garnishText}).`)
  const rimName = { salt: '소금', sugar: '설탕' }
  if (g.rim !== recipe.rim)
    garFaults.push(`리밍: ${g.rim ? rimName[g.rim] : '안 함'}. 정답은 ${recipe.rim ? `${rimName[recipe.rim]} 리밍` : '리밍 없음'}입니다.`)
  allOrNothing('garnish', '가니쉬·림', 10, garFaults, `가니쉬: ${recipe.garnishText} — 정답.`)

  // 8. 순서·처리
  const procFaults: string[] = []
  if (g.pouredWhileIcing) procFaults.push('칠링 얼음·물을 버리기 전에 음료를 따랐습니다.')
  if (recipe.glassIce) {
    const pre = preIceIds(recipe)
    const early = g.layers.filter((l) => !l.onIce && !pre.includes(l.ingredientId))
    if (early.length) {
      const preTxt = pre.length ? `${list(pre, ingName)} → 얼음 → 나머지` : '얼음을 먼저 넣고 재료를 따름'
      procFaults.push(`얼음을 넣기 전에 ${josa([...new Set(early.map((l) => ingName(l.ingredientId)))].join(', '), '을')} 잔에 넣었습니다. 정답 순서: ${preTxt}.`)
    }
  }
  allOrNothing('process', '순서·처리', 5, procFaults.map((f) => `순서: ${f}`), '순서·처리: 정답.')

  // 빈 잔(시험 시간 초과 등)은 '해당 없는 항목 만점' 을 주지 않는다
  if (!g.layers.length)
    return { total: 0, max: 100, items: items.map((i) => ({ ...i, earned: 0, ok: false, message: i.ok ? `${i.label}: 잔에 음료가 없어 점수가 없습니다.` : i.message })) }
  return { total: items.reduce((s, i) => s + i.earned, 0), max: 100, items }
}
