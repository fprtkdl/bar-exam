import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AttemptRecord, PersistedState, RetryCycle } from '../types/storage'
import { applyAttempt, applyGame, beginRetry, buildAttempt, initialState, isPersistedState, parseState, type AttemptInput } from './progress'

const STORAGE_KEY = 'bar-exam:v1'

type Actions = {
  recordAttempt(input: AttemptInput): AttemptRecord
  /** exists: 데이터에 남아 있는 문항인지 (사라진 문항은 다시 풀기에서 뺀다) */
  startRetry(exists?: (qid: string) => boolean): RetryCycle | null
  abandonRetry(): void
  recordGame(recipeId: string, score: number): void
  resetAll(): void
  importState(json: string): boolean
  exportState(): string
}

const pick = (s: PersistedState): PersistedState => ({
  version: 1,
  attempts: s.attempts,
  wrong: s.wrong,
  retry: s.retry,
  retryHistory: s.retryHistory,
  game: s.game,
})

export const useStore = create<PersistedState & Actions>()(
  persist(
    (set, get) => ({
      ...initialState(),
      recordAttempt(input) {
        const attempt = buildAttempt(input, Date.now())
        set(applyAttempt(pick(get()), attempt))
        return attempt
      },
      startRetry(exists) {
        const cycle = beginRetry(get(), Date.now(), exists)
        if (cycle !== get().retry) set({ retry: cycle })
        return cycle
      },
      abandonRetry: () => set({ retry: null }),
      recordGame: (recipeId, score) => set(applyGame(pick(get()), recipeId, score, Date.now())),
      resetAll: () => set(initialState()),
      importState(json) {
        const next = parseState(json)
        if (!next) return false
        set(pick(next))
        return true
      },
      exportState: () => JSON.stringify(pick(get()), null, 2),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      partialize: (s) => pick(s),
      // 손상된 저장값(직접 수정·다른 버전)은 버리고 빈 기록으로 시작 — 화면이 깨지지 않게
      merge: (persisted, current) => (isPersistedState(persisted) ? { ...current, ...pick(persisted) } : current),
    },
  ),
)
