import { questions, units } from '../../../data/written'
import { useStore } from '../../../lib/store'
import { Badge, Card, PageHeader, ProgressBar } from '../../../ui'
import type { Tone } from '../../../ui'
import { tally, toScore } from '../quiz/build'

const SHORTCUTS: { to: string; title: string; desc: string; tone: Tone }[] = [
  { to: '/written/tests', title: '단원평가', desc: '단원별 20문항 세트', tone: 'mint' },
  { to: '/written/mock', title: '모의고사', desc: '60문항 · 60분 실전', tone: 'peach' },
  { to: '/written/wrong', title: '오답노트', desc: '틀린 문제 다시 풀기', tone: 'lavender' },
  { to: '/written/stats', title: '학습 통계', desc: '단원·유형별 정답률', tone: 'sky' },
]

export default function WrittenHubPage() {
  const attempts = useStore((s) => s.attempts)
  const acc = tally(attempts.flatMap((a) => a.answers), (q) => q.unitId)

  return (
    <>
      <PageHeader title="필기" subtitle="단원 노트를 읽고 확인 문제로 점검한 뒤, 단원평가와 모의고사로 실전 감각을 익히세요." />

      <nav aria-label="필기 바로가기" className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {SHORTCUTS.map((s) => (
          <Card key={s.to} to={s.to} tone={s.tone}>
            <p className="font-pixel">{s.title}</p>
            <p className="mt-1 text-sm">{s.desc}</p>
          </Card>
        ))}
      </nav>

      <h2 className="mb-3 font-pixel text-xl">단원</h2>
      <ol className="grid gap-4 md:grid-cols-2">
        {units.map((u) => {
          const qn = questions.filter((q) => q.unitId === u.id).length
          const a = acc[u.id]
          return (
            <li key={u.id}>
              <Card to={`/written/unit/${u.id}`} className="h-full">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-pixel text-lg">
                    {u.order}. {u.title}
                  </h3>
                  <Badge tone="butter">출제 {u.examWeight}문항</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-soft">{u.description}</p>
                <p className="mt-3 text-sm">
                  토픽 {u.topics.length}개 · 문항 {qn}개
                </p>
                <div className="mt-2">
                  {a ? (
                    <>
                      <p className="mb-1 text-sm">내 정답률 {toScore(a.correct, a.total)}%</p>
                      <ProgressBar value={a.correct} max={a.total} label={`${u.title} 정답률`} />
                    </>
                  ) : (
                    <p className="text-sm text-ink-soft">아직 푼 문제가 없어요</p>
                  )}
                </div>
              </Card>
            </li>
          )
        })}
      </ol>
    </>
  )
}
