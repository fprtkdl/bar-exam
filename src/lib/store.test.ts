import { beforeEach, expect, test, vi } from 'vitest'

beforeEach(() => {
  localStorage.clear()
  vi.resetModules()
})

test('손상된 localStorage 는 버리고 빈 기록으로 시작', async () => {
  localStorage.setItem('bar-exam:v1', JSON.stringify({ state: { version: 1, attempts: 'oops', wrong: null }, version: 1 }))
  const { useStore } = await import('./store')
  expect(useStore.getState().attempts).toEqual([])
  expect(useStore.getState().wrong).toEqual({})
})

test('정상 저장값은 복원하고, 가져오기 실패 시 기존 기록 유지', async () => {
  const { useStore } = await import('./store')
  useStore.getState().recordAttempt({ kind: 'topic', refId: 't', title: 't', startedAt: 0, answers: [{ qid: 'a', picked: 1, correct: false }] })
  const saved = useStore.getState().exportState()
  expect(useStore.getState().importState('{"version":1}')).toBe(false)
  expect(useStore.getState().attempts).toHaveLength(1)
  vi.resetModules()
  const fresh = (await import('./store')).useStore
  expect(fresh.getState().wrong.a.wrongCount).toBe(1)
  useStore.getState().resetAll()
  expect(useStore.getState().importState(saved)).toBe(true)
  expect(useStore.getState().attempts).toHaveLength(1)
})

test('recordGame: 횟수·최고점 갱신', async () => {
  const { useStore } = await import('./store')
  const { recordGame } = useStore.getState()
  recordGame('dry-martini', 70)
  recordGame('dry-martini', 50)
  expect(useStore.getState().game['dry-martini']).toMatchObject({ plays: 2, bestScore: 70, lastScore: 50 })
  expect(localStorage.getItem('bar-exam:v1')).toContain('"plays":2')
})
