import { units } from '../../../data/written'
import { useStore } from '../../../lib/store'
import { Card, EmptyState, PageHeader } from '../../../ui'
import { unitTestSets } from '../quiz/build'

export default function UnitTestsPage() {
  const attempts = useStore((s) => s.attempts)
  const all = units.map((u) => ({ u, sets: unitTestSets(u.id) }))

  return (
    <>
      <PageHeader title="단원평가" subtitle="단원별 20문항 세트입니다. 세트 구성은 고정이라 다시 풀며 실력을 비교할 수 있어요." back={{ to: '/written', label: '필기' }} />
      {all.every((x) => x.sets.length === 0) && <EmptyState title="단원평가 문항을 준비 중이에요" />}
      <div className="grid gap-6">
        {all
          .filter((x) => x.sets.length > 0)
          .map(({ u, sets }) => (
            <section key={u.id} aria-labelledby={`h-${u.id}`}>
              <h2 id={`h-${u.id}`} className="mb-3 font-pixel text-lg">
                {u.order}. {u.title}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {sets.map((s) => {
                  const last = attempts.filter((a) => a.kind === 'unit' && a.refId === s.refId).at(-1)
                  return (
                    <li key={s.refId}>
                      <Card tone={last ? 'mint' : 'paper'} to={`/written/quiz/unit/${s.refId}`}>
                        <p className="font-pixel">{s.refId.split('-')[1]}세트</p>
                        <p className="mt-1 text-sm">
                          {s.questionIds.length}문항 · {last ? `최근 ${last.correct}/${last.total}` : '아직 안 풀었어요'}
                        </p>
                      </Card>
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
