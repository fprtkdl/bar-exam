import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { questionById, units } from '../../../data/written'
import { useStore } from '../../../lib/store'
import { QUESTION_TYPE_LABEL, type QuestionType } from '../../../types/written'
import { Badge, Button, Card, EmptyState, Icon, PageHeader, ProgressBar, StatTile } from '../../../ui'
import { isPass, tally, toScore } from '../quiz/build'
import { QuestionRow } from '../quiz/QuestionRow'
import { QuestionView } from '../quiz/QuestionView'

function Bars({ title, rows }: { title: string; rows: { label: string; correct: number; total: number }[] }) {
  return (
    <Card>
      <h2 className="mb-3 font-pixel">{title}</h2>
      <ul className="grid gap-3">
        {rows.map((r) => (
          <li key={r.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)_3.5rem] items-center gap-3 sm:grid-cols-[8rem_minmax(0,1fr)_3.5rem]">
            <span className="truncate text-sm" title={r.label}>{r.label}</span>
            <ProgressBar value={r.correct} max={r.total} label={`${r.label} 정답 수`} />
            <span className="text-right font-pixel text-xs tabular-nums">
              {r.correct}/{r.total}
            </span>
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
  const [open, setOpen] = useState<string | null>(null)

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
        actions={
          <Button to="/written/wrong">
            <Icon name="note" />
            오답노트로
          </Button>
        }
      />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="점수" value={`${score}점`} tone={mock ? (pass ? 'good' : 'bad') : 'butter'} hint={mock ? (pass ? '합격' : '불합격') : undefined} />
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
          {onlyWrong && <Icon name="check" />}
          {onlyWrong ? '틀린 것만 보는 중' : '틀린 것만 보기'}
        </Button>
      </div>
      {shown.length === 0 ? (
        <EmptyState title="틀린 문항이 없어요" description="모두 맞혔습니다." />
      ) : (
        <ul className="overflow-hidden rounded-pixel border-2 border-ink bg-paper shadow-pixel">
          {shown.map(({ a, no }) => {
            const q = questionById[a.qid]
            if (!q) {
              return (
                <li key={a.qid} className="border-ink-faint px-4 py-3 text-ink-soft not-first:border-t-2">
                  <span className="font-pixel">{no}.</span> 삭제되었거나 수정된 문항입니다.
                </li>
              )
            }
            const isOpen = open === a.qid
            return (
              <QuestionRow
                key={a.qid}
                id={a.qid}
                stem={q.stem}
                open={isOpen}
                onToggle={() => setOpen(isOpen ? null : a.qid)}
                lead={
                  <span className={`flex h-14 flex-col items-center justify-center rounded-pixel border-2 border-ink ${a.correct ? 'bg-mint text-good' : 'bg-peach text-bad'}`}>
                    <span className="font-pixel text-lg leading-none text-ink tabular-nums">{no}</span>
                    <span className="mt-1 flex items-center gap-0.5 text-[11px] leading-none">
                      <Icon name={a.correct ? 'check' : 'x'} size={12} />
                      {a.correct ? '정답' : '오답'}
                    </span>
                  </span>
                }
                top={<Badge tone="lavender">{QUESTION_TYPE_LABEL[q.type as QuestionType]}</Badge>}
              >
                <QuestionView q={q} no={no} picked={a.picked} reveal bare />
              </QuestionRow>
            )
          })}
        </ul>
      )}
    </>
  )
}
