import { describe as group, expect, it } from 'vitest'
import { recipeById, recipes } from '../../../data/practical'
import { run, solve, step, type Action } from '../engine'
import { describe, glassFill, nextHint } from './helpers'

const sunrise = recipeById('tequila-sunrise')!
const margarita = recipeById('margarita')!

group('game ui helpers', () => {
  it('nextHint: 풀이를 k단계까지 하면 정확히 k+1번째 단계 (전 레시피)', () => {
    for (const r of recipes) {
      const sol = solve(r)
      for (let k = 0; k <= sol.length; k++) expect(nextHint(run(sol.slice(0, k)), sol), `${r.id} #${k}`).toEqual(sol[k] ?? null)
    }
  })

  it('nextHint: 순서를 바꿔 해도, 되돌린 단계는 다시 알려 준다', () => {
    const sol = solve(margarita) // pickGlass, chillGlass, addIce shaker, pour ×3, dumpChill, rim, shake, strain, serve
    const apply = (acts: Action[]) => acts.reduce((s, a) => step(s, a).state, run([]))
    // 셰이커 재료 순서를 바꿔도 같은 상태 → 다음 단계
    const pours = sol.filter((a) => a.type === 'pour')
    const swapped = apply([sol[0], sol[1], sol[2], ...[...pours].reverse()])
    expect(nextHint(swapped, sol)).toEqual(sol[2 + pours.length + 1])
    // 칠링 얼음 위에 따랐다가 버리면 그 재료를 다시 따라야 한다
    const wasted = apply([sol[0], { type: 'chillGlass' }, { type: 'pour', target: 'glass', ingredientId: 'tequila', amount: 1.5, unit: 'oz' }, { type: 'dumpChill' }])
    expect(nextHint(wasted, sol)).toEqual(sol[2])
  })

  it('glassFill: empty → level 0, sunrise keeps grenadine as a bottom band', () => {
    expect(glassFill(run([{ type: 'pickGlass', glassId: 'highball' }])).level).toBe(0)
    const f = glassFill(run(solve(sunrise)))
    expect(f.layers).toHaveLength(2)
    expect(f.level).toBeGreaterThan(0.5)
    // 잔에서 저으면 층이 하나로 섞인다
    const stirred = glassFill(run([...solve(sunrise).slice(0, -1), { type: 'stir', target: 'glass' }]))
    expect(stirred.layers).toHaveLength(1)
  })

  it('describe covers every solve action in Korean', () => {
    for (const a of [...solve(margarita), ...solve(sunrise)]) expect(describe(a)).toMatch(/[가-힣]/)
  })
})
