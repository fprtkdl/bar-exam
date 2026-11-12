/** 학습 기록 순수 로직 (§3). store.ts 가 이 함수들로 상태를 바꾼다 */
import type { AnswerRecord, AttemptKind, AttemptRecord, PersistedState, RetryCycle } from '../types/storage'

export type AttemptInput = { kind: AttemptKind; refId: string; title: string; startedAt: number; answers: AnswerRecord[] }

export function initialState(): PersistedState {
  return { version: 1, attempts: [], wrong: {}, retry: null, retryHistory: [], game: {} }
}

export function buildAttempt(input: AttemptInput, finishedAt: number, rand = Math.random()): AttemptRecord {
  return {
    ...input,
    id: `${finishedAt}-${rand.toString(36).slice(2, 8)}`,
    finishedAt,
    durationSec: Math.max(0, Math.round((finishedAt - input.startedAt) / 1000)),
    total: input.answers.length,
    correct: input.answers.filter((a) => a.correct).length,
  }
}

export function applyAttempt(state: PersistedState, attempt: AttemptRecord): PersistedState {
  const at = attempt.finishedAt
  const wrong = { ...state.wrong }
  for (const a of attempt.answers) {
    if (!a.correct) {
      const prev = wrong[a.qid]
      wrong[a.qid] = { qid: a.qid, wrongCount: (prev?.wrongCount ?? 0) + 1, lastWrongAt: at, lastPicked: a.picked, cleared: false }
    } else if (attempt.kind === 'retry' && wrong[a.qid]) {
      wrong[a.qid] = { ...wrong[a.qid], cleared: true, clearedAt: at }
    }
  }

  let retry = state.retry
  let retryHistory = state.retryHistory
  if (attempt.kind === 'retry' && retry) {
    const rounds = [...retry.rounds, { round: retry.round, total: attempt.total, correct: attempt.correct, finishedAt: at }]
    const queue = attempt.answers.filter((a) => !a.correct).map((a) => a.qid)
    if (queue.length === 0) {
      retryHistory = [...retryHistory, { startedAt: retry.startedAt, clearedAt: at, rounds: rounds.length, total: rounds[0].total }]
      retry = null
    } else {
      retry = { ...retry, rounds, queue, round: retry.round + 1 }
    }
  }

  return { ...state, attempts: [...state.attempts, attempt], wrong, retry, retryHistory }
}

/** 진행 중 사이클이 있으면 그대로, 없으면 미극복 오답 전부로 1회차. 오답 0개면 cycle null */
export function beginRetry(state: PersistedState, now: number): RetryCycle | null {
  if (state.retry) return state.retry
  const queue = Object.values(state.wrong)
    .filter((w) => !w.cleared)
    .sort((a, b) => b.lastWrongAt - a.lastWrongAt)
    .map((w) => w.qid)
  return queue.length ? { round: 1, queue, startedAt: now, rounds: [] } : null
}

export function applyGame(state: PersistedState, recipeId: string, score: number, now: number): PersistedState {
  const prev = state.game[recipeId]
  return {
    ...state,
    game: {
      ...state.game,
      [recipeId]: { plays: (prev?.plays ?? 0) + 1, bestScore: Math.max(prev?.bestScore ?? score, score), lastScore: score, lastAt: now },
    },
  }
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)

/** 가져오기 형식 검증 (신뢰 경계). 구조만 확인하고 내용 값은 믿는다 */
export function isPersistedState(v: unknown): v is PersistedState {
  if (!isObj(v) || v.version !== 1) return false
  if (!Array.isArray(v.attempts) || !Array.isArray(v.retryHistory) || !isObj(v.wrong) || !isObj(v.game)) return false
  const okAttempt = (a: unknown) =>
    isObj(a) && typeof a.id === 'string' && typeof a.kind === 'string' && typeof a.finishedAt === 'number' && Array.isArray(a.answers)
  if (!v.attempts.every(okAttempt)) return false
  if (!Object.values(v.wrong).every((w) => isObj(w) && typeof w.qid === 'string' && typeof w.wrongCount === 'number')) return false
  if (v.retry !== null && !(isObj(v.retry) && typeof v.retry.round === 'number' && Array.isArray(v.retry.queue) && Array.isArray(v.retry.rounds)))
    return false
  return true
}

export function parseState(json: string): PersistedState | null {
  try {
    const v: unknown = JSON.parse(json)
    return isPersistedState(v) ? v : null
  } catch {
    return null
  }
}
