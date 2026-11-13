import { examMeta } from '../../../data/written'
import { useStore } from '../../../lib/store'
import { Badge, Card, Icon, PageHeader } from '../../../ui'
import { isPass, mockRounds, toScore } from '../quiz/build'

export default function MockListPage() {
  const attempts = useStore((s) => s.attempts)
  const rounds = mockRounds()

  return (
    <>
      <PageHeader title="모의고사" subtitle="실제 시험처럼 시간을 재고, 제출한 뒤에 해설을 봅니다." back={{ to: '/written', label: '필기' }} />

      <Card tone="butter" className="mb-8">
        <h2 className="mb-2 font-pixel">시험 안내</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
          <li>
            객관식 4지선다 {examMeta.questionCount}문항, 제한 시간 {examMeta.minutes}분, 100점 만점에 {examMeta.passScore}점 이상이면 합격입니다.
          </li>
          <li>단원별 출제 비중대로 뽑았고, 회차끼리는 문항이 겹치지 않습니다.</li>
          <li>시간이 끝나면 자동으로 제출됩니다. 새로고침해도 푼 답과 남은 시간은 유지됩니다.</li>
          <li>문제는 출제기준을 바탕으로 만든 창작 문제이며 실제 기출이 아닙니다.</li>
        </ul>
      </Card>

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rounds.map((r) => {
          const mine = attempts.filter((a) => a.kind === 'mock' && a.refId === r.refId)
          const best = mine.length ? Math.max(...mine.map((a) => toScore(a.correct, a.total))) : null
          const n = r.questionIds.length
          const ready = n > 0
          return (
            <li key={r.refId}>
              <Card tone={ready ? 'peach' : 'paper'} to={ready ? `/written/quiz/mock/${r.refId}` : undefined} className="h-full">
                <div className="flex min-h-6 items-center justify-between gap-2">
                  <p className="font-pixel text-lg">{r.title}</p>
                  {best !== null && (
                    <Badge tone={isPass(best) ? 'good' : 'bad'}>
                      <Icon name={isPass(best) ? 'check' : 'x'} size={12} />
                      {isPass(best) ? '합격' : '불합격'}
                    </Badge>
                  )}
                </div>
                <p className="mt-2 text-sm">
                  {ready ? `${n}문항 · ${examMeta.minutes}분` : '문항 준비 중'}
                  {ready && n < examMeta.questionCount && ` (준비된 문항만 · 정규 ${examMeta.questionCount}문항)`}
                </p>
                <p className={`mt-1 font-pixel text-xs tabular-nums ${best === null ? 'text-ink-soft' : ''}`}>
                  {best === null ? '아직 응시하지 않았어요' : `최고 ${best}점 · 응시 ${mine.length}회`}
                </p>
              </Card>
            </li>
          )
        })}
      </ol>
    </>
  )
}
