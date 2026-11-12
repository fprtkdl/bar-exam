/** 통계 파생 함수: attempts[].answers 를 문항 메타와 조인한다 (집계 저장 없음) */
import { questionById } from '../../../data/written'
import type { AttemptRecord, WrongEntry } from '../../../types/storage'
import type { Question } from '../../../types/written'

export type Meta = Pick<Question, 'unitId' | 'topicId' | 'type' | 'difficulty'>
export type Lookup = (qid: string) => Meta | undefined
export type Rate = { seen: number; correct: number; rate: number }

const defaultLookup: Lookup = (id) => questionById[id]

const pct = (correct: number, seen: number) => (seen ? Math.round((correct / seen) * 100) : 0)

/** 키별 {seen, correct, rate(0~100)}. 데이터에서 사라진 qid 는 건너뜀 */
export function rateBy(attempts: AttemptRecord[], key: (m: Meta) => string, lookup: Lookup = defaultLookup): Record<string, Rate> {
  const acc: Record<string, Rate> = {}
  for (const at of attempts)
    for (const a of at.answers) {
      const m = lookup(a.qid)
      if (!m) continue
      const r = (acc[key(m)] ??= { seen: 0, correct: 0, rate: 0 })
      r.seen++
      if (a.correct) r.correct++
    }
  for (const r of Object.values(acc)) r.rate = pct(r.correct, r.seen)
  return acc
}

export const byUnit = (a: AttemptRecord[], l?: Lookup) => rateBy(a, (m) => m.unitId, l)
export const byTopic = (a: AttemptRecord[], l?: Lookup) => rateBy(a, (m) => m.topicId, l)
export const byType = (a: AttemptRecord[], l?: Lookup) => rateBy(a, (m) => m.type, l)
export const byDifficulty = (a: AttemptRecord[], l?: Lookup) => rateBy(a, (m) => String(m.difficulty), l)

export type MockPoint = { id: string; title: string; finishedAt: number; score: number }

/** 모의고사 점수 추이 (시간순, 100점 만점) */
export function mockTrend(attempts: AttemptRecord[]): MockPoint[] {
  return attempts
    .filter((a) => a.kind === 'mock' && a.total > 0)
    .sort((x, y) => x.finishedAt - y.finishedAt)
    .map((a) => ({ id: a.id, title: a.title, finishedAt: a.finishedAt, score: pct(a.correct, a.total) }))
}

/** 약점 토픽: 3문항 이상 푼 토픽 중 정답률 낮은 순 (같으면 많이 푼 순) */
export function weakTopics(attempts: AttemptRecord[], limit = 5, lookup?: Lookup) {
  return Object.entries(byTopic(attempts, lookup))
    .filter(([, r]) => r.seen >= 3)
    .sort((a, b) => a[1].rate - b[1].rate || b[1].seen - a[1].seen)
    .slice(0, limit)
    .map(([topicId, r]) => ({ topicId, ...r }))
}

/** 자주 틀린 문항: wrongCount 많은 순 (같으면 최근 순) */
export function topWrong(wrong: Record<string, WrongEntry>, limit = 10): WrongEntry[] {
  return Object.values(wrong)
    .sort((a, b) => b.wrongCount - a.wrongCount || b.lastWrongAt - a.lastWrongAt)
    .slice(0, limit)
}
