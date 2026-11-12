import { garnishes } from './garnishes'
import { glasses } from './glasses'
import { ingredients } from './ingredients'
import { recipes } from './recipes'

export { garnishes, glasses, ingredients, recipes }

const byId = <T extends { id: string }>(list: T[]) => {
  const map = new Map(list.map((x) => [x.id, x]))
  return (id: string): T | undefined => map.get(id)
}

export const recipeById = byId(recipes)
export const ingredientById = byId(ingredients)
export const glassById = byId(glasses)
export const garnishById = byId(garnishes)

export const practicalMeta = {
  recipeCount: recipes.length,
  /** 표준 레시피 적용 기준: 2026년 기능사 제1회 실기부터 (Q-net 2025-12-30 공개, 2024년판과 레시피 동일) */
  standardYear: 2026,
  examMinutes: 7,
  examDrinks: 3,
  sources: [
    '한국산업인력공단 Q-net 공개문제 「2026년 조주기능사 실기시험 관련 안내」(2025-12-30) — 실기시험 공개문제·표준레시피·변경 내역',
    '한국산업인력공단 Q-net 공개문제 「2024년 조주기능사 실기시험문제 변경안내」(2023-10-24) — Boulevardier 추가',
    '한국산업인력공단 Q-net 공개문제 「2022년 조주기능사」(2022-01-05) — 변경 내역',
  ],
}
