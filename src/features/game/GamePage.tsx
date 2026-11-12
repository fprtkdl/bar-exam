import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CocktailArt } from '../../art'
import { practicalMeta, recipeById, recipes } from '../../data/practical'
import { useStore } from '../../lib/store'
import { Badge, Button, Card, PageHeader } from '../../ui'
import type { ScoreSheet } from './engine'
import { Workbench, type Mode } from './ui/Workbench'

type Session = {
  mode: Mode
  queue: string[]
  index: number
  scores: number[]
  /** 같은 잔 다시 만들기 횟수 (Workbench 새로 그리기용 key) */
  attempt: number
  customer: number
  hints: number
  endsAt: number | null
  showResult: boolean
}

const MODE_LABEL: Record<Mode, string> = {
  practice: '연습',
  real: '실전',
  exam: '시험',
}
const pickRandom = (n: number) =>
  [...recipes]
    .sort(() => Math.random() - 0.5)
    .slice(0, n)
    .map((r) => r.id)
const newSession = (mode: Mode, queue: string[]): Session => ({
  mode,
  queue,
  index: 0,
  scores: [],
  attempt: 0,
  customer: Math.floor(Math.random() * 6),
  hints: 0,
  endsAt: mode === 'exam' ? Date.now() + practicalMeta.examMinutes * 60_000 : null,
  showResult: false,
})

export default function GamePage() {
  const [params] = useSearchParams()
  const initial = params.get('recipe')
  const [session, setSession] = useState<Session | null>(() => (initial && recipeById(initial) ? newSession('practice', [initial]) : null))

  return (
    <div className="space-y-6">
      <PageHeader title="바텐더 게임" subtitle="손님의 주문을 받아 작업대에서 직접 칵테일을 만들어 보세요. 실기 표준 레시피로 채점합니다." />
      {!session ? (
        <ModePicker
          onStart={(mode, id) => setSession(newSession(mode, mode === 'practice' ? [id!] : pickRandom(mode === 'exam' ? practicalMeta.examDrinks : 1)))}
        />
      ) : session.showResult ? (
        <ExamResult session={session} onAgain={() => setSession(newSession('exam', pickRandom(practicalMeta.examDrinks)))} onQuit={() => setSession(null)} />
      ) : (
        <Play session={session} setSession={setSession} />
      )}
    </div>
  )
}

function useClock(on: boolean) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!on) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [on])
  return now
}

function Play({ session, setSession }: { session: Session; setSession: Dispatch<SetStateAction<Session | null>> }) {
  const recordGame = useStore((s) => s.recordGame)
  const recipe = recipeById(session.queue[session.index])!
  const now = useClock(session.endsAt !== null)
  const left = session.endsAt === null ? null : Math.max(0, Math.ceil((session.endsAt - now) / 1000))
  const timeUp = left === 0
  const scored = session.scores.length > session.index
  const isLast = session.index === session.queue.length - 1

  const onServed = (sheet: ScoreSheet) => {
    // 손도 못 댄 채 시간이 끝난 잔은 레시피 게임 기록에 남기지 않는다 (시험 결과에만 0점)
    if (!(timeUp && sheet.total === 0)) recordGame(recipe.id, sheet.total)
    setSession((s) => s && { ...s, scores: [...s.scores.slice(0, s.index), sheet.total] })
  }

  const go = (patch: Partial<Session>) => setSession({ ...session, ...patch })
  const after =
    session.mode === 'exam' ? (
      timeUp || isLast ? (
        <Button onClick={() => go({ showResult: true })}>시험 결과 보기</Button>
      ) : (
        <Button onClick={() => go({ index: session.index + 1, customer: session.customer + 1 })}>
          다음 잔 ({session.index + 2}/{session.queue.length})
        </Button>
      )
    ) : (
      <>
        <Button onClick={() => go({ attempt: session.attempt + 1, scores: [] })}>같은 칵테일 다시 만들기</Button>
        {session.mode === 'real' && (
          <Button variant="secondary" onClick={() => setSession(newSession('real', pickRandom(1)))}>
            다음 손님 받기
          </Button>
        )}
        <Button variant="secondary" onClick={() => setSession(null)}>
          모드·칵테일 다시 고르기
        </Button>
      </>
    )

  const hud = (
    <>
      <Badge tone={session.mode === 'practice' ? 'mint' : session.mode === 'real' ? 'peach' : 'lavender'}>{MODE_LABEL[session.mode]} 모드</Badge>
      {session.mode === 'exam' && (
        <span>
          잔 {session.index + 1}/{session.queue.length}
        </span>
      )}
      {left !== null && (
        <span role="timer" aria-label="남은 시간" className={left <= 60 ? 'text-bar-neon' : 'text-bar-glow'}>
          ⏱ {String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}
        </span>
      )}
      {session.mode === 'real' && <span className="text-bar-glow">힌트 {session.hints}회</span>}
      <button
        type="button"
        className="ml-auto rounded-pixel border-2 border-transparent px-2 py-1 text-paper hover:border-paper"
        onClick={() => setSession(null)}
      >
        그만하기
      </button>
    </>
  )

  return (
    <Workbench
      key={`${session.index}-${session.attempt}-${session.queue[session.index]}`}
      recipe={recipe}
      mode={session.mode}
      customer={session.customer}
      hud={hud}
      hints={session.hints}
      onHint={() => setSession((s) => s && { ...s, hints: s.hints + 1 })}
      timeUp={timeUp && !scored}
      onServed={onServed}
      after={after}
    />
  )
}

function ModePicker({ onStart }: { onStart: (mode: Mode, recipeId?: string) => void }) {
  const game = useStore((s) => s.game)
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card tone="peach">
          <h2 className="font-pixel text-lg">실전 모드</h2>
          <p className="mt-1 text-sm text-ink-soft">무작위 손님 주문 한 잔. 레시피는 숨겨지고, 막히면 힌트를 볼 수 있습니다(사용 횟수 표시).</p>
          <Button className="mt-3" onClick={() => onStart('real')}>
            손님 받기
          </Button>
        </Card>
        <Card tone="lavender">
          <h2 className="font-pixel text-lg">시험 모드</h2>
          <p className="mt-1 text-sm text-ink-soft">
            실기 시험처럼 무작위 {practicalMeta.examDrinks}잔을 {practicalMeta.examMinutes}분 안에. 레시피·힌트 없음, 마지막에 종합 점수.
          </p>
          <Button className="mt-3" onClick={() => onStart('exam')}>
            시험 시작
          </Button>
        </Card>
      </div>
      <Card tone="mint">
        <h2 className="font-pixel text-lg">연습 모드</h2>
        <p className="mt-1 text-sm text-ink-soft">칵테일을 고르면 레시피 카드와 ‘다음에 할 일’ 안내를 보며 만들 수 있습니다.</p>
        <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
          {recipes.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onStart('practice', r.id)}
                className="flex h-full w-full flex-col items-center gap-1 rounded-pixel border-2 border-ink bg-paper p-1.5 text-center text-xs leading-tight text-ink shadow-pixel-sm hover:bg-butter active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <CocktailArt recipeId={r.id} size={60} />
                <span>{r.nameKo}</span>
                {game[r.id] && <span className="font-pixel text-[11px] text-ink-soft">최고 {game[r.id].bestScore}점</span>}
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function ExamResult({ session, onAgain, onQuit }: { session: Session; onAgain: () => void; onQuit: () => void }) {
  const avg = Math.round(session.queue.reduce((s, _, i) => s + (session.scores[i] ?? 0), 0) / session.queue.length)
  const pass = avg >= 60
  return (
    <Card>
      <h2 className="font-pixel text-xl">
        시험 결과 · 평균 {avg}점 <Badge tone={pass ? 'good' : 'bad'}>{pass ? '✓ 합격선(60점) 이상' : '✗ 합격선(60점) 미만'}</Badge>
      </h2>
      <ol className="mt-4 grid gap-3 sm:grid-cols-3">
        {session.queue.map((id, i) => {
          const r = recipeById(id)!
          const s = session.scores[i]
          return (
            <li key={id} className="flex flex-col items-center gap-1 rounded-pixel border-2 border-ink bg-bar-night p-3 text-center">
              <CocktailArt recipeId={id} size={110} />
              <p className="font-pixel text-paper">
                {i + 1}잔 · {r.nameKo}
              </p>
              <p className="font-pixel text-bar-glow">{s === undefined ? '시간 초과 · 0점' : `${s}점`}</p>
            </li>
          )
        })}
      </ol>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={onAgain}>다시 응시</Button>
        <Button variant="secondary" onClick={onQuit}>
          모드 고르기
        </Button>
      </div>
    </Card>
  )
}
