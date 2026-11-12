import { describe, expect, it } from 'vitest'
import type { AttemptRecord, WrongEntry } from '../../../types/storage'
import { byType, byUnit, mockTrend, rateBy, topWrong, weakTopics, type Meta } from './selectors'

const META: Record<string, Meta> = {
  a: { unitId: 'u1', topicId: 'u1-t1', type: 'recall', difficulty: 1 },
  b: { unitId: 'u1', topicId: 'u1-t1', type: 'calc', difficulty: 2 },
  c: { unitId: 'u1', topicId: 'u1-t1', type: 'calc', difficulty: 2 },
  d: { unitId: 'u2', topicId: 'u2-t1', type: 'recall', difficulty: 3 },
}
const look = (id: string) => META[id]
const at = (kind: AttemptRecord['kind'], finishedAt: number, res: [string, boolean][]): AttemptRecord => ({
  id: String(finishedAt), kind, refId: '1', title: 't', startedAt: 0, finishedAt, durationSec: 0,
  total: res.length, correct: res.filter((r) => r[1]).length,
  answers: res.map(([qid, correct]) => ({ qid, picked: 0, correct })),
})
const A = [at('topic', 1, [['a', true], ['b', false], ['gone', false]]), at('mock', 3, [['c', false], ['d', true]]), at('mock', 2, [['a', true]])]

describe('selectors', () => {
  it('집계하고 사라진 문항은 건너뛴다', () => {
    expect(byUnit(A, look).u1).toEqual({ seen: 4, correct: 2, rate: 50 })
    expect(byType(A, look).calc).toEqual({ seen: 2, correct: 0, rate: 0 })
    expect(rateBy(A, (m) => String(m.difficulty), look)['3'].rate).toBe(100)
  })
  it('모의고사 추이는 시간순', () => {
    expect(mockTrend(A).map((p) => p.score)).toEqual([100, 50])
  })
  it('약점 토픽은 3문항 이상만, 낮은 순', () => {
    expect(weakTopics(A, 5, look)).toEqual([{ topicId: 'u1-t1', seen: 4, correct: 2, rate: 50 }])
  })
  it('자주 틀린 문항 정렬', () => {
    const w = (qid: string, wrongCount: number, lastWrongAt: number): WrongEntry => ({ qid, wrongCount, lastWrongAt, lastPicked: 0, cleared: false })
    expect(topWrong({ x: w('x', 1, 9), y: w('y', 3, 1), z: w('z', 3, 5) }, 2).map((e) => e.qid)).toEqual(['z', 'y'])
  })
})
