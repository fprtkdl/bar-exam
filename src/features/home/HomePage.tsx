import { Link } from 'react-router-dom'
import { examMeta, units } from '../../data/written'
import { practicalMeta, recipes } from '../../data/practical'
import { useStore } from '../../lib/store'
import { Badge, Button, Card, PageHeader } from '../../ui'
import { weakTopics } from '../written/stats/selectors'

const resumeLink = (kind: string, refId: string) => (kind === 'retry' ? '/written/wrong' : `/written/quiz/${kind}/${refId}`)

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
        <Card to="/written" tone="mint">
          <p className="font-pixel text-xl">필기</p>
          <p className="mt-1 text-sm">단원 노트 · 확인 문제 · 모의고사 · 오답노트</p>
        </Card>
        <Card to="/practical" tone="peach">
          <p className="font-pixel text-xl">실기</p>
          <p className="mt-1 text-sm">표준 레시피 {practicalMeta.recipeCount}종 도감 · 바텐더 게임</p>
        </Card>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-2 font-pixel text-lg">이어서 하기</h2>
          {last ? (
            <>
              <p className="font-semibold">{last.title}</p>
              <p className="text-sm text-ink-soft">
                마지막 결과 {last.correct}/{last.total} · {new Date(last.finishedAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" to={resumeLink(last.kind, last.refId)}>{last.kind === 'retry' ? '오답노트로' : '다시 풀기'}</Button>
                <Button size="sm" variant="secondary" to={`/written/result/${last.id}`}>결과 보기</Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-ink-soft">아직 푼 기록이 없어요. 첫 단원 노트부터 읽어 볼까요?</p>
              <div className="mt-3"><Button size="sm" to="/written">필기 시작하기</Button></div>
            </>
          )}
        </Card>

        <Card tone="butter">
          <h2 className="mb-2 font-pixel text-lg">오늘의 추천</h2>
          <ul className="grid gap-2 text-sm">
            <li>
              {weak ? (
                <>가장 약한 토픽 <strong>{weakTitle}</strong> (정답률 {weak.rate}%) · <Link className="underline" to={`/written/topic/${weak.topicId}`}>노트 보기</Link></>
              ) : (
                <>토픽별로 3문항 이상 풀면 약한 토픽을 알려 드려요.</>
              )}
            </li>
            <li>
              {wrongLeft > 0 ? (
                <>복습할 오답 <Badge tone="peach">{wrongLeft}문항</Badge> · <Link className="underline" to="/written/wrong">다시 풀러 가기</Link></>
              ) : (
                <>복습할 오답이 없어요.</>
              )}
            </li>
            <li>
              {notMade > 0 ? (
                <>아직 만들어 보지 않은 칵테일 {notMade}종 · <Link className="underline" to="/practical/game">게임하러 가기</Link></>
              ) : (
                <>모든 칵테일을 한 번 이상 만들었어요.</>
              )}
            </li>
          </ul>
        </Card>
      </div>

      <Card tone="sky">
        <h2 className="mb-2 font-pixel text-lg">시험 개요</h2>
        <ul className="grid gap-1 text-sm sm:grid-cols-2">
          <li>필기: {examMeta.questionCount}문항 · {examMeta.minutes}분 · {examMeta.passScore}점 이상 합격</li>
          <li>실기: 칵테일 {practicalMeta.examDrinks}가지 · {practicalMeta.examMinutes}분 이내 제조</li>
        </ul>
      </Card>
    </>
  )
}
