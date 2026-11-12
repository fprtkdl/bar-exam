import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { questionById, units } from '../../../data/written'
import { useStore } from '../../../lib/store'
import { QUESTION_TYPE_LABEL, type QuestionType } from '../../../types/written'
import { Badge, Button, Card, EmptyState, PageHeader, StatTile, Tabs } from '../../../ui'
import { QuestionView, Rich } from '../quiz/QuestionView'

type Tab = 'active' | 'cleared'
type Sort = 'count' | 'recent'

const SELECT = 'min-h-9 rounded-pixel border-2 border-ink bg-paper px-2 text-sm'
const fmt = (t: number) => new Date(t).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })

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

      <div className="mb-8 grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <Card tone="lavender">
          <h2 className="font-pixel text-lg">{retry ? `현재 ${retry.round}회차 · 남은 ${retry.queue.length}문항` : '틀린 문제만 다시 풀기'}</h2>
          <p className="mt-1 text-sm">
            {retry
              ? '회차마다 또 틀린 문제만 남아요. 모두 맞히면 올클리어!'
              : activeN
                ? `복습 중인 ${activeN}문항으로 1회차를 시작합니다.`
                : '복습할 오답이 없어요. 문제를 풀다 틀리면 여기에 쌓입니다.'}
          </p>
          {retry && retry.rounds.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-2">
              {retry.rounds.map((r) => (
                <li key={r.round}>
                  <Badge tone="paper">
                    {r.round}회차 {r.correct}/{r.total}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3">
            <Button onClick={start} disabled={remain === 0}>
              {retry ? `${retry.round}회차 이어서 풀기` : '틀린 문제만 다시 풀기'}
            </Button>
          </div>
        </Card>
        <div className="grid grid-cols-2 content-start gap-3">
          <StatTile label="복습 중" value={activeN} tone="peach" />
          <StatTile label="극복함" value={clearedN} tone="mint" />
        </div>
      </div>

      {history.length > 0 && (
        <section aria-label="지난 다시 풀기 기록" className="mb-8">
          <h2 className="mb-2 font-pixel text-lg">지난 올클리어 기록</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[...history].reverse().map((h) => (
              <li key={h.clearedAt} className="rounded-pixel border-2 border-ink bg-mint p-3">
                <span className="font-pixel text-good">✓ {h.rounds}회차 만에 올클리어</span>
                <span className="block text-sm">
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
      <div className="my-4 flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2">
          단원
          <select className={SELECT} value={unitId} onChange={(e) => setUnitId(e.target.value)}>
            <option value="">전체</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.title}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          유형
          <select className={SELECT} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">전체</option>
            {Object.entries(QUESTION_TYPE_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          정렬
          <select className={SELECT} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="count">많이 틀린 순</option>
            <option value="recent">최근 순</option>
          </select>
        </label>
      </div>

      <div id={`tabpanel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {rows.length === 0 ? (
          <EmptyState
            title={tab === 'active' ? (all.length ? '복습할 문제가 없어요' : '아직 틀린 문제가 없어요') : '극복한 문제가 아직 없어요'}
            description={all.length ? '필터를 바꾸거나, 다시 풀기로 오답을 극복해 보세요.' : '문제를 풀다 틀리면 자동으로 여기에 모입니다.'}
            action={<Button to="/written/tests">단원평가 풀기</Button>}
          />
        ) : (
          <ul className="grid gap-3">
            {rows.map(({ w, q }) => {
              const unit = units.find((u) => u.id === q.unitId)
              const isOpen = open === q.id
              return (
                <li key={q.id}>
                  <Card>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge tone="peach">✗ {w.wrongCount}번 틀림</Badge>
                      <Badge tone="lavender">{QUESTION_TYPE_LABEL[q.type as QuestionType]}</Badge>
                      <span className="text-sm text-ink-soft">{unit?.title} · {fmt(w.lastWrongAt)}</span>
                    </div>
                    {isOpen ? (
                      <QuestionView q={q} no={1} picked={w.lastPicked} reveal />
                    ) : (
                      <p className="leading-relaxed font-semibold">
                        <Rich text={q.stem} />
                      </p>
                    )}
                    <div className="mt-3">
                      <Button variant="secondary" size="sm" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : q.id)}>
                        {isOpen ? '접기' : '정답·해설 보기'}
                      </Button>
                    </div>
                  </Card>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
