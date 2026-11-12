import { describe, expect, test } from 'vitest'
import { recipeById, recipes } from '../../../data/practical'
import type { Recipe } from '../../../types/practical'
import { amountOptions, formatAmount, initialState, josa, judge, run, solve, step, type Action, type ScoreKey } from '.'

const R = (id: string): Recipe => recipeById(id)!
const scores = (actions: Action[], r: Recipe) => Object.fromEntries(judge(run(actions), r).items.map((i) => [i.key, i]))
/** 만점 풀이에서 바꾼 뒤, 지정한 항목만 감점되고 나머지는 만점인지 */
const onlyLost = (actions: Action[], r: Recipe, key: ScoreKey) => {
  const sheet = judge(run(actions), r)
  for (const i of sheet.items) {
    if (i.key === key) expect(i.ok, i.message).toBe(false)
    else expect(i.ok, `${i.key}: ${i.message}`).toBe(true)
  }
  return sheet.items.find((i) => i.key === key)!
}

describe('solve → judge', () => {
  test.each(recipes.map((r) => [r.id, r] as const))('%s 만점', (_, r) => {
    const sheet = judge(run(solve(r)), r)
    expect(sheet.items.filter((i) => !i.ok).map((i) => i.message)).toEqual([])
    expect(sheet.total).toBe(100)
  })
  test('배점 합 100', () => {
    expect(judge(initialState(), R('manhattan')).items.reduce((s, i) => s + i.max, 0)).toBe(100)
  })
})

describe('변형: 해당 항목만 감점', () => {
  const r = R('manhattan')
  const base = solve(r)

  test('잔 틀림', () => {
    const i = onlyLost(base.map((a) => (a.type === 'pickGlass' ? { ...a, glassId: 'highball' } : a)), r, 'glass')
    expect(i.message).toBe('잔: 하이볼 글라스를 골랐습니다. 정답은 칵테일 글라스입니다.')
  })
  test('칠링 생략', () => {
    const i = onlyLost(base.filter((a) => a.type !== 'chillGlass' && a.type !== 'dumpChill'), r, 'chill')
    expect(i.earned).toBe(0)
  })
  test('재료 누락', () => {
    const i = onlyLost(base.filter((a) => !(a.type === 'pour' && a.ingredientId === 'angostura-bitters')), r, 'ingredients')
    expect(i.message).toContain('앙고스투라 비터스가 빠졌습니다')
    expect(i.earned).toBeGreaterThan(0)
  })
  test('가니쉬 누락', () => {
    const i = onlyLost(base.filter((a) => a.type !== 'garnish'), r, 'garnish')
    expect(i.message).toContain('정답은 체리')
  })
  test('계량 1/4oz 오차 → 부분 점수', () => {
    const i = onlyLost(base.map((a) => (a.type === 'pour' && a.ingredientId === 'bourbon-whiskey' ? { ...a, amount: 1.25 } : a)), r, 'measure')
    expect(i.earned).toBeGreaterThan(0)
    expect(i.message).toContain('정답은 1 1/2oz')
  })
  test('계량 큰 오차 → 그 재료 0', () => {
    const i = onlyLost(base.map((a) => (a.type === 'pour' && a.ingredientId === 'bourbon-whiskey' ? { ...a, amount: 3 } : a)), r, 'measure')
    expect(i.earned).toBe(10) // 3개 중 2개 정확
  })
  test('흔들지(젓지) 않고 스트레인 → 기법', () => {
    onlyLost(base.filter((a) => a.type !== 'stir'), r, 'technique')
  })
})

describe('기법·순서 규칙', () => {
  test('칠링 얼음을 버리지 않고 따름 → 칠링 0 + 순서 감점', () => {
    const r = R('manhattan')
    const s = scores(solve(r).filter((a) => a.type !== 'dumpChill'), r)
    expect(s.chill.earned).toBe(0)
    expect(s.process.earned).toBe(0)
  })
  test('B-52 층 순서 뒤집으면 기법 감점', () => {
    const r = R('b-52')
    const sol = solve(r)
    const pours = sol.filter((a) => a.type === 'pour').reverse()
    const s = scores([...sol.filter((a) => a.type !== 'pour' && a.type !== 'serve'), ...pours, { type: 'serve' }], r)
    expect(s.technique.ok).toBe(false)
    expect(s.technique.message).toContain('정답: 커피 리큐르 → 베일리스 아이리시 크림 → 그랑 마니에')
    expect(s.ingredients.ok).toBe(true)
  })
  test('플로트 층을 저으면 기법 감점', () => {
    const r = R('tequila-sunrise')
    const sol = solve(r)
    const s = scores([...sol.slice(0, -1), { type: 'stir', target: 'glass' }, { type: 'serve' }], r)
    expect(s.technique.message).toContain('저어 섞었습니다')
  })
  test('플로트 대신 그냥 따르면 경로 오류', () => {
    const r = R('singapore-sling')
    const s = scores(solve(r).map((a) => (a.type === 'pour' && 'float' in a ? { ...a, float: false } : a)), r)
    expect(s.ingredients.message).toContain('체리 브랜디: 잔에 직접(빌드)로 넣었습니다. 정답은 잔 위에 띄움(플로트)입니다.')
  })
  test('탄산을 셰이커에 넣으면 기법 감점', () => {
    const r = R('gin-fizz')
    const sol = solve(r)
      .filter((a) => !(a.type === 'pour' && a.ingredientId === 'soda-water'))
      .flatMap((a): Action[] => (a.type === 'shake' ? [{ type: 'pour', target: 'shaker', ingredientId: 'soda-water', amount: 0, unit: 'fill' }, a] : [a]))
    const s = scores(sol, r)
    expect(s.technique.message).toContain('탄산음료(소다수)를 셰이커에 넣었습니다')
  })
  test('얼음 넣기 전에 스트레인 → 순서 감점, 잔 얼음 없음 → 얼음 감점', () => {
    const r = R('boulevardier')
    const s = scores(solve(r).filter((a) => !(a.type === 'addIce' && a.target === 'glass')), r)
    expect(s.ice.ok).toBe(false)
    expect(s.process.ok).toBe(false)
  })
  test('셰이커에 넣고 옮기지 않음 → 재료 메시지', () => {
    const r = R('margarita')
    const s = scores(solve(r).filter((a) => a.type !== 'strain' && a.type !== 'serve'), r)
    expect(s.ingredients.message).toContain('셰이커에 넣었지만 잔으로 옮기지 않았습니다')
  })
  test('마가리타 리밍 누락', () => {
    const r = R('margarita')
    expect(onlyLost(solve(r).filter((a) => a.type !== 'rim'), r, 'garnish').message).toContain('정답은 소금 리밍')
  })
})

describe('reducer 거부', () => {
  const s0 = initialState()
  test.each<[string, Action]>([
    ['잔 없이 따르기', { type: 'pour', target: 'glass', ingredientId: 'vodka', amount: 1, unit: 'oz' }],
    ['빈 셰이커 흔들기', { type: 'shake' }],
    ['빈 믹싱 글라스 스트레인', { type: 'strain', from: 'mixingGlass' }],
    ['칠링 안 했는데 버리기', { type: 'dumpChill' }],
    ['fill 인데 양 지정', { type: 'pour', target: 'shaker', ingredientId: 'cola', amount: 1, unit: 'fill' }],
  ])('%s', (_, a) => {
    const r = step(s0, a)
    expect(r.ok).toBe(false)
    expect(r.state).toBe(s0)
    if (!r.ok) expect(r.reason).toMatch(/./)
  })
  test('칠링 중 잔에 얼음 넣기 거부, 서빙 후 행동 거부', () => {
    const s = run([{ type: 'pickGlass', glassId: 'cocktail' }, { type: 'chillGlass' }])
    expect(step(s, { type: 'addIce', target: 'glass', ice: 'cube' }).ok).toBe(false)
    const served = run(solve(R('kir')))
    expect(step(served, { type: 'garnish', garnishId: 'cherry' }).ok).toBe(false)
    expect(step(served, { type: 'reset' }).state).toEqual(initialState())
  })
  test('블렌더 스트레인은 얼음째', () => {
    const s = run(solve(R('pina-colada')))
    expect(s.glass.ice).toBe('crushed')
    expect(s.blender.ice).toBeNull()
  })
})

describe('계량 옵션·표시', () => {
  test('전 레시피 값이 amountOptions 에 포함', () => {
    for (const r of recipes) for (const x of r.ingredients) expect(amountOptions(x.unit), `${r.id} ${x.ingredientId}`).toContain(x.amount)
  })
  test('formatAmount·josa', () => {
    expect(formatAmount(1.5, 'oz')).toBe('1 1/2oz')
    expect(formatAmount(1 / 3, 'part')).toBe('1/3 part')
    expect(formatAmount(0.5, 'ea')).toBe('1/2개')
    expect(formatAmount(0, 'fill')).toBe('가득 채움')
    expect(josa('그레나딘 시럽', '을')).toBe('그레나딘 시럽을')
    expect(josa('보드카', '을')).toBe('보드카를')
    expect(josa('셰이커(셰이크)', '으로')).toBe('셰이커(셰이크)로')
  })
  test('레시피 안 재료 id 는 중복 없음 (judge 가 id 로 묶음)', () => {
    for (const r of recipes) expect(new Set(r.ingredients.map((x) => x.ingredientId)).size, r.id).toBe(r.ingredients.length)
  })
})
