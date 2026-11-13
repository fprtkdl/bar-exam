import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { examMeta } from '../../../data/written'
import { useStore } from '../../../lib/store'
import type { ChoiceIndex } from '../../../types/written'
import { Button, Card, Icon, Modal, PageHeader, ProgressBar } from '../../../ui'
import type { ResolvedQuiz } from './build'
import { KeyHint, QuestionView, useQuizKeys } from './QuestionView'

type Saved = { startedAt: number; picks: (ChoiceIndex | null)[]; flags: boolean[] }

const keyOf = (refId: string) => `bar-exam:mock:${refId}`

const fresh = (n: number): Saved => ({ startedAt: Date.now(), picks: Array(n).fill(null), flags: Array(n).fill(false) })

/** 시험 시간이 이미 끝났는가 (정각이 되는 순간부터 만료) */
export const isExpired = (startedAt: number, now: number, minutes: number) => now >= startedAt + minutes * 60_000

/** 새로고침해도 이어 풀도록 sessionStorage 에서 복원. 저장된 세션이 없거나 문항 수가 바뀌었으면 null */
function load(refId: string, n: number): Saved | null {
  try {
    const s = JSON.parse(sessionStorage.getItem(keyOf(refId)) ?? 'null') as Saved | null
    if (s && typeof s.startedAt === 'number' && s.picks?.length === n && s.flags?.length === n) return s
  } catch {
    /* 손상된 값은 버리고 새로 시작 */
  }
  return null
}

const mmss = (ms: number) => {
  const s = Math.ceil(ms / 1000)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/** 모의고사: 타이머 + 번호판 + 나중에 볼 문제, 해설은 제출 후 */
export function MockExam({ refId, quiz }: { refId: string; quiz: ResolvedQuiz }) {
  const navigate = useNavigate()
  const recordAttempt = useStore((s) => s.recordAttempt)
  const n = quiz.questions.length
  // 진입 시점에 이미 만료된 세션은 자동 제출하지 않고 사용자에게 묻는다
  const [init] = useState(() => {
    const s = load(refId, n)
    return { saved: s ?? fresh(n), stale: !!s && isExpired(s.startedAt, Date.now(), examMeta.minutes) }
  })
  const [saved, setSaved] = useState(init.saved)
  const [stale, setStale] = useState(init.stale)
  const [staleKey, setStaleKey] = useState(0) // Esc·배경 클릭으로 닫혀도 선택 모달을 다시 띄운다
  const [quit, setQuit] = useState(false)
  const [idx, setIdx] = useState(0)
  const [now, setNow] = useState(Date.now)
  const [confirm, setConfirm] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const done = useRef(false)

  const left = Math.max(0, saved.startedAt + examMeta.minutes * 60_000 - now)
  const answered = saved.picks.filter((p) => p !== null).length
  const flagged = saved.flags.filter(Boolean).length

  useEffect(() => {
    try {
      sessionStorage.setItem(keyOf(refId), JSON.stringify(saved))
    } catch {
      /* 저장 불가(사파리 개인 모드 등)여도 시험은 계속 */
    }
  }, [refId, saved])

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const submit = useCallback(() => {
    if (done.current) return
    done.current = true
    sessionStorage.removeItem(keyOf(refId))
    const attempt = recordAttempt({
      kind: 'mock',
      refId,
      title: quiz.title,
      startedAt: saved.startedAt,
      answers: quiz.questions.map((q, i) => ({ qid: q.id, picked: saved.picks[i], correct: saved.picks[i] === q.answer })),
    })
    navigate(`/written/result/${attempt.id}`, { replace: true })
  }, [navigate, quiz, recordAttempt, refId, saved])

  useEffect(() => {
    if (left === 0 && !stale) submit()
  }, [left, stale, submit])

  const discard = () => {
    sessionStorage.removeItem(keyOf(refId))
    setSaved(fresh(n))
    setIdx(0)
    setNow(Date.now())
    setStale(false)
  }
  const quitExam = () => {
    done.current = true
    sessionStorage.removeItem(keyOf(refId))
    navigate('/written/mock', { replace: true })
  }

  const update = (patch: (s: Saved) => Partial<Saved>) => setSaved((s) => ({ ...s, ...patch(s) }))
  const pick = (c: ChoiceIndex) => update((s) => ({ picks: s.picks.map((p, i) => (i === idx ? c : p)) }))
  const toggleFlag = () => update((s) => ({ flags: s.flags.map((f, i) => (i === idx ? !f : f)) }))
  const go = (i: number) => {
    setIdx(i)
    setPaletteOpen(false)
  }
  const urgent = left < 5 * 60_000
  useQuizKeys({
    pick,
    next: () => (idx < n - 1 ? go(idx + 1) : setConfirm(true)),
    prev: () => idx > 0 && go(idx - 1),
  })

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start lg:gap-6">
      {/* 시험 상태판: 모바일은 상단 고정 + 번호판 접기, 넓은 화면은 오른쪽 */}
      <aside
        aria-label="시험 상태"
        className="sticky top-0 z-10 -mx-4 border-b-2 border-ink bg-paper px-4 py-3 lg:col-start-2 lg:row-start-1 lg:top-4 lg:mx-0 lg:rounded-pixel lg:border-2 lg:p-4 lg:shadow-pixel"
      >
        <div className="flex items-center justify-between gap-3">
          <div className={`rounded-pixel border-2 border-ink px-2 py-1 ${urgent ? 'bg-bad-soft' : 'bg-butter'}`}>
            <p className={`flex items-center gap-1 text-xs ${urgent ? 'font-semibold text-bad' : 'text-ink-soft'}`}>
              <Icon name="clock" size={12} />
              {urgent ? '5분 안 남음' : '남은 시간'}
            </p>
            <p className={`font-pixel text-2xl tabular-nums ${urgent ? 'text-bad' : ''}`} role="timer" aria-label={`남은 시간 ${mmss(left)}`}>
              {mmss(left)}
            </p>
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-1 font-pixel text-sm tabular-nums">
              응답 {answered}/{n}
            </p>
            <ProgressBar value={answered} max={n} label="응답한 문항" tone="sky" />
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="lg:hidden"
            aria-expanded={paletteOpen}
            aria-controls="mock-palette"
            onClick={() => setPaletteOpen((o) => !o)}
          >
            번호판
            <Icon name="chevron-down" className={`transition-transform ${paletteOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <div id="mock-palette" className={`${paletteOpen ? 'block' : 'hidden'} mt-3 lg:block`}>
          <ol className="grid grid-cols-8 gap-1.5 lg:grid-cols-6">
            {quiz.questions.map((q, i) => {
              const a = saved.picks[i] !== null
              const f = saved.flags[i]
              return (
                <li key={q.id}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={i === idx ? 'step' : undefined}
                    aria-label={`${i + 1}번, ${a ? '응답함' : '미응답'}${f ? ', 나중에 볼 문제' : ''}`}
                    className={`relative h-9 w-full rounded-[3px] border-2 font-pixel text-xs tabular-nums hover:border-ink focus-visible:outline-3 focus-visible:outline-offset-1 focus-visible:outline-ink active:translate-y-px ${
                      a ? 'bg-sky' : 'bg-paper hover:bg-butter'
                    } ${i === idx ? 'border-ink outline-2 outline-offset-1 outline-ink' : 'border-ink-faint'}`}
                  >
                    {i + 1}
                    {f && (
                      <span aria-hidden className="absolute -top-2 -right-1.5 rounded-[2px] bg-paper text-bad">
                        <Icon name="flag" size={12} />
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ol>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
            <span>
              <span aria-hidden className="mr-1 inline-block h-3 w-3 border-2 border-ink-faint bg-sky align-middle" />
              응답
            </span>
            <span>
              <span aria-hidden className="mr-1 inline-block h-3 w-3 border-2 border-ink-faint bg-paper align-middle" />
              미응답
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="flag" size={12} className="text-bad" />
              나중에 볼 문제 {flagged}
            </span>
          </p>
          <Button className="mt-3 w-full" onClick={() => setConfirm(true)}>
            답안 제출
          </Button>
          <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => setQuit(true)}>
            그만두기
          </Button>
        </div>
      </aside>

      <section aria-label={quiz.title} className="min-w-0 pb-20 sm:pb-0 lg:col-start-1 lg:row-start-1">
        <PageHeader title={quiz.title} subtitle={`${n}문항 · ${examMeta.minutes}분 · ${examMeta.passScore}점 이상 합격`} />
        <Card>
          <QuestionView key={quiz.questions[idx].id} q={quiz.questions[idx]} no={idx + 1} picked={saved.picks[idx]} reveal={false} onPick={pick} />
        </Card>
        <div className="mt-3 flex justify-end">
          <KeyHint prev />
        </div>
        {/* 모바일: 하단 탭 바 바로 위에 고정 */}
        <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-10 grid grid-cols-[auto_1fr_auto] items-center gap-2 border-t-2 border-ink bg-paper px-4 py-2 sm:static sm:mt-3 sm:border-0 sm:bg-transparent sm:p-0">
          <Button variant="secondary" disabled={idx === 0} onClick={() => go(idx - 1)}>
            <Icon name="chevron-left" />
            이전
          </Button>
          <Button variant="ghost" className="justify-self-center" aria-pressed={saved.flags[idx]} onClick={toggleFlag}>
            <Icon name="flag" className={saved.flags[idx] ? 'text-bad' : ''} />
            <span className="sm:hidden">{saved.flags[idx] ? '표시됨' : '나중에'}</span>
            <span className="hidden sm:inline">{saved.flags[idx] ? '나중에 볼 문제 해제' : '나중에 볼 문제'}</span>
          </Button>
          {idx < n - 1 ? (
            <Button variant="secondary" onClick={() => go(idx + 1)}>
              다음
              <Icon name="chevron-right" />
            </Button>
          ) : (
            <Button onClick={() => setConfirm(true)}>답안 제출</Button>
          )}
        </div>
      </section>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="답안을 제출할까요?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(false)}>
              계속 풀기
            </Button>
            <Button onClick={submit}>제출하기</Button>
          </>
        }
      >
        <p>
          {n}문항 중 {answered}문항에 답했습니다.
          {n - answered > 0 && ` 미응답 ${n - answered}문항은 오답 처리됩니다.`}
        </p>
        {flagged > 0 && (
          <p className="mt-2 flex items-center gap-2">
            <Icon name="flag" className="text-bad" />
            나중에 볼 문제로 표시한 문항이 {flagged}개 있습니다.
          </p>
        )}
        <p className="mt-2 text-sm text-ink-soft">제출하면 수정할 수 없고, 해설은 결과 화면에서 볼 수 있습니다.</p>
      </Modal>

      <Modal
        open={quit}
        onClose={() => setQuit(false)}
        title="시험을 그만둘까요?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setQuit(false)}>
              계속 풀기
            </Button>
            <Button onClick={quitExam}>그만두기</Button>
          </>
        }
      >
        <p>지금까지의 답안은 저장되지 않고 기록에도 남지 않습니다.</p>
      </Modal>

      <Modal
        key={staleKey}
        open={stale}
        onClose={() => stale && setStaleKey((k) => k + 1)}
        title="시험 시간이 종료됨"
        footer={
          <>
            <Button variant="secondary" onClick={discard}>
              기록 없이 버리고 새로 시작
            </Button>
            <Button onClick={submit}>그대로 제출</Button>
          </>
        }
      >
        <p>
          시험 시간이 이미 끝났습니다. (응답 {answered}/{n})
        </p>
        <p className="mt-2 text-sm text-ink-soft">제출하면 풀지 않은 문항은 오답으로 기록됩니다.</p>
      </Modal>
    </div>
  )
}
