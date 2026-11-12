import { useParams } from 'react-router-dom'
import { questions, units } from '../../../data/written'
import { useStore } from '../../../lib/store'
import { Button, Card, EmptyState, PageHeader } from '../../../ui'
import { unitTestSets } from '../quiz/build'

export default function UnitPage() {
  const { unitId } = useParams()
  const unit = units.find((u) => u.id === unitId)
  const attempts = useStore((s) => s.attempts)

  if (!unit) {
    return (
      <>
        <PageHeader title="단원" back={{ to: '/written', label: '필기' }} />
        <EmptyState title="없는 단원이에요" action={<Button to="/written">필기로</Button>} />
      </>
    )
  }
  const sets = unitTestSets(unit.id)

  return (
    <>
      <PageHeader title={`${unit.order}. ${unit.title}`} subtitle={unit.description} back={{ to: '/written', label: '필기' }} />

      <h2 className="mb-3 font-pixel text-xl">토픽</h2>
      <ol className="mb-8 grid gap-3">
        {unit.topics.map((t, i) => (
          <li key={t.id}>
            <Card to={`/written/topic/${t.id}`}>
              <p className="font-pixel">
                {i + 1}. {t.title}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{t.summary}</p>
              <p className="mt-2 text-sm">문항 {questions.filter((q) => q.topicId === t.id).length}개</p>
            </Card>
          </li>
        ))}
      </ol>

      <h2 className="mb-3 font-pixel text-xl">이 단원 단원평가</h2>
      {sets.length === 0 ? (
        <EmptyState title="단원평가 문항을 준비 중이에요" />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {sets.map((s) => {
            const last = attempts.filter((a) => a.kind === 'unit' && a.refId === s.refId).at(-1)
            return (
              <li key={s.refId}>
                <Card tone="mint" to={`/written/quiz/unit/${s.refId}`}>
                  <p className="font-pixel">{s.title}</p>
                  <p className="mt-1 text-sm">
                    {s.questionIds.length}문항 · {last ? `최근 ${last.correct}/${last.total}` : '아직 안 풀었어요'}
                  </p>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
