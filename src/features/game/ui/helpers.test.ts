import { describe as group, expect, it } from 'vitest'
import { recipeById } from '../../../data/practical'
import { run, solve } from '../engine'
import { describe, glassFill, nextHint } from './helpers'

const sunrise = recipeById('tequila-sunrise')!
const margarita = recipeById('margarita')!

group('game ui helpers', () => {
  it('nextHint walks the solution and ignores key order / unrelated actions', () => {
    const sol = solve(margarita)
    expect(nextHint([], sol)).toEqual(sol[0])
    const done = run(sol.slice(0, 3)).log
    expect(nextHint(done, sol)).toEqual(sol[3])
    // 순서를 바꾼 같은 액션도 한 것으로 친다
    const reordered = done.map((a) => (a.type === 'pickGlass' ? { glassId: a.glassId, type: a.type } : a))
    expect(nextHint([{ type: 'shake' }, ...reordered], sol)).toEqual(sol[3])
    expect(nextHint(run(sol).log, sol)).toBeNull()
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
