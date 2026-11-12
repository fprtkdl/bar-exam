import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../../lib/store'
import type { AttemptKind } from '../../../types/storage'
import type { ChoiceIndex } from '../../../types/written'
import { Button, Card, PageHeader, ProgressBar } from '../../../ui'
import type { ResolvedQuiz } from './build'
import { QuestionView } from './QuestionView'

type Props = { kind: AttemptKind; refId: string; quiz: ResolvedQuiz; back: { to: string; label: string } }

/** 연습형(topic·unit·retry): 한 문항씩, 고르면 즉시 정오·해설 */
export function PracticeQuiz({ kind, refId, quiz, back }: Props) {
  const navigate = useNavigate()
  const recordAttempt = useStore((s) => s.recordAttempt)
  const [startedAt] = useState(Date.now)
  const [idx, setIdx] = useState(0)
  const [picks, setPicks] = useState<(ChoiceIndex | null)[]>(() => quiz.questions.map(() => null))

  const q = quiz.questions[idx]
  const picked = picks[idx]
  const last = idx === quiz.questions.length - 1
  const correctSoFar = picks.filter((p, i) => p !== null && p === quiz.questions[i].answer).length

  const pick = (c: ChoiceIndex) => {
    setPicks((ps) => ps.map((p, i) => (i === idx ? c : p)))
  }

  const finish = () => {
    const ref = kind === 'retry' ? `r${useStore.getState().retry?.round ?? 1}` : refId
    const attempt = recordAttempt({
      kind,
      refId: ref,
      title: quiz.title,
      startedAt,
      answers: quiz.questions.map((qq, i) => ({ qid: qq.id, picked: picks[i], correct: picks[i] === qq.answer })),
    })
    navigate(`/written/result/${attempt.id}`, { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={quiz.title} back={back} />
      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar value={idx + 1} max={quiz.questions.length} label="문제 진행" tone="butter" showValue />
        </div>
        <span className="font-pixel text-sm text-ink-soft">맞힘 {correctSoFar}</span>
      </div>
      <Card>
        <QuestionView key={q.id} q={q} no={idx + 1} picked={picked} reveal={picked !== null} onPick={pick} />
      </Card>
      <div className="mt-4 flex justify-end">
        {picked !== null &&
          (last ? (
            <Button autoFocus onClick={finish}>
              결과 보기
            </Button>
          ) : (
            <Button autoFocus onClick={() => setIdx(idx + 1)}>
              다음 문제
            </Button>
          ))}
      </div>
    </div>
  )
}
