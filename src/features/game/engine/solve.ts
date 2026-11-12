import type { MethodId, Recipe } from '../../../types/practical'
import { preIceIds } from './judge'
import type { Action, Vessel } from './types'

const VESSEL: Partial<Record<MethodId, Vessel>> = { shake: 'shaker', stir: 'mixingGlass', blend: 'blender' }
const PROCESS: Record<Vessel, Action> = { shaker: { type: 'shake' }, mixingGlass: { type: 'stir', target: 'mixingGlass' }, blender: { type: 'blend' } }

/** 만점 풀이 (judge 100점이 되는 액션 순서) */
export function solve(recipe: Recipe): Action[] {
  const a: Action[] = [{ type: 'pickGlass', glassId: recipe.glassId }]
  if (recipe.chill) a.push({ type: 'chillGlass' })

  // 칠링하는 동안 용기 준비
  const vessels = [...new Set(recipe.ingredients.map((r) => VESSEL[r.via]).filter((v) => v !== undefined))]
  for (const v of vessels) {
    a.push({ type: 'addIce', target: v, ice: v === 'blender' ? 'crushed' : 'cube' })
    for (const r of recipe.ingredients)
      if (VESSEL[r.via] === v) a.push({ type: 'pour', target: v, ingredientId: r.ingredientId, amount: r.amount, unit: r.unit })
  }

  if (recipe.chill) a.push({ type: 'dumpChill' })
  if (recipe.rim) a.push({ type: 'rim', rim: recipe.rim })

  const pre = preIceIds(recipe)
  const direct = (id: string, float: boolean) => {
    const r = recipe.ingredients.find((x) => x.ingredientId === id)!
    a.push({ type: 'pour', target: 'glass', ingredientId: id, amount: r.amount, unit: r.unit, ...(float ? { float } : {}) })
  }
  pre.forEach((id) => direct(id, false))
  if (recipe.glassIce) a.push({ type: 'addIce', target: 'glass', ice: recipe.glassIce })

  const strained = new Set<Vessel>()
  for (const r of recipe.ingredients) {
    const v = VESSEL[r.via]
    if (v) {
      if (strained.has(v)) continue
      strained.add(v)
      a.push(PROCESS[v], { type: 'strain', from: v })
    } else if (!pre.includes(r.ingredientId)) direct(r.ingredientId, r.via === 'float')
  }

  for (const id of recipe.garnishIds) a.push({ type: 'garnish', garnishId: id })
  a.push({ type: 'serve' })
  return a
}
