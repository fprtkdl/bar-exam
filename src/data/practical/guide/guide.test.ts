import { describe, expect, it } from 'vitest'
import { TOOL_IDS } from '../../../types/practical'
import { glasses } from '../glasses'
import { garnishes } from '../garnishes'
import { ingredients } from '../ingredients'
import { recipes } from '../recipes'
import { guideCategories } from './index'

const refs = {
  tool: new Set<string>(TOOL_IDS),
  glass: new Set(glasses.map((g) => g.id)),
  bottle: new Set(ingredients.map((i) => i.id)),
  garnish: new Set(garnishes.map((g) => g.id)),
  ice: new Set(['cube', 'crushed']),
}
const byId = (id: string) => guideCategories.find((c) => c.id === id)!

describe('guide', () => {
  it('art 참조가 실제 id 를 가리키고 항목 id 가 중복되지 않는다', () => {
    for (const c of guideCategories) {
      const seen = new Set<string>()
      for (const e of c.entries) {
        expect(seen.has(e.id), `${c.id}/${e.id} 중복`).toBe(false)
        seen.add(e.id)
        if (e.art) expect(refs[e.art.kind].has(e.art.id), `${c.id}/${e.id} art`).toBe(true)
        expect(e.features.length).toBeGreaterThanOrEqual(2)
        expect(e.features.length).toBeLessThanOrEqual(4)
        expect(e.usage.length).toBeGreaterThanOrEqual(1)
        expect(e.usage.length).toBeLessThanOrEqual(4)
      }
    }
  })
  it('도구·잔·가니쉬는 전부 다루고, 레시피에 쓰이는 재료도 빠짐없다', () => {
    expect(byId('tools').entries.map((e) => e.id).sort()).toEqual([...TOOL_IDS].sort())
    expect(byId('glasses').entries.map((e) => e.id).sort()).toEqual(glasses.map((g) => g.id).sort())
    expect(byId('garnishes').entries.map((e) => e.id).sort()).toEqual(garnishes.map((g) => g.id).sort())
    const covered = new Set([...byId('spirits').entries, ...byId('mixers').entries].map((e) => e.id))
    const used = new Set(recipes.flatMap((r) => r.ingredients.map((i) => i.ingredientId)))
    for (const id of used) expect(covered.has(id), `재료 ${id} 누락`).toBe(true)
  })
})
