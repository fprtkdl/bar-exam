import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { questionById, units } from '../../../data/written'
import { useStore } from '../../../lib/store'
import { QUESTION_TYPE_LABEL, type QuestionType } from '../../../types/written'
import { Badge, Button, Card, ChipGroup, EmptyState, Icon, PageHeader, Select, StatTile, Tabs } from '../../../ui'
import { QuestionRow } from '../quiz/QuestionRow'
import { QuestionView } from '../quiz/QuestionView'

type Tab = 'active' | 'cleared'
type Sort = 'count' | 'recent'

const UNIT_OPTS = [{ value: '', label: '전체 단원' }, ...units.map((u) => ({ value: u.id, label: `${u.order}. ${u.title}` }))]
const TYPE_OPTS = [{ value: '', label: '전체 유형' }, ...Object.entries(QUESTION_TYPE_LABEL).map(([value, label]) => ({ value, label }))]
const SORT_OPTS: { value: Sort; label: string }[] = [
  { value: 'count', label: '많이 틀린 순' },
  { value: 'recent', label: '최근 순' },
]
const fmt = (t: number) => new Date(t).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
const fmtShort = (t: number) => {
  const d = new Date(t)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function WrongNotePage() {
  const navigate = useNavigate()
  const wrong = useStore((s) => s.wrong)
  const stored = useStore((s) => s.retry)
  const history = useStore((s) => s.retryHistory)
  const startRetry = useStore((s) => s.startRetry)
  const [tab, setTab] = useState<Tab>('active')
  const [unitId, setUnitId] = useState('')
  const [type, setType] = useState('')
  const [sort, setSort] = useState<Sort>('count')
  const [open, setOpen] = useState<string | null>(null)

  // 데이터에서 사라진 문항은 건너뜀
  const all = Object.values(wrong).flatMap((w) => (questionById[w.qid] ? [{ w, q: questionById[w.qid] }] : []))
  const activeN = all.filter((x) => !x.w.cleared).length
  const clearedN = all.length - activeN
  const rows = all
    .filter((x) => (tab === 'active' ? !x.w.cleared : x.w.cleared))
    .filter((x) => (!unitId || x.q.unitId === unitId) && (!type || x.q.type === type))
    .sort((a, b) => (sort === 'count' ? b.w.wrongCount - a.w.wrongCount || b.w.lastWrongAt - a.w.lastWrongAt : b.w.lastWrongAt - a.w.lastWrongAt))

  // 데이터에서 문항이 사라져 풀 것이 없는 사이클은 없는 것으로 본다 (startRetry 가 새로 만든다)
  const retry = stored?.queue.some((id) => questionById[id]) ? { ...stored, queue: stored.queue.filter((id) => questionById[id]) } : null
  const remain = retry ? retry.queue.length : activeN
  const start = () => {
    const c = startRetry((id) => !!questionById[id])
    if (c) navigate(`/written/quiz/retry/r${c.round}`)
  }

  return (
    <>
      <PageHeader title="오답노트" subtitle="틀린 문제만 모아 두었어요. 다시 풀어서 맞히면 '극복함'으로 넘어갑니다." back={{ to: '/written', label: '필기' }} />

      <div className="mb-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem]">
        <Card tone="lavender">
          <h2 className="font-pixel text-xl">{retry ? `현재 ${retry.round}회차 · 남은 ${retry.queue.length}문항` : '틀린 문제만 다시 풀기'}</h2>
          <p className="mt-2 text-sm leading-relaxed">
            {retry
              ? '회차마다 또 틀린 문제만 남아요. 모두 맞히면 올클리어!'
              : activeN
                ? `복습 중인 ${activeN}문항으로 1회차를 시작합니다.`
                : '복습할 오답이 없어요. 문제를 풀다 틀리면 여기에 쌓입니다.'}
          </p>
          {retry && retry.rounds.length > 0 && (
            <ul aria-label="지난 회차" className="mt-3 flex flex-wrap gap-2">
              {retry.rounds.map((r) => (
                <li key={r.round} className="flex">
                  <Badge tone="paper">
                    {r.round}회차 {r.correct}/{r.total}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4">
            <Button onClick={start} disabled={remain === 0} className="w-full sm:w-auto">
              <Icon name={retry ? 'play' : 'refresh'} />
              {retry ? `${retry.round}회차 이어서 풀기` : '틀린 문제만 다시 풀기'}
            </Button>
          </div>
        </Card>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
          <StatTile label="복습 중" value={activeN} tone="peach" />
          <StatTile label="극복함" value={clearedN} tone="mint" />
        </div>
      </div>

      {history.length > 0 && (
        <section aria-label="지난 다시 풀기 기록" className="mb-8">
          <h2 className="mb-3 font-pixel text-lg">지난 올클리어 기록</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[...history].reverse().map((h) => (
              <li key={h.clearedAt} className="rounded-pixel border-2 border-ink bg-mint px-4 py-3 shadow-pixel-sm">
                <span className="flex items-center gap-2 font-pixel text-good">
                  <Icon name="check" />
                  {h.rounds}회차 만에 올클리어
                </span>
                <span className="mt-1 block text-sm">
                  {h.total}문항 · {fmt(h.clearedAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Tabs
        label="오답 상태"
        value={tab}
        onChange={(t) => {
          setTab(t)
          setOpen(null)
        }}
        items={[
          { id: 'active', label: `복습 중 ${activeN}` },
          { id: 'cleared', label: `극복함 ${clearedN}` },
        ]}
      />
      <div className="my-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        <Select label="단원" hideLabel value={unitId} onChange={setUnitId} options={UNIT_OPTS} className="min-w-0 sm:w-56" />
        <Select label="유형" hideLabel value={type} onChange={setType} options={TYPE_OPTS} className="min-w-0 sm:w-40" />
        <ChipGroup label="정렬" hideLabel value={sort} onChange={setSort} options={SORT_OPTS} className="col-span-2 sm:ml-auto" />
      </div>

      <div id={`tabpanel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {rows.length === 0 ? (
          <EmptyState
            title={tab === 'active' ? (all.length ? '복습할 문제가 없어요' : '아직 틀린 문제가 없어요') : '극복한 문제가 아직 없어요'}
            description={all.length ? '필터를 바꾸거나, 다시 풀기로 오답을 극복해 보세요.' : '문제를 풀다 틀리면 자동으로 여기에 모입니다.'}
            action={<Button to="/written/tests">단원평가 풀기</Button>}
          />
        ) : (
          <>
            <p className="mb-2 text-sm text-ink-soft">{rows.length}문항 · 행을 누르면 보기와 해설이 펼쳐져요</p>
            <ul className="overflow-hidden rounded-pixel border-2 border-ink bg-paper shadow-pixel">
              {rows.map(({ w, q }) => {
                const unit = units.find((u) => u.id === q.unitId)
                const isOpen = open === q.id
                return (
                  <QuestionRow
                    key={q.id}
                    id={q.id}
                    stem={q.stem}
                    open={isOpen}
                    onToggle={() => setOpen(isOpen ? null : q.id)}
                    lead={
                      <span className={`flex h-14 flex-col items-center justify-center rounded-pixel border-2 border-ink ${w.cleared ? 'bg-mint' : 'bg-peach'}`}>
                        <span className="font-pixel text-xl leading-none tabular-nums">{w.wrongCount}</span>
                        <span className="mt-1 text-[11px] leading-none">번 틀림</span>
                      </span>
                    }
                    top={
                      <>
                        <Badge tone="lavender">{QUESTION_TYPE_LABEL[q.type as QuestionType]}</Badge>
                        <span className="ml-auto truncate text-xs text-ink-soft">
                          {unit?.title} · {fmtShort(w.lastWrongAt)}
                        </span>
                      </>
                    }
                  >
                    <QuestionView q={q} no={1} picked={w.lastPicked} reveal bare />
                  </QuestionRow>
                )
              })}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
