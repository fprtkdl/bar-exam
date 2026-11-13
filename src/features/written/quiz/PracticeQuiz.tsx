import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../../lib/store'
import type { AttemptKind } from '../../../types/storage'
import type { ChoiceIndex } from '../../../types/written'
import { Button, Card, Icon, PageHeader, ProgressBar } from '../../../ui'
import type { ResolvedQuiz } from './build'
import { KeyHint, QuestionView, useQuizKeys } from './QuestionView'

type Props = { kind: AttemptKind; refId: string; quiz: ResolvedQuiz; back: { to: string; label: string } }

/** 연습형(topic·unit·retry): 한 문항씩, 고르면 즉시 정오·해설 */
export function PracticeQuiz({ kind, refId, quiz, back }: Props) {
  const navigate = useNavigate()
  const recordAttempt = useStore((s) => s.recordAttempt)
  const [startedAt] = useState(Date.now)
  const [idx, setIdx] = useState(0)
  const done = useRef(false)
  const [picks, setPicks] = useState<(ChoiceIndex | null)[]>(() => quiz.questions.map(() => null))

  const q = quiz.questions[idx]
  const picked = picks[idx]
  const last = idx === quiz.questions.length - 1
  const correctSoFar = picks.filter((p, i) => p !== null && p === quiz.questions[i].answer).length

  const pick = (c: ChoiceIndex) => {
    setPicks((ps) => ps.map((p, i) => (i === idx ? c : p)))
  }

  const next = () => (last ? finish() : setIdx(idx + 1))
  useQuizKeys({
    pick: (c) => picked === null && pick(c),
    next: () => picked !== null && next(),
  })

  const finish = () => {
    if (done.current) return // 빠른 연타로 두 번 저장되지 않게
    done.current = true
    const attempt = recordAttempt({
      kind,
      refId,
      title: quiz.title,
      startedAt,
      answers: quiz.questions.map((qq, i) => ({ qid: qq.id, picked: picks[i], correct: picks[i] === qq.answer })),
    })
    navigate(`/written/result/${attempt.id}`, { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl pb-20 sm:pb-0">
      <PageHeader title={quiz.title} back={back} />
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar value={idx + 1} max={quiz.questions.length} label="문제 진행" tone="butter" showValue />
        </div>
        <span className="inline-flex items-center gap-1 font-pixel text-sm text-ink-soft">
          <Icon name="check" />
          맞힘 {correctSoFar}
        </span>
      </div>
      <Card>
        <QuestionView key={q.id} q={q} no={idx + 1} picked={picked} reveal={picked !== null} onPick={pick} />
      </Card>
      {/* 모바일: 하단 탭 바 바로 위에 고정 */}
      <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-10 flex min-h-16 items-center justify-between gap-3 border-t-2 border-ink bg-paper px-4 py-2 sm:static sm:mt-4 sm:min-h-11 sm:border-0 sm:bg-transparent sm:p-0">
        {picked === null ? <p className="text-sm text-ink-soft sm:hidden">보기를 고르면 바로 채점돼요</p> : <span className="sm:hidden" />}
        <KeyHint />
        {picked !== null && (
          <Button autoFocus onClick={next}>
            {last ? '결과 보기' : '다음 문제'}
            <Icon name="arrow-right" />
          </Button>
        )}
      </div>
    </div>
  )
}
