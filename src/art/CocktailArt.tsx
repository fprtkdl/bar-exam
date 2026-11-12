import { glassById, ingredientById, recipeById } from '../data/practical'
import type { Recipe, RecipeIngredient } from '../types/practical'
import { GlassArt, type GlassFill } from './GlassArt'
import { blend, mixColor } from './mixColor'
import { artOverrides } from './overrides'
import { OverrideImg } from './svg'

/** 투명한 술이 섞일 때 끌어당기는 물 색 */
const CLEAR = '#d9eef8'
/** 빛을 흩뜨리는 불투명 재료: 기하평균 대신 산술평균으로 섞어 우유빛을 낸다 */
const OPAQUE = new Set(['light-milk', 'baileys', 'pina-colada-mix'])
const SERVED_LEVEL = 0.86

function ounces(ri: RecipeIngredient, fillOz: number, capOz: number) {
  switch (ri.unit) {
    case 'oz': return ri.amount
    case 'part': return ri.amount * capOz
    case 'tsp': return ri.amount / 6
    case 'dash': return ri.amount / 32
    case 'ea': return 0.3
    case 'fill': return fillOz
  }
}

/** 레시피 → 잔 채움. float 재료는 층(시럽은 비중이 커서 바닥으로 가라앉음), 나머지는 섞은 한 색 */
export function recipeFill(recipe: Recipe): GlassFill {
  const cap = glassById(recipe.glassId)?.capacityOz ?? 6
  const fixed = recipe.ingredients.filter((r) => r.unit !== 'fill')
  const fillCount = recipe.ingredients.length - fixed.length
  const fixedOz = fixed.reduce((s, r) => s + ounces(r, 0, cap), 0)
  const fillOz = fillCount ? Math.max(cap * 0.9 - fixedOz, cap * 0.4) / fillCount : 0

  const parts = recipe.ingredients.map((ri) => {
    const ing = ingredientById(ri.ingredientId)
    return { ri, oz: ounces(ri, fillOz, cap), color: ing?.color ?? CLEAR, opacity: ing?.opacity ?? 1, sinks: ing?.category === 'syrup', opaque: OPAQUE.has(ri.ingredientId) }
  })
  const tint = (ps: typeof parts) => {
    const clear = ps.filter((p) => !p.opaque)
    const liquid = mixColor(clear.flatMap((p) => [{ color: p.color, amount: p.oz * p.opacity }, { color: CLEAR, amount: p.oz * (1 - p.opacity) }]))
    const sum = (xs: typeof parts) => xs.reduce((s, p) => s + p.oz, 0)
    return blend([{ color: liquid, amount: sum(clear) }, ...ps.filter((p) => p.opaque).map((p) => ({ color: p.color, amount: p.oz }))])
  }

  const mixed = parts.filter((p) => p.ri.via !== 'float')
  const floats = parts.filter((p) => p.ri.via === 'float')
  const total = parts.reduce((s, p) => s + p.oz, 0) || 1
  const layer = (ps: typeof parts) => ({ color: tint(ps), ratio: Math.max(ps.reduce((s, p) => s + p.oz, 0) / total, 0.15) })

  const layers = [
    ...floats.filter((p) => p.sinks).map((p) => layer([p])),
    ...(mixed.length ? [layer(mixed)] : []),
    ...floats.filter((p) => !p.sinks).map((p) => layer([p])),
  ]
  return { layers, level: SERVED_LEVEL }
}

export function CocktailArt({ recipeId, size = 160 }: { recipeId: string; size?: number }) {
  const recipe = recipeById(recipeId)
  if (!recipe) return null
  const src = artOverrides[`cocktail/${recipeId}`]
  if (src) return <OverrideImg src={src} label={recipe.nameKo} width={(size * 3) / 4} height={size} />
  return (
    <GlassArt
      glassId={recipe.glassId}
      fill={recipeFill(recipe)}
      ice={recipe.glassIce}
      garnishIds={recipe.garnishIds}
      rim={recipe.rim}
      frosted={recipe.chill}
      size={size}
      label={`${recipe.nameKo} (${recipe.nameEn})`}
    />
  )
}
