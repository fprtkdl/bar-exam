import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { examMeta, units } from '../../data/written'
import { practicalMeta, recipes } from '../../data/practical'
import { useStore } from '../../lib/store'
import { Button, Card, Icon, PageHeader, type IconName } from '../../ui'
import { weakTopics } from '../written/stats/selectors'

const resumeLink = (kind: string, refId: string) => (kind === 'retry' ? '/written/wrong' : `/written/quiz/${kind}/${refId}`)

function EntryCard({ to, tone, icon, title, desc }: { to: string; tone: 'mint' | 'peach'; icon: IconName; title: string; desc: string }) {
  return (
    <Card to={to} tone={tone}>
      <div className="flex items-center gap-3">
        <Icon name={icon} size={24} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-pixel text-xl">{title}</p>
          <p className="mt-1 truncate text-sm">{desc}</p>
        </div>
        <Icon name="chevron-right" size={20} className="shrink-0" />
      </div>
    </Card>
  )
}

function RecRow({ to, icon, title, children }: { to: string; icon: IconName; title: string; children: ReactNode }) {
  return (
    <li>
      <Link to={to} className="flex min-h-11 items-center gap-3 rounded-pixel px-2 py-2 hover:bg-paper/60 focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-ink">
        <Icon name={icon} className="shrink-0" />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">{title}</span>
          <span className="block truncate text-sm">{children}</span>
        </span>
        <Icon name="chevron-right" className="shrink-0" />
      </Link>
    </li>
  )
}

export default function HomePage() {
  const attempts = useStore((s) => s.attempts)
  const wrong = useStore((s) => s.wrong)
  const game = useStore((s) => s.game)

  const last = attempts[attempts.length - 1]
  const weak = weakTopics(attempts, 1)[0]
  const weakTitle = weak && units.flatMap((u) => u.topics).find((t) => t.id === weak.topicId)?.title
  const wrongLeft = Object.values(wrong).filter((w) => !w.cleared).length
  const notMade = recipes.filter((r) => !game[r.id]).length

  return (
    <>
      <PageHeader title="조주기능사 공부바" subtitle="필기는 노트와 문제로, 실기는 도감과 바텐더 게임으로 준비하세요." />

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <EntryCard to="/written" tone="mint" icon="book" title="필기" desc="단원 노트 · 확인 문제 · 모의고사 · 오답노트" />
        <EntryCard to="/practical" tone="peach" icon="glass" title="실기" desc={`표준 레시피 ${practicalMeta.recipeCount}종 도감 · 바텐더 게임`} />
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-pixel text-lg">이어서 하기</h2>
          {last ? (
            <>
              <p className="font-semibold">{last.title}</p>
              <p className="text-sm text-ink-soft">
                마지막 결과 {last.correct}/{last.total}문항 · {new Date(last.finishedAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" to={resumeLink(last.kind, last.refId)}>
                  <Icon name="play" />
                  {last.kind === 'retry' ? '오답노트로' : '다시 풀기'}
                </Button>
                <Button size="sm" variant="secondary" to={`/written/result/${last.id}`}>
                  <Icon name="chart" />
                  결과 보기
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="font-semibold">아직 푼 기록이 없어요</p>
              <p className="text-sm text-ink-soft">첫 단원 노트부터 읽어 볼까요?</p>
              <div className="mt-3">
                <Button size="sm" to="/written">
                  <Icon name="play" />
                  필기 시작하기
                </Button>
              </div>
            </>
          )}
        </Card>

        <Card tone="butter">
          <h2 className="mb-3 font-pixel text-lg">오늘의 추천</h2>
          <ul className="-mx-2 grid gap-1">
            <RecRow to={weak ? `/written/topic/${weak.topicId}` : '/written'} icon="flag" title="약한 토픽 복습">
              {weak ? `${weakTitle} · 정답률 ${weak.rate}%` : '토픽별 3문항 이상 풀면 알려 드려요'}
            </RecRow>
            <RecRow to="/written/wrong" icon="refresh" title="오답 다시 풀기">
              {wrongLeft > 0 ? `남은 오답 ${wrongLeft}문항` : '복습할 오답이 없어요'}
            </RecRow>
            <RecRow to="/practical/game" icon="shaker" title="칵테일 게임">
              {notMade > 0 ? `아직 만들지 않은 칵테일 ${notMade}종` : '모든 칵테일을 만들어 봤어요'}
            </RecRow>
          </ul>
        </Card>
      </div>

      <Card tone="sky">
        <h2 className="mb-3 font-pixel text-lg">시험 개요</h2>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          <li className="flex items-center gap-2">
            <Icon name="pencil" className="shrink-0" />
            필기: {examMeta.questionCount}문항 · {examMeta.minutes}분 · {examMeta.passScore}점 이상 합격
          </li>
          <li className="flex items-center gap-2">
            <Icon name="glass" className="shrink-0" />
            실기: 칵테일 {practicalMeta.examDrinks}가지 · {practicalMeta.examMinutes}분 이내 제조
          </li>
        </ul>
      </Card>
    </>
  )
}
