/** 필기 문항 세트 구성 (토픽 확인 문제·단원평가·모의고사·오답 다시 풀기) */
import { examMeta, questionById, questions, units } from '../../../data/written'
import { seededShuffle } from '../../../lib/rng'
import { useStore } from '../../../lib/store'
import type { AnswerRecord, AttemptKind } from '../../../types/storage'
import type { Question } from '../../../types/written'

export type QuizSet = { refId: string; title: string; questionIds: string[] }
export type ResolvedQuiz = { title: string; questions: Question[]; timed: boolean }

const MOCK_ROUNDS = 5

/** 그 토픽에서 무작위 5문항 */
export function topicQuiz(topicId: string): Question[] {
  return seededShuffle(
    questions.filter((q) => q.topicId === topicId),
    String(Math.random()),
  ).slice(0, 5)
}

/** 단원 문항을 unitId seed 로 섞어 20문항씩. 마지막 조각이 10 미만이면 앞 세트에 합친다 */
export function unitTestSets(unitId: string): QuizSet[] {
  const unit = units.find((u) => u.id === unitId)
  if (!unit) return []
  const ids = seededShuffle(
    questions.filter((q) => q.unitId === unitId).map((q) => q.id),
    unitId,
  )
  const chunks: string[][] = []
  for (let i = 0; i < ids.length; i += 20) chunks.push(ids.slice(i, i + 20))
  if (chunks.length > 1 && chunks[chunks.length - 1].length < 10) {
    const last = chunks.pop()!
    chunks[chunks.length - 1].push(...last)
  }
  return chunks.map((questionIds, i) => ({
    refId: `${unitId}-${i + 1}`,
    title: `${unit.title} 단원평가 ${i + 1}세트`,
    questionIds,
  }))
}

/** 5회차. 단원별 examWeight 만큼 고정 seed 비복원 추출 (풀이 모자란 단원만 회차 간 중복). 회차 내 순서는 단원 order */
export function mockRounds(): QuizSet[] {
  const sorted = [...units].sort((a, b) => a.order - b.order)
  const pools = sorted.map((u) =>
    seededShuffle(
      questions.filter((q) => q.unitId === u.id).map((q) => q.id),
      `mock-${u.id}`,
    ),
  )
  return Array.from({ length: MOCK_ROUNDS }, (_, r) => ({
    refId: String(r + 1),
    title: `모의고사 ${r + 1}회`,
    questionIds: sorted.flatMap((u, i) => {
      const pool = pools[i]
      const n = Math.min(u.examWeight, pool.length)
      return Array.from({ length: n }, (_, k) => pool[(r * u.examWeight + k) % pool.length])
    }),
  }))
}

const toQuestions = (ids: string[]) => ids.map((id) => questionById[id]).filter((q): q is Question => !!q)

/** 라우트 파라미터 → 풀 문항. 없거나 비면 null */
export function resolveQuiz(kind: AttemptKind, refId: string): ResolvedQuiz | null {
  let r: ResolvedQuiz | null = null
  if (kind === 'topic') {
    const topic = units.flatMap((u) => u.topics).find((t) => t.id === refId)
    if (topic) r = { title: `${topic.title} 확인 문제`, questions: topicQuiz(refId), timed: false }
  } else if (kind === 'unit') {
    const set = unitTestSets(refId.replace(/-\d+$/, '')).find((s) => s.refId === refId)
    if (set) r = { title: set.title, questions: toQuestions(set.questionIds), timed: false }
  } else if (kind === 'mock') {
    const set = mockRounds().find((s) => s.refId === refId)
    if (set) r = { title: set.title, questions: toQuestions(set.questionIds), timed: true }
  } else if (kind === 'retry') {
    // refId 와 상관없이 진행 중 사이클의 현재 회차를 푼다
    const cycle = useStore.getState().retry
    if (cycle) r = { title: `오답 다시 풀기 ${cycle.round}회차`, questions: toQuestions(cycle.queue), timed: false }
  }
  return r && r.questions.length ? r : null
}

/** 답안 → 키별 정오 집계 (단원별·유형별). key 가 없으면 건너뜀 */
export function tally(answers: AnswerRecord[], key: (q: Question) => string): Record<string, { correct: number; total: number }> {
  const out: Record<string, { correct: number; total: number }> = {}
  for (const a of answers) {
    const q = questionById[a.qid]
    if (!q) continue
    const t = (out[key(q)] ??= { correct: 0, total: 0 })
    t.total++
    if (a.correct) t.correct++
  }
  return out
}

export const toScore = (correct: number, total: number) => (total ? Math.round((correct / total) * 100) : 0)
export const isPass = (score: number) => score >= examMeta.passScore
