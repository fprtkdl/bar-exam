import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import type { AttemptKind } from '../../../types/storage'
import { Button, EmptyState, PageHeader } from '../../../ui'
import { resolveQuiz } from '../quiz/build'
import { MockExam } from '../quiz/MockExam'
import { PracticeQuiz } from '../quiz/PracticeQuiz'

const KINDS: AttemptKind[] = ['topic', 'unit', 'mock', 'retry']

const backOf = (kind: AttemptKind, refId: string) =>
  kind === 'topic'
    ? { to: `/written/topic/${refId}`, label: '토픽 노트' }
    : kind === 'unit'
      ? { to: '/written/tests', label: '단원평가' }
      : kind === 'retry'
        ? { to: '/written/wrong', label: '오답노트' }
        : { to: '/written/mock', label: '모의고사' }

export default function QuizPage() {
  const { kind = '', refId = '' } = useParams()
  const k = KINDS.includes(kind as AttemptKind) ? (kind as AttemptKind) : null
  // 무작위 출제(토픽)가 리렌더마다 바뀌지 않도록 파라미터 단위로 고정
  const quiz = useMemo(() => (k ? resolveQuiz(k, refId) : null), [k, refId])

  if (!k || !quiz) {
    const back = backOf(k ?? 'mock', refId)
    return (
      <>
        <PageHeader title="문제 풀기" back={back} />
        <EmptyState
          title={k === 'retry' ? '진행 중인 오답 다시 풀기가 없어요' : '풀 수 있는 문제가 아직 없어요'}
          description={k === 'retry' ? '오답노트에서 다시 풀기를 시작하세요.' : '문항이 준비되는 대로 이 세트를 풀 수 있습니다.'}
          action={<Button to={back.to}>{back.label}로</Button>}
        />
      </>
    )
  }
  return k === 'mock' ? (
    <MockExam key={refId} refId={refId} quiz={quiz} />
  ) : (
    <PracticeQuiz key={`${k}/${refId}`} kind={k} refId={refId} quiz={quiz} back={backOf(k, refId)} />
  )
}
