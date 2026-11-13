import { useParams } from 'react-router-dom'
import { questions, units } from '../../../data/written'
import { useStore } from '../../../lib/store'
import { Button, Card, EmptyState, Icon, PageHeader } from '../../../ui'
import { unitTestSets } from '../quiz/build'
import { SetCard } from './SetCard'

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
              <p className="flex items-center gap-2 font-pixel">
                <span className="min-w-0 flex-1">
                  {i + 1}. {t.title}
                </span>
                <span className="shrink-0 font-sans text-sm text-ink-soft">문항 {questions.filter((q) => q.topicId === t.id).length}개</span>
                <Icon name="chevron-right" />
              </p>
              <p className="mt-1 text-sm text-ink-soft">{t.summary}</p>
            </Card>
          </li>
        ))}
      </ol>

      <h2 className="mb-3 font-pixel text-xl">이 단원 단원평가</h2>
      {sets.length === 0 ? (
        <EmptyState title="단원평가 문항을 준비 중이에요" />
      ) : (
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {sets.map((s) => {
            const last = attempts.filter((a) => a.kind === 'unit' && a.refId === s.refId).at(-1)
            return (
              <li key={s.refId}>
                <SetCard to={`/written/quiz/unit/${s.refId}`} title={s.title} n={s.questionIds.length} last={last} />
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
