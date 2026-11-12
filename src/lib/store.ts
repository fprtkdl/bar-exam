import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AttemptRecord, PersistedState, RetryCycle } from '../types/storage'
import { applyAttempt, applyGame, beginRetry, buildAttempt, initialState, parseState, type AttemptInput } from './progress'

export const STORAGE_KEY = 'bar-exam:v1'

type Actions = {
  recordAttempt(input: AttemptInput): AttemptRecord
  startRetry(): RetryCycle | null
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
      startRetry() {
        const cycle = beginRetry(get(), Date.now())
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
    { name: STORAGE_KEY, version: 1, partialize: (s) => pick(s) },
  ),
)
