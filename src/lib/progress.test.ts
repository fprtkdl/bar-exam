import { expect, test } from 'vitest'
import type { AnswerRecord, AttemptKind, PersistedState } from '../types/storage'
import { applyAttempt, beginRetry, buildAttempt, initialState, parseState } from './progress'

const ans = (qid: string, correct: boolean): AnswerRecord => ({ qid, picked: correct ? 0 : 1, correct })
let clock = 1000
const run = (s: PersistedState, kind: AttemptKind, answers: AnswerRecord[]) =>
  applyAttempt(s, buildAttempt({ kind, refId: 'x', title: 't', startedAt: clock, answers }, (clock += 5000)))
const startCycle = (s: PersistedState): PersistedState => ({ ...s, retry: beginRetry(s, clock) })

test('시도 기록: 점수·시간 계산과 오답 누적', () => {
  let s = run(initialState(), 'topic', [ans('a', false), ans('b', true), { qid: 'c', picked: null, correct: false }])
  expect(s.attempts[0]).toMatchObject({ total: 3, correct: 1, durationSec: 5 })
  expect(Object.keys(s.wrong).sort()).toEqual(['a', 'c'])
  expect(s.wrong.c.lastPicked).toBeNull()
  s = run(s, 'unit', [ans('a', false)])
  expect(s.wrong.a.wrongCount).toBe(2)
  expect(s.attempts).toHaveLength(2)
})

test('규칙 4: retry 아닌 시도에서 맞혀도 오답노트 그대로', () => {
  let s = run(initialState(), 'topic', [ans('a', false)])
  s = run(s, 'mock', [ans('a', true)])
  expect(s.wrong.a.cleared).toBe(false)
})

test('retry 회차 진행 → 올클리어', () => {
  let s = run(initialState(), 'topic', [ans('a', false), ans('b', false), ans('c', false)])
  expect(beginRetry(initialState(), clock)).toBeNull()
  s = startCycle(s)
  expect(s.retry).toMatchObject({ round: 1 })
  expect(s.retry!.queue.sort()).toEqual(['a', 'b', 'c'])
  expect(beginRetry(s, clock + 1)).toBe(s.retry) // 진행 중이면 그대로

  s = run(s, 'retry', [ans('a', true), ans('b', false), ans('c', true)])
  expect(s.wrong.a).toMatchObject({ cleared: true })
  expect(s.wrong.b).toMatchObject({ cleared: false, wrongCount: 2 })
  expect(s.retry).toMatchObject({ round: 2, queue: ['b'] })
  expect(s.retry!.rounds).toHaveLength(1)

  s = run(s, 'retry', [ans('b', true)])
  expect(s.retry).toBeNull()
  expect(s.retryHistory).toEqual([expect.objectContaining({ rounds: 2, total: 3 })])
  expect(Object.values(s.wrong).every((w) => w.cleared)).toBe(true)
  expect(beginRetry(s, clock)).toBeNull()
})

test('규칙 5: 사이클 중 새 오답은 현재 queue 에 안 들어가고 다음 사이클에 포함', () => {
  let s = startCycle(run(initialState(), 'topic', [ans('a', false)]))
  s = run(s, 'mock', [ans('z', false)])
  expect(s.retry!.queue).toEqual(['a'])
  s = run(s, 'retry', [ans('a', true)])
  expect(s.retry).toBeNull()
  expect(beginRetry(s, clock)!.queue).toEqual(['z'])
})

test('극복한 문항을 다시 틀리면 cleared=false 로 복귀', () => {
  let s = startCycle(run(initialState(), 'topic', [ans('a', false)]))
  s = run(s, 'retry', [ans('a', true)])
  s = run(s, 'topic', [ans('a', false)])
  expect(s.wrong.a).toMatchObject({ cleared: false, wrongCount: 2 })
})

test('importState 검증: 형식이 틀리면 null', () => {
  expect(parseState('not json')).toBeNull()
  expect(parseState('{"version":2}')).toBeNull()
  expect(parseState(JSON.stringify({ ...initialState(), attempts: [{ id: 1 }] }))).toBeNull()
  expect(parseState(JSON.stringify({ ...initialState(), retry: 'x' }))).toBeNull()
  const ok = run(initialState(), 'topic', [ans('a', false)])
  expect(parseState(JSON.stringify(ok))).toEqual(ok)
})
