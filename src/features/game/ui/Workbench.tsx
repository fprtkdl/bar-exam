import { useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import { BarScene, CustomerArt, GlassArt, ToolArt } from '../../../art'
import { ingredientById } from '../../../data/practical'
import type { Recipe, ToolId } from '../../../types/practical'
import { Button } from '../../../ui'
import { ICE_LABEL, initialState, judge, solve, step, VESSEL_LABEL, type Action, type GameState, type ScoreSheet, type Vessel } from '../engine'
import { describe, glassFill, nextHint, pourText } from './helpers'
import { RecipeCard, ScoreView } from './ScoreView'
import { Tray } from './Tray'
import './game.css'

export type Mode = 'practice' | 'real' | 'exam'

type Ui = {
  game: GameState
  error: string | null
  last: Action | null
  n: number
}
function reducer(s: Ui, a: Action): Ui {
  const r = step(s.game, a)
  return r.ok ? { game: r.state, error: null, last: a, n: s.n + 1 } : { ...s, error: r.reason, n: s.n + 1 }
}

const VESSELS: {
  id: Vessel
  tool: ToolId
  verb: string
  done: string
  action: Action
  anim: string
}[] = [
  {
    id: 'shaker',
    tool: 'cobbler-shaker',
    verb: '흔들기',
    done: '흔들기 완료',
    action: { type: 'shake' },
    anim: 'anim-shake',
  },
  {
    id: 'mixingGlass',
    tool: 'mixing-glass',
    verb: '젓기',
    done: '젓기 완료',
    action: { type: 'stir', target: 'mixingGlass' },
    anim: 'anim-stir',
  },
  {
    id: 'blender',
    tool: 'blender',
    verb: '갈기',
    done: '갈기 완료',
    action: { type: 'blend' },
    anim: 'anim-shake',
  },
]

const CHILL_MS = 2500
const SERVE_CLASS =
  'ml-auto inline-flex min-h-9 items-center rounded-pixel border-2 border-ink bg-bar-glow px-3 font-pixel text-sm text-ink shadow-pixel-sm hover:bg-butter active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
/** 데스크톱이면 레시피 카드를 펼치고 손님을 크게 */
const isWide = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches

type Props = {
  recipe: Recipe
  mode: Mode
  customer: number
  /** 화면 맨 위 HUD (모드·타이머·잔 번호) */
  hud: ReactNode
  /** 실전 모드 힌트를 열 때마다 호출 (횟수 표시용) */
  onHint?: () => void
  hints?: number
  /** 시험 시간 종료: 서빙 전이면 현재 상태로 채점 */
  timeUp?: boolean
  onServed: (sheet: ScoreSheet) => void
  /** 채점표 아래 버튼들 */
  after: ReactNode
}

export function Workbench({ recipe, mode, customer, hud, onHint, hints = 0, timeUp, onServed, after }: Props) {
  const [ui, dispatch] = useReducer(reducer, undefined, () => ({
    game: initialState(),
    error: null,
    last: null,
    n: 0,
  }))
  const { game } = ui
  const g = game.glass
  const [sheet, setSheet] = useState<ScoreSheet | null>(null)
  const [busy, setBusy] = useState<Vessel | null>(null)
  const [out, setOut] = useState<Vessel[]>([])
  const [showHint, setShowHint] = useState(false)
  const solution = useMemo(() => solve(recipe), [recipe])
  const [wide] = useState(isWide)

  // 서빙 또는 시간 종료 → 한 번만 채점
  const scored = useRef(false)
  useEffect(() => {
    if (scored.current || !(game.served || timeUp)) return
    scored.current = true
    const s = judge(game, recipe)
    setSheet(s)
    onServed(s)
  }, [game, timeUp, recipe, onServed])

  // 칠링 게이지: 얼음을 넣은 순간부터 2.5초
  const [chillAt, setChillAt] = useState<number | null>(null)
  const [now, setNow] = useState(0)
  useEffect(() => {
    if (g.chill !== 'icing') return setChillAt(null)
    const t0 = Date.now()
    setChillAt(t0)
    setNow(t0)
    const id = setInterval(() => setNow(Date.now()), 100)
    return () => clearInterval(id)
  }, [g.chill])
  const chill = chillAt ? Math.min(1, (now - chillAt) / CHILL_MS) : 0

  const fill = glassFill(game)
  const next = nextHint(game.log, solution)
  const hint = next && describe(next)
  const last = ui.last
  const streamColor =
    last?.type === 'pour' && last.target === 'glass'
      ? ingredientById(last.ingredientId)?.color
      : last?.type === 'strain'
        ? fill.layers.at(-1)?.color
        : undefined
  const mood = sheet ? (sheet.total >= 80 ? 'happy' : sheet.total >= 60 ? 'neutral' : 'sad') : 'neutral'
  const shown = VESSELS.filter((v) => out.includes(v.id) || game[v.id].ice || game[v.id].contents.length)

  return (
    <section aria-label="바 작업대" className="overflow-hidden rounded-pixel border-2 border-ink bg-bar-night shadow-pixel">
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-ink bg-bar-wall px-3 py-2 font-pixel text-sm text-paper">{hud}</div>

      <BarScene>
        <div className="flex max-w-40 flex-col items-start gap-3 sm:max-w-48">
          <p
            className="anim-pop relative rounded-pixel border-2 border-ink bg-paper px-3 py-2 text-sm text-ink shadow-pixel-sm"
            key={sheet ? 'reply' : 'order'}
          >
            {sheet ? REPLY[mood] : <Order recipe={recipe} />}
            <span aria-hidden="true" className="absolute -bottom-[7px] left-8 size-3 rotate-45 border-r-2 border-b-2 border-ink bg-paper" />
          </p>
          <CustomerArt variant={customer % 6} mood={mood} size={wide ? 120 : 84} />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            {streamColor && (
              <span
                key={ui.n}
                aria-hidden="true"
                className="anim-stream absolute -top-12 left-1/2 h-24 w-1.5 -translate-x-1/2 rounded-full"
                style={{ background: streamColor }}
              />
            )}
            {last?.type === 'dumpChill' && (
              <span key={`d${ui.n}`} aria-hidden="true" className="anim-drop absolute -right-6 bottom-6 font-pixel text-lg text-sky">
                💧💧
              </span>
            )}
            {g.glassId ? (
              <div key={last?.type === 'dumpChill' ? `dump${ui.n}` : 'glass'} className={`bench-glass ${last?.type === 'dumpChill' ? 'anim-dump' : ''}`}>
                <GlassArt
                  glassId={g.glassId}
                  fill={fill}
                  ice={g.ice ?? (g.chill === 'icing' ? 'cube' : null)}
                  garnishIds={g.garnishIds}
                  rim={g.rim}
                  frosted={g.chill === 'chilled' || chill >= 1}
                  size={wide ? 220 : 170}
                />
              </div>
            ) : (
              <div className="flex h-[170px] w-28 items-center justify-center rounded-pixel border-2 border-dashed border-bar-glow px-2 text-center font-pixel text-sm text-bar-glow">
                아래 [잔] 에서 잔을 고르세요
              </div>
            )}
          </div>
          {!sheet && g.glassId && (
            <div className="flex min-h-9 items-center gap-2">
              {g.chill === 'icing' ? (
                <>
                  <span
                    className="h-2.5 w-20 overflow-hidden rounded-full border-2 border-ink bg-bar-wall"
                    role="progressbar"
                    aria-label="칠링"
                    aria-valuenow={Math.round(chill * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span className="block h-full bg-sky" style={{ width: `${chill * 100}%` }} />
                  </span>
                  <Button size="sm" variant="secondary" onClick={() => dispatch({ type: 'dumpChill' })}>
                    얼음·물 버리기
                  </Button>
                </>
              ) : (
                g.chill === 'none' &&
                !g.layers.length &&
                !g.ice && (
                  <Button size="sm" variant="secondary" onClick={() => dispatch({ type: 'chillGlass' })}>
                    ❄ 칠링하기
                  </Button>
                )
              )}
              {g.chill === 'chilled' && <span className="font-pixel text-xs text-sky">❄ 칠링 완료</span>}
            </div>
          )}
        </div>

        {shown.length > 0 && (
          <div className="flex flex-wrap items-end justify-center gap-3">
            {shown.map((v) => {
              const c = game[v.id]
              return (
                <div key={v.id} data-vessel={v.id} className="flex w-36 flex-col items-center gap-1.5 rounded-pixel border-2 border-ink bg-bar-wall/80 p-2">
                  <div className={busy === v.id ? v.anim : ''}>
                    <ToolArt toolId={v.tool} size={64} />
                  </div>
                  <p className="font-pixel text-xs text-bar-glow">{VESSEL_LABEL[v.id]}</p>
                  <ul aria-label={`${VESSEL_LABEL[v.id]} 내용물`} className="flex flex-wrap justify-center gap-1">
                    {c.ice && <Chip>🧊 {ICE_LABEL[c.ice]}</Chip>}
                    {c.contents.map((p, i) => (
                      <Chip key={i} color={ingredientById(p.ingredientId)?.color}>
                        {pourText(p)}
                      </Chip>
                    ))}
                    {!c.ice && !c.contents.length && <Chip>비어 있음</Chip>}
                    {c.done && <Chip>✓ {v.done}</Chip>}
                  </ul>
                  {!sheet && (
                    <div className="flex flex-col gap-1 self-stretch">
                      <HoldButton label={v.verb} onActive={(on) => setBusy(on ? v.id : null)} onDone={() => dispatch(v.action)} />
                      <Button size="sm" variant="secondary" onClick={() => dispatch({ type: 'strain', from: v.id })}>
                        잔에 따르기
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </BarScene>

      <div className="grid gap-3 border-t-2 border-ink bg-bar-night px-3 py-3 md:grid-cols-[1fr_minmax(0,22rem)]">
        <div className="space-y-2">
          <p role="status" aria-live="polite" key={ui.n} className={`anim-pop min-h-6 text-sm ${ui.error ? 'font-bold text-bar-neon' : 'text-paper'}`}>
            {ui.error ? `⚠ ${ui.error}` : last ? `▸ ${describe(last)}` : '▸ 손님의 주문을 들었습니다. 잔부터 골라 볼까요?'}
          </p>
          {!sheet && mode !== 'exam' && hint && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-bar-glow">
              {mode === 'practice' || showHint ? (
                <p>
                  <span className="font-pixel">다음에 할 일 ·</span> {hint}
                </p>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setShowHint(true)
                    onHint?.()
                  }}
                >
                  힌트 보기 (사용 {hints}회)
                </Button>
              )}
            </div>
          )}
          {!sheet && (
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={() => dispatch({ type: 'reset' })}>
                처음부터
              </Button>
              <button type="button" className={SERVE_CLASS} onClick={() => dispatch({ type: 'serve' })}>
                🍸 손님에게 내기
              </button>
            </div>
          )}
        </div>
        {mode === 'practice' && !sheet && (
          <details open={wide} className="md:row-span-1">
            <summary className="cursor-pointer font-pixel text-sm text-bar-glow">레시피 카드</summary>
            <div className="mt-2">
              <RecipeCard recipe={recipe} dark />
            </div>
          </details>
        )}
      </div>

      <div className="border-t-2 border-ink bg-paper">
        {sheet ? (
          <ScoreView recipe={recipe} sheet={sheet} game={game} after={after} />
        ) : (
          <Tray
            game={game}
            dispatch={(a) => {
              setShowHint(false)
              if ((a.type === 'pour' || a.type === 'addIce') && a.target !== 'glass')
                setOut((o) => (o.includes(a.target as Vessel) ? o : [...o, a.target as Vessel]))
              dispatch(a)
            }}
            out={out}
            toggleOut={(v) => setOut((o) => (o.includes(v) ? o.filter((x) => x !== v) : [...o, v]))}
          />
        )}
      </div>
    </section>
  )
}

const REPLY = {
  happy: '완벽해요! 딱 제가 원하던 맛이에요.',
  neutral: '음… 마실 만하네요.',
  sad: '이건 제가 주문한 게 아닌 것 같은데요…',
}

function Order({ recipe }: { recipe: Recipe }) {
  return (
    <>
      <span className="font-pixel">{recipe.nameKo}</span> 한 잔 주세요.
      <span className="block text-xs text-ink-soft">{recipe.nameEn}</span>
    </>
  )
}

function Chip({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <li className="inline-flex items-center gap-1 rounded-[3px] border border-ink bg-paper px-1.5 py-0.5 text-[11px] leading-tight text-ink">
      {color && <span aria-hidden="true" className="inline-block size-2 rounded-full border border-ink" style={{ background: color }} />}
      {children}
    </li>
  )
}

/** 길게 누르거나 연타해서 게이지를 채우면 onDone (키보드: Enter/Space 연타) */
function HoldButton({ label, onDone, onActive }: { label: string; onDone: () => void; onActive: (on: boolean) => void }) {
  const [p, setP] = useState(0)
  const pRef = useRef(0)
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const stop = () => {
    clearInterval(timer.current)
    timer.current = undefined
  }
  const add = (d: number) => {
    pRef.current = Math.min(1, pRef.current + d)
    if (pRef.current >= 1) {
      stop()
      pRef.current = 0
      onActive(false)
      onDone()
    }
    setP(pRef.current)
  }
  useEffect(() => stop, [])
  return (
    <button
      type="button"
      className="relative min-h-9 overflow-hidden rounded-pixel border-2 border-ink bg-butter font-pixel text-sm text-ink shadow-pixel-sm select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
      onPointerDown={() => {
        onActive(true)
        if (!timer.current) timer.current = setInterval(() => add(0.04), 50)
      }}
      onPointerUp={() => {
        stop()
        onActive(false)
      }}
      onPointerLeave={() => {
        stop()
        onActive(false)
      }}
      onClick={() => add(0.34)}
      aria-label={`${label} (길게 누르거나 3번 누르기)`}
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 bg-peach" style={{ width: `${p * 100}%` }} />
      <span className="relative">{label}</span>
    </button>
  )
}
