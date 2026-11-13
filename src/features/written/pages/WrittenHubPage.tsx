import { examMeta, questions, units } from '../../../data/written'
import { verifiedPeriod } from '../../../data/written/examMeta'
import { useStore } from '../../../lib/store'
import { Badge, Card, Icon, PageHeader, ProgressBar } from '../../../ui'
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
            <p className="flex items-center justify-between gap-2 font-pixel">
              {s.title}
              <Icon name="chevron-right" />
            </p>
            <p className="mt-1 text-sm">{s.desc}</p>
          </Card>
        ))}
      </nav>

      <Card tone="butter" className="mb-8">
        <h2 className="mb-2 font-pixel">시험 안내</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
          <li>
            필기는 객관식 4지선다 {examMeta.questionCount}문항, {examMeta.minutes}분, {examMeta.passScore}점 이상 합격입니다.
          </li>
          <li>
            이 사이트는 원문을 확인한 출제기준({verifiedPeriod})으로 정리했습니다. 2025년 이후 적용본은 원문을 확인하지 못해 세부 항목이 다를 수 있습니다.
          </li>
        </ul>
      </Card>

      <h2 className="mb-3 font-pixel text-xl">단원</h2>
      <ol className="grid gap-4 md:grid-cols-2">
        {units.map((u) => {
          const qn = questions.filter((q) => q.unitId === u.id).length
          const a = acc[u.id]
          return (
            <li key={u.id}>
              <Card to={`/written/unit/${u.id}`} className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-pixel text-lg">
                    {u.order}. {u.title}
                  </h3>
                  <span className="flex shrink-0 whitespace-nowrap">
                    <Badge tone="butter">출제 {u.examWeight}문항</Badge>
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{u.description}</p>
                {/* 모든 카드가 같은 두 줄(메타·정답률 막대)로 끝나게 */}
                <div className="mt-auto pt-4">
                  <p className="mb-2 flex justify-between gap-2 text-sm">
                    <span>
                      토픽 {u.topics.length}개 · 문항 {qn}개
                    </span>
                    <span className={`tabular-nums ${a ? 'font-semibold' : 'text-ink-soft'}`}>{a ? `정답률 ${toScore(a.correct, a.total)}%` : '아직 안 풀었어요'}</span>
                  </p>
                  <ProgressBar value={a?.correct ?? 0} max={a?.total ?? 1} label={`${u.title} 정답률`} />
                </div>
              </Card>
            </li>
          )
        })}
      </ol>
    </>
  )
}
