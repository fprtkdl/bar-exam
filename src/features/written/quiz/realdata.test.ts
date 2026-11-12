/** 실제 문항 데이터로 단원평가·모의고사 구성을 확인 (build.test.ts 는 fixture) */
import { expect, test } from 'vitest'
import { examMeta, questionById, units } from '../../../data/written'
import { mockRounds, unitTestSets } from './build'

test('모의고사 5회차: 각 60문항, 회차 간 중복 없음, 회차별 단원 비중 = examWeight', () => {
  const rounds = mockRounds()
  expect(rounds).toHaveLength(5)
  const seen = new Set<string>()
  for (const r of rounds) {
    expect(r.questionIds).toHaveLength(examMeta.questionCount)
    expect(new Set(r.questionIds).size).toBe(r.questionIds.length)
    for (const id of r.questionIds) {
      expect(questionById[id]).toBeDefined()
      expect(seen.has(id)).toBe(false)
      seen.add(id)
    }
    for (const u of units) expect(r.questionIds.filter((id) => questionById[id].unitId === u.id)).toHaveLength(u.examWeight)
  }
})

test('단원평가: 모든 단원에 세트가 있고 단원 문항을 빠짐없이 한 번씩 담는다', () => {
  for (const u of units) {
    const sets = unitTestSets(u.id)
    expect(sets.length, u.id).toBeGreaterThan(0)
    const ids = sets.flatMap((s) => s.questionIds)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every((id) => questionById[id].unitId === u.id)).toBe(true)
    for (const s of sets) expect(s.questionIds.length).toBeGreaterThanOrEqual(10)
  }
})
