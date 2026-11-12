/** localStorage 저장 계약 (key: `bar-exam:v1`). 서버 전송 없음. (계약 변경은 컨트롤러만) */
import type { ChoiceIndex } from './written'

export type AttemptKind = 'topic' | 'unit' | 'mock' | 'retry'

export interface AnswerRecord {
  qid: string
  /** 미응답 null */
  picked: ChoiceIndex | null
  correct: boolean
}

export interface AttemptRecord {
  id: string
  kind: AttemptKind
  /** topic: topicId · unit: `${unitId}-${세트번호}` · mock: 회차 '1'.. · retry: `r${round}` */
  refId: string
  title: string
  startedAt: number
  finishedAt: number
  durationSec: number
  total: number
  correct: number
  answers: AnswerRecord[]
}

export interface WrongEntry {
  qid: string
  /** 누적 오답 횟수 */
  wrongCount: number
  lastWrongAt: number
  lastPicked: ChoiceIndex | null
  /** 다시 풀기(retry)에서 맞히면 true. 이후 다시 틀리면 false 로 복귀 */
  cleared: boolean
  clearedAt?: number
}

/** 오답 다시 풀기 회차. 1회차 = 복습 중인 오답 전부, n+1회차 = n회차에서 또 틀린 문제 */
export interface RetryCycle {
  round: number
  /** 이번 회차에 풀 문항 */
  queue: string[]
  startedAt: number
  rounds: { round: number; total: number; correct: number; finishedAt: number }[]
}

export interface GameRecord {
  plays: number
  bestScore: number
  lastScore: number
  lastAt: number
}

export interface PersistedState {
  version: 1
  attempts: AttemptRecord[]
  wrong: Record<string, WrongEntry>
  retry: RetryCycle | null
  /** 올클리어한 과거 사이클 (몇 회차 만에 끝냈는지) */
  retryHistory: { startedAt: number; clearedAt: number; rounds: number; total: number }[]
  /** recipeId → 게임 기록 */
  game: Record<string, GameRecord>
}
