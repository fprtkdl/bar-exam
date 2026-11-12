import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { questionById, units } from '../../../data/written'
import { useStore } from '../../../lib/store'
import { QUESTION_TYPE_LABEL, type QuestionType } from '../../../types/written'
import { Badge, Button, Card, EmptyState, PageHeader, ProgressBar, StatTile } from '../../../ui'
import { isPass, tally, toScore } from '../quiz/build'
import { QuestionView } from '../quiz/QuestionView'

function Bars({ title, rows }: { title: string; rows: { label: string; correct: number; total: number }[] }) {
  return (
    <Card>
      <h2 className="mb-3 font-pixel">{title}</h2>
      <ul className="grid gap-2">
        {rows.map((r) => (
          <li key={r.label} className="grid gap-1 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-3">
            <span className="text-sm">{r.label}</span>
            <ProgressBar value={r.correct} max={r.total} label={`${r.label} 정답 수`} showValue />
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default function ResultPage() {
  const { attemptId } = useParams()
  const attempt = useStore((s) => s.attempts.find((a) => a.id === attemptId))
  const [onlyWrong, setOnlyWrong] = useState(false)

  if (!attempt) {
    return (
      <>
        <PageHeader title="채점 결과" back={{ to: '/written', label: '필기' }} />
        <EmptyState title="결과를 찾을 수 없어요" description="기록이 초기화되었거나 잘못된 주소입니다." action={<Button to="/written">필기로</Button>} />
      </>
    )
  }

  const score = toScore(attempt.correct, attempt.total)
  const mock = attempt.kind === 'mock'
  const pass = isPass(score)
  const byUnit = tally(attempt.answers, (q) => q.unitId)
  const byType = tally(attempt.answers, (q) => q.type)
  const shown = attempt.answers.map((a, i) => ({ a, no: i + 1 })).filter(({ a }) => !onlyWrong || !a.correct)
  const min = Math.floor(attempt.durationSec / 60)

  return (
    <>
      <PageHeader
        title={attempt.title}
        subtitle="채점 결과"
        back={{ to: '/written', label: '필기' }}
        actions={<Button to="/written/wrong">오답노트로</Button>}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="점수" value={`${score}점`} tone={mock ? (pass ? 'good' : 'bad') : 'butter'} hint={mock ? (pass ? '✓ 합격' : '✗ 불합격') : undefined} />
        <StatTile label="맞힌 문항" value={`${attempt.correct}/${attempt.total}`} />
        <StatTile label="틀린 문항" value={attempt.total - attempt.correct} />
        <StatTile label="걸린 시간" value={`${min}분 ${attempt.durationSec % 60}초`} />
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Bars
          title="단원별"
          rows={units.filter((u) => byUnit[u.id]).map((u) => ({ label: u.title, ...byUnit[u.id] }))}
        />
        <Bars
          title="유형별"
          rows={Object.entries(byType).map(([t, v]) => ({ label: QUESTION_TYPE_LABEL[t as QuestionType], ...v }))}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-pixel text-xl">문항별 풀이</h2>
        <Button variant="secondary" size="sm" aria-pressed={onlyWrong} onClick={() => setOnlyWrong((v) => !v)}>
          {onlyWrong ? '✓ 틀린 것만 보는 중' : '틀린 것만 보기'}
        </Button>
      </div>
      {shown.length === 0 ? (
        <EmptyState title="틀린 문항이 없어요" description="모두 맞혔습니다." />
      ) : (
        <ol className="grid gap-4">
          {shown.map(({ a, no }) => {
            const q = questionById[a.qid]
            return (
              <li key={a.qid}>
                <Card>
                  {q ? (
                    <QuestionView q={q} no={no} picked={a.picked} reveal />
                  ) : (
                    <p className="text-ink-soft">
                      <Badge>{no}</Badge> 삭제되었거나 수정된 문항입니다.
                    </p>
                  )}
                </Card>
              </li>
            )
          })}
        </ol>
      )}
    </>
  )
}
