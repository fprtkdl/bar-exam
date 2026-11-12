/** 데이터 무결성 검사. 파일이 아직 없으면 glob 결과가 비어 자연히 통과한다 */
import { describe, expect, test } from 'vitest'
import type { Garnish, Glass, Ingredient, Recipe } from '../types/practical'
import { notes, questions, units } from './written'

const topicIds = new Set(units.flatMap((u) => u.topics.map((t) => t.id)))
const unitIds = new Set(units.map((u) => u.id))

describe('필기', () => {
  test('단원 examWeight 합 = 60, topic.unitId 일치', () => {
    expect(units.reduce((s, u) => s + u.examWeight, 0)).toBe(60)
    for (const u of units) for (const t of u.topics) expect(t.unitId, t.id).toBe(u.id)
  })

  test('문항 id 유일·형식, unit/topic 참조', () => {
    const seen = new Set<string>()
    for (const q of questions) {
      expect(seen.has(q.id), `중복 id ${q.id}`).toBe(false)
      seen.add(q.id)
      expect(q.id, q.id).toMatch(/^u\d+-t\d+-q\d{2}$/)
      expect(q.id.startsWith(`${q.topicId}-`), `${q.id} 가 topicId ${q.topicId} 와 다름`).toBe(true)
      expect(unitIds.has(q.unitId), `${q.id} unitId`).toBe(true)
      expect(topicIds.has(q.topicId), `${q.id} topicId`).toBe(true)
      expect(q.topicId.startsWith(`${q.unitId}-`), `${q.id} unit/topic 불일치`).toBe(true)
    }
  })

  test('보기 4개 서로 다름·빈 문자열 없음, 해설 20자 이상', () => {
    for (const q of questions) {
      expect(q.choices, q.id).toHaveLength(4)
      expect(q.choices.every((c) => c.trim() !== ''), `${q.id} 빈 보기`).toBe(true)
      expect(new Set(q.choices.map((c) => c.trim())).size, `${q.id} 중복 보기`).toBe(4)
      expect(q.explanation.trim().length, `${q.id} 해설 길이`).toBeGreaterThanOrEqual(20)
    }
  })

  test('단원별 정답 번호 분포 각 10~40%, 토픽당 문항 6개 이상 (문항 있는 단원만)', () => {
    for (const u of units) {
      const qs = questions.filter((q) => q.unitId === u.id)
      if (!qs.length) continue
      for (let i = 0; i < 4; i++) {
        const r = qs.filter((q) => q.answer === i).length / qs.length
        expect(r, `${u.id} 정답 ${i + 1}번 비율`).toBeGreaterThanOrEqual(0.1)
        expect(r, `${u.id} 정답 ${i + 1}번 비율`).toBeLessThanOrEqual(0.4)
      }
      for (const t of u.topics) expect(qs.filter((q) => q.topicId === t.id).length, `${t.id} 문항 수`).toBeGreaterThanOrEqual(6)
    }
  })

  test('노트 topicId 참조', () => {
    for (const n of notes) expect(topicIds.has(n.topicId), n.topicId).toBe(true)
  })
})

type PracticalIndex = { recipes: Recipe[]; ingredients: Ingredient[]; glasses: Glass[]; garnishes: Garnish[] }
const practical = Object.values(import.meta.glob<PracticalIndex>('./practical/index.ts', { eager: true }))

describe('실기', () => {
  test('레시피 참조 무결성, methods ↔ via 일치', () => {
    for (const p of practical) {
      for (const k of ['recipes', 'ingredients', 'glasses', 'garnishes'] as const) expect(Array.isArray(p[k]), `practical/index.ts 의 ${k} export`).toBe(true)
      const ing = new Set(p.ingredients.map((x) => x.id))
      const gl = new Set(p.glasses.map((x) => x.id))
      const ga = new Set(p.garnishes.map((x) => x.id))
      for (const r of p.recipes) {
        expect(gl.has(r.glassId), `${r.id} glassId ${r.glassId}`).toBe(true)
        for (const i of r.ingredients) expect(ing.has(i.ingredientId), `${r.id} ingredient ${i.ingredientId}`).toBe(true)
        for (const g of r.garnishIds) expect(ga.has(g), `${r.id} garnish ${g}`).toBe(true)
        expect([...new Set(r.ingredients.map((i) => i.via))].sort(), `${r.id} via`).toEqual([...new Set(r.methods)].sort())
      }
    }
  })
})
