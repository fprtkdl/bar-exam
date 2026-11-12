import { expect, test } from 'vitest'
import { useStore } from './store'

test('importState 실패 시 기존 데이터 유지, 성공 시 교체', () => {
  const s = useStore.getState()
  s.recordAttempt({ kind: 'topic', refId: 'u1-t1', title: 't', startedAt: Date.now(), answers: [{ qid: 'q', picked: 1, correct: false }] })
  const before = useStore.getState().exportState()
  expect(useStore.getState().importState('{"version":1}')).toBe(false)
  expect(useStore.getState().exportState()).toBe(before)
  useStore.getState().resetAll()
  expect(useStore.getState().attempts).toHaveLength(0)
  expect(useStore.getState().importState(before)).toBe(true)
  expect(useStore.getState().wrong.q.wrongCount).toBe(1)
  expect(localStorage.getItem('bar-exam:v1')).toContain('"wrongCount":1')
})

test('recordGame: 횟수·최고점 갱신', () => {
  const { recordGame } = useStore.getState()
  recordGame('dry-martini', 70)
  recordGame('dry-martini', 50)
  expect(useStore.getState().game['dry-martini']).toMatchObject({ plays: 2, bestScore: 70, lastScore: 50 })
})
