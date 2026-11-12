import { useState, type ReactNode } from 'react'
import { BottleArt, GarnishArt, GlassArt, IceArt, ToolArt } from '../../../art'
import { garnishes, glasses, ingredientById, ingredients } from '../../../data/practical'
import type { IceType, IngredientCategory, PourUnit } from '../../../types/practical'
import { Button, Tabs } from '../../../ui'
import { amountOptions, formatAmount, ICE_LABEL, type Action, type GameState, type Target, type Vessel } from '../engine'
import { targetLabel } from './helpers'

type TabId = 'glass' | 'ice' | 'tools' | 'bottles' | 'garnish'
const TABS: { id: TabId; label: string }[] = [
  { id: 'glass', label: '잔' },
  { id: 'ice', label: '얼음' },
  { id: 'tools', label: '도구' },
  { id: 'bottles', label: '술·재료' },
  { id: 'garnish', label: '가니쉬' },
]

const CATS: { id: string; label: string; has: IngredientCategory[] }[] = [
  { id: 'spirit', label: '증류주', has: ['spirit'] },
  { id: 'liqueur', label: '리큐어', has: ['liqueur'] },
  { id: 'wine', label: '와인', has: ['wine'] },
  { id: 'traditional', label: '전통주', has: ['traditional'] },
  { id: 'juice', label: '주스', has: ['juice'] },
  { id: 'syrup', label: '시럽', has: ['syrup'] },
  { id: 'mixer', label: '탄산', has: ['mixer'] },
  { id: 'etc', label: '기타', has: ['dairy', 'bitters', 'other'] },
]

const TARGETS: Target[] = ['glass', 'shaker', 'mixingGlass', 'blender']
const UNITS: { id: PourUnit; label: string }[] = [
  { id: 'oz', label: 'oz' },
  { id: 'tsp', label: 'tsp' },
  { id: 'dash', label: 'dash' },
  { id: 'ea', label: '개' },
  { id: 'part', label: 'part' },
  { id: 'fill', label: '가득' },
]
const VESSEL_TOOLS: {
  id: Vessel
  tool: 'cobbler-shaker' | 'mixing-glass' | 'blender'
}[] = [
  { id: 'shaker', tool: 'cobbler-shaker' },
  { id: 'mixingGlass', tool: 'mixing-glass' },
  { id: 'blender', tool: 'blender' },
]

const tile = (on: boolean) =>
  `flex flex-col items-center justify-end gap-1 rounded-pixel border-2 p-1.5 text-center text-xs leading-tight text-ink transition-transform hover:-translate-y-0.5 ${
    on ? 'border-ink bg-butter shadow-pixel-sm' : 'border-ink-faint bg-paper hover:border-ink'
  }`
const chip = (on: boolean) =>
  `min-h-9 rounded-pixel border-2 px-2.5 font-pixel text-sm ${on ? 'border-ink bg-ink text-paper' : 'border-ink bg-paper text-ink hover:bg-butter'}`

type Props = {
  game: GameState
  dispatch: (a: Action) => void
  out: Vessel[]
  toggleOut: (v: Vessel) => void
}

export function Tray({ game, dispatch, out, toggleOut }: Props) {
  const [tab, setTab] = useState<TabId>('glass')
  return (
    <div className="px-3 pt-3 pb-4">
      <Tabs items={TABS} value={tab} onChange={setTab} label="재료 트레이" />
      <div id={`tabpanel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="pt-3">
        {tab === 'glass' && (
          <Grid>
            {glasses.map((gl) => (
              <button
                key={gl.id}
                data-id={gl.id}
                type="button"
                aria-pressed={game.glass.glassId === gl.id}
                className={tile(game.glass.glassId === gl.id)}
                onClick={() => dispatch({ type: 'pickGlass', glassId: gl.id })}
              >
                <GlassArt glassId={gl.id} size={64} />
                {gl.nameKo}
              </button>
            ))}
          </Grid>
        )}
        {tab === 'ice' && <IcePanel dispatch={dispatch} />}
        {tab === 'tools' && (
          <div className="space-y-3">
            <p className="text-sm text-ink-soft">용기를 작업대에 꺼내 두고, 재료를 넣은 뒤 작업대에서 흔들거나 저으세요.</p>
            <Grid>
              {VESSEL_TOOLS.map((v) => (
                <button key={v.id} type="button" aria-pressed={out.includes(v.id)} className={tile(out.includes(v.id))} onClick={() => toggleOut(v.id)}>
                  <ToolArt toolId={v.tool} size={56} />
                  {targetLabel(v.id)} {out.includes(v.id) ? '(꺼냄)' : '꺼내기'}
                </button>
              ))}
              <button type="button" className={tile(false)} onClick={() => dispatch({ type: 'stir', target: 'glass' })}>
                <ToolArt toolId="bar-spoon" size={56} />바 스푼으로 잔 안 젓기
              </button>
              {(['salt', 'sugar'] as const).map((r) => (
                <button
                  key={r}
                  data-id={`rim-${r}`}
                  type="button"
                  aria-pressed={game.glass.rim === r}
                  className={tile(game.glass.rim === r)}
                  onClick={() => dispatch({ type: 'rim', rim: r })}
                >
                  <ToolArt toolId="glass-rimmer" size={56} />
                  {r === 'salt' ? '소금' : '설탕'} 리밍
                </button>
              ))}
            </Grid>
          </div>
        )}
        {tab === 'bottles' && <BottlePanel dispatch={dispatch} />}
        {tab === 'garnish' && (
          <Grid>
            {garnishes.map((gn) => {
              const on = game.glass.garnishIds.includes(gn.id)
              return (
                <button
                  key={gn.id}
                  data-id={gn.id}
                  type="button"
                  aria-pressed={on}
                  className={tile(on)}
                  onClick={() => dispatch(on ? { type: 'removeGarnish', garnishId: gn.id } : { type: 'garnish', garnishId: gn.id })}
                >
                  <GarnishArt garnishId={gn.id} size={44} />
                  {gn.nameKo}
                </button>
              )
            })}
          </Grid>
        )}
      </div>
    </div>
  )
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">{children}</div>
}

function TargetPicker({ value, onChange, glassOnly }: { value: Target; onChange: (t: Target) => void; glassOnly?: boolean }) {
  return (
    <div role="group" aria-label="넣을 곳" className="flex flex-wrap gap-1.5">
      {TARGETS.map((t) => (
        <button
          key={t}
          type="button"
          aria-pressed={value === t}
          disabled={glassOnly && t !== 'glass'}
          className={`${chip(value === t)} disabled:opacity-40`}
          onClick={() => onChange(t)}
        >
          {targetLabel(t)}
        </button>
      ))}
    </div>
  )
}

function IcePanel({ dispatch }: { dispatch: (a: Action) => void }) {
  const [ice, setIce] = useState<IceType>('cube')
  const [target, setTarget] = useState<Target>('glass')
  return (
    <div className="flex flex-wrap items-start gap-4">
      <div role="group" aria-label="얼음 종류" className="flex gap-2">
        {(['cube', 'crushed'] as const).map((t) => (
          <button key={t} data-id={`ice-${t}`} type="button" aria-pressed={ice === t} className={`${tile(ice === t)} w-24`} onClick={() => setIce(t)}>
            <IceArt type={t} size={56} />
            {ICE_LABEL[t]}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <TargetPicker value={target} onChange={setTarget} />
        <Button onClick={() => dispatch({ type: 'addIce', target, ice })}>{targetLabel(target)}에 얼음 넣기</Button>
        <p className="text-xs text-ink-soft">잔 칠링은 작업대의 잔 아래 [칠링하기] 를 누르세요.</p>
      </div>
    </div>
  )
}

function BottlePanel({ dispatch }: { dispatch: (a: Action) => void }) {
  const [cat, setCat] = useState(CATS[0].id)
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState<string | null>(null)
  const query = q.trim().toLowerCase()
  const list = query
    ? ingredients.filter((i) => i.nameKo.toLowerCase().includes(query) || i.nameEn.toLowerCase().includes(query))
    : ingredients.filter((i) => CATS.find((c) => c.id === cat)!.has.includes(i.category))
  return (
    <div className="space-y-3">
      {picked && <PourPanel ingredientId={picked} dispatch={dispatch} onClose={() => setPicked(null)} />}
      <div className="flex flex-wrap items-center gap-1.5">
        <div role="group" aria-label="재료 분류" className="flex flex-wrap gap-1.5">
          {CATS.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={!query && cat === c.id}
              className={chip(!query && cat === c.id)}
              onClick={() => (setCat(c.id), setQ(''))}
            >
              {c.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="재료 검색 (예: 라임, gin)"
          aria-label="재료 검색"
          className="min-h-9 w-full rounded-pixel border-2 border-ink bg-paper px-2 text-sm text-ink sm:ml-auto sm:w-52"
        />
      </div>
      {list.length === 0 ? (
        <p className="text-sm text-ink-soft">‘{q}’ 에 맞는 재료가 없습니다. 다른 이름으로 찾아보세요.</p>
      ) : (
        <Grid>
          {list.map((i) => (
            <button key={i.id} data-id={i.id} type="button" aria-pressed={picked === i.id} className={tile(picked === i.id)} onClick={() => setPicked(i.id)}>
              <BottleArt ingredientId={i.id} size={72} />
              <span>{i.nameKo}</span>
            </button>
          ))}
        </Grid>
      )}
    </div>
  )
}

function PourPanel({ ingredientId, dispatch, onClose }: { ingredientId: string; dispatch: (a: Action) => void; onClose: () => void }) {
  const ing = ingredientById(ingredientId)!
  const [target, setTarget] = useState<Target>('glass')
  const [unit, setUnit] = useState<PourUnit>('oz')
  const [amount, setAmount] = useState(1)
  const [float, setFloat] = useState(false)
  const pickUnit = (u: PourUnit) => {
    setUnit(u)
    const opts = amountOptions(u)
    setAmount(opts.includes(1) ? 1 : opts[0])
  }
  return (
    <div
      className="anim-pop flex flex-col gap-3 sm:flex-row rounded-pixel border-2 border-ink bg-butter p-3 shadow-pixel-sm"
      aria-label={`${ing.nameKo} 따르기`}
      role="group"
    >
      <div className="flex shrink-0 items-center gap-2 text-xs text-ink sm:w-24 sm:flex-col sm:text-center">
        <BottleArt ingredientId={ingredientId} size={64} />
        <p>
          <span className="block font-pixel text-sm">{ing.nameKo}</span>
          <span className="text-ink-soft">{ing.nameEn}</span>
        </p>
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <TargetPicker value={target} onChange={(t) => (setTarget(t), t !== 'glass' && setFloat(false))} />
        <div role="group" aria-label="단위" className="flex flex-wrap gap-1.5">
          {UNITS.map((u) => (
            <button key={u.id} type="button" aria-pressed={unit === u.id} className={chip(unit === u.id)} onClick={() => pickUnit(u.id)}>
              {u.label}
            </button>
          ))}
        </div>
        {unit !== 'fill' && (
          <div role="group" aria-label="양" className="flex flex-wrap gap-1.5">
            {amountOptions(unit).map((a) => (
              <button key={a} type="button" aria-pressed={amount === a} className={chip(amount === a)} onClick={() => setAmount(a)}>
                {formatAmount(a, unit)}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex min-h-9 items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={float} disabled={target !== 'glass'} onChange={(e) => setFloat(e.target.checked)} className="size-4 accent-ink" />바
            스푼으로 띄우기(플로트)
          </label>
          <Button
            className="w-full sm:ml-auto sm:w-auto"
            onClick={() =>
              dispatch({
                type: 'pour',
                target,
                ingredientId,
                amount: unit === 'fill' ? 0 : amount,
                unit,
                ...(float ? { float: true } : {}),
              })
            }
          >
            {targetLabel(target)}에 {unit === 'fill' ? '가득 채우기' : `${formatAmount(amount, unit)} 따르기`}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            병 내려놓기
          </Button>
        </div>
      </div>
    </div>
  )
}
