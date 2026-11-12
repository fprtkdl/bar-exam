import { beforeEach, describe, expect, test, vi } from 'vitest'
import type { Question, Unit } from '../../../types/written'

const fx = vi.hoisted(() => {
  const q = (unitId: string, topicId: string, n: number): Question => ({
    id: `${topicId}-q${String(n).padStart(2, '0')}`,
    unitId,
    topicId,
    type: n % 2 ? 'recall' : 'calc',
    difficulty: 1,
    stem: `문제 ${n}`,
    choices: ['a', 'b', 'c', 'd'],
    answer: 0,
    explanation: '',
  })
  const units: Unit[] = [
    { id: 'u2', order: 2, title: '둘', description: '', examWeight: 3, topics: [{ id: 'u2-t1', unitId: 'u2', title: 'T21', summary: '' }] },
    { id: 'u1', order: 1, title: '하나', description: '', examWeight: 2, topics: [{ id: 'u1-t1', unitId: 'u1', title: 'T11', summary: '' }] },
    { id: 'u3', order: 3, title: '셋', description: '', examWeight: 1, topics: [{ id: 'u3-t1', unitId: 'u3', title: 'T31', summary: '' }] },
  ]
  const questions = [
    ...Array.from({ length: 7 }, (_, i) => q('u1', 'u1-t1', i + 1)),
    ...Array.from({ length: 47 }, (_, i) => q('u2', 'u2-t1', i + 1)),
    ...Array.from({ length: 50 }, (_, i) => q('u3', 'u3-t1', i + 1)),
  ]
  return { units, questions, questionById: Object.fromEntries(questions.map((x) => [x.id, x])) }
})

vi.mock('../../../data/written', () => ({
  ...fx,
  notes: [],
  examMeta: { questionCount: 60, minutes: 60, passScore: 60, standardPeriod: '', sources: [] },
}))

const { mockRounds, resolveQuiz, tally, topicQuiz, unitTestSets, isPass, toScore } = await import('./build')
const { useStore } = await import('../../../lib/store')

beforeEach(() => useStore.getState().resetAll())

test('topicQuiz: 그 토픽에서 서로 다른 5문항', () => {
  const qs = topicQuiz('u1-t1')
  expect(qs).toHaveLength(5)
  expect(new Set(qs.map((q) => q.id)).size).toBe(5)
  expect(qs.every((q) => q.topicId === 'u1-t1')).toBe(true)
  expect(topicQuiz('nope')).toEqual([])
})

describe('unitTestSets', () => {
  test('47문항 → 20 + 27 (마지막 7 합침), 결정적', () => {
    const sets = unitTestSets('u2')
    expect(sets.map((s) => s.questionIds.length)).toEqual([20, 27])
    expect(sets.map((s) => s.refId)).toEqual(['u2-1', 'u2-2'])
    expect(new Set(sets.flatMap((s) => s.questionIds)).size).toBe(47)
    expect(unitTestSets('u2')).toEqual(sets)
  })
  test('50문항 → 20 + 20 + 10 (10 은 그대로), 7문항 → 1세트, 없는 단원 → []', () => {
    expect(unitTestSets('u3').map((s) => s.questionIds.length)).toEqual([20, 20, 10])
    expect(unitTestSets('u1').map((s) => s.questionIds.length)).toEqual([7])
    expect(unitTestSets('x')).toEqual([])
  })
})

test('mockRounds: 5회차, 단원 order 순, 충분한 단원은 회차 간 중복 없음', () => {
  const rounds = mockRounds()
  expect(rounds.map((r) => r.refId)).toEqual(['1', '2', '3', '4', '5'])
  for (const r of rounds) {
    expect(r.questionIds).toHaveLength(6)
    expect(r.questionIds.map((id) => id.slice(0, 2))).toEqual(['u1', 'u1', 'u2', 'u2', 'u2', 'u3'])
    expect(new Set(r.questionIds).size).toBe(6)
  }
  const u2 = rounds.flatMap((r) => r.questionIds.filter((id) => id.startsWith('u2')))
  expect(new Set(u2).size).toBe(15)
  expect(mockRounds()).toEqual(rounds)
})

test('resolveQuiz: 종류별 해석, 없으면 null', () => {
  expect(resolveQuiz('topic', 'u1-t1')).toMatchObject({ title: 'T11 확인 문제', timed: false })
  expect(resolveQuiz('unit', 'u2-2')?.questions).toHaveLength(27)
  expect(resolveQuiz('mock', '3')).toMatchObject({ timed: true, title: '모의고사 3회' })
  expect(resolveQuiz('mock', '9')).toBeNull()
  expect(resolveQuiz('retry', 'r1')).toBeNull()

  useStore.getState().recordAttempt({ kind: 'topic', refId: 'u1-t1', title: '', startedAt: 0, answers: [{ qid: 'u1-t1-q01', picked: 1, correct: false }] })
  useStore.getState().startRetry()
  const r = resolveQuiz('retry', 'r1')
  expect(r?.title).toBe('오답 다시 풀기 1회차')
  expect(r?.questions.map((q) => q.id)).toEqual(['u1-t1-q01'])
  expect(resolveQuiz('retry', 'r2')).toBeNull() // 현재 회차가 아닌 주소
})

test('tally·점수·합격', () => {
  const t = tally(
    [
      { qid: 'u1-t1-q01', picked: 0, correct: true },
      { qid: 'u1-t1-q02', picked: null, correct: false },
      { qid: 'gone', picked: 0, correct: true },
    ],
    (q) => q.unitId,
  )
  expect(t).toEqual({ u1: { correct: 1, total: 2 } })
  expect(toScore(36, 60)).toBe(60)
  expect(toScore(0, 0)).toBe(0)
  expect([isPass(60), isPass(59)]).toEqual([true, false])
})
