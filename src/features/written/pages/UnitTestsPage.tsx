import { units } from '../../../data/written'
import { useStore } from '../../../lib/store'
import { EmptyState, PageHeader } from '../../../ui'
import { SetCard } from './SetCard'
import { unitTestSets } from '../quiz/build'

export default function UnitTestsPage() {
  const attempts = useStore((s) => s.attempts)
  const all = units.map((u) => ({ u, sets: unitTestSets(u.id) }))

  return (
    <>
      <PageHeader title="단원평가" subtitle="단원별 20문항 세트입니다. 세트 구성은 고정이라 다시 풀며 실력을 비교할 수 있어요." back={{ to: '/written', label: '필기' }} />
      {all.every((x) => x.sets.length === 0) && <EmptyState title="단원평가 문항을 준비 중이에요" />}
      <div className="grid gap-8">
        {all
          .filter((x) => x.sets.length > 0)
          .map(({ u, sets }) => (
            <section key={u.id} aria-labelledby={`h-${u.id}`}>
              <h2 id={`h-${u.id}`} className="mb-3 font-pixel text-lg">
                {u.order}. {u.title}
              </h2>
              <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {sets.map((s) => {
                  const last = attempts.filter((a) => a.kind === 'unit' && a.refId === s.refId).at(-1)
                  return (
                    <li key={s.refId}>
                      <SetCard to={`/written/quiz/unit/${s.refId}`} title={`${s.refId.split('-')[1]}세트`} n={s.questionIds.length} last={last} />
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
      </div>
    </>
  )
}
