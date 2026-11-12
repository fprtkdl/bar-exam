import { useMemo, useState } from 'react'
import { glasses, recipes } from '../../../data/practical'
import { METHOD_LABEL, type MethodId } from '../../../types/practical'
import { Button, EmptyState, PageHeader } from '../../../ui'
import { RecipeCard } from '../RecipeCard'
import { BASE_LABEL } from '../lib/labels'

const SEL = 'min-h-11 rounded-pixel border-2 border-ink bg-paper px-2 text-base'

export default function RecipesPage() {
  const [q, setQ] = useState('')
  const [base, setBase] = useState('')
  const [method, setMethod] = useState('')
  const [glass, setGlass] = useState('')
  const [memorize, setMemorize] = useState(false)
  const [flipped, setFlipped] = useState<Set<string>>(new Set())

  const bases = useMemo(() => [...new Set(recipes.map((r) => r.base))], [])
  const list = recipes.filter((r) => {
    const t = q.trim().toLowerCase()
    return (
      (!t || r.nameKo.includes(t) || r.nameEn.toLowerCase().includes(t)) &&
      (!base || r.base === base) &&
      (!method || r.methods.includes(method as MethodId)) &&
      (!glass || r.glassId === glass)
    )
  })
  const toggle = (id: string) =>
    setFlipped((s) => {
      const n = new Set(s)
      if (!n.delete(id)) n.add(id)
      return n
    })

  return (
    <>
      <PageHeader
        title="레시피 카드"
        subtitle={`공식 표준 레시피 ${recipes.length}종. 암기 모드에서는 카드를 눌러 뒤집어 재료와 계량을 확인하세요.`}
        back={{ to: '/practical', label: '실기' }}
        actions={
          <Button variant={memorize ? 'primary' : 'secondary'} size="sm" aria-pressed={memorize} onClick={() => setMemorize(!memorize)}>
            암기 모드 {memorize ? '켬' : '끔'}
          </Button>
        }
      />
      <form role="search" onSubmit={(e) => e.preventDefault()} className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <input aria-label="이름 검색" placeholder="이름 검색" value={q} onChange={(e) => setQ(e.target.value)} className={`${SEL} col-span-2 sm:col-span-1`} />
        <select aria-label="기주" value={base} onChange={(e) => setBase(e.target.value)} className={SEL}>
          <option value="">기주 전체</option>
          {bases.map((b) => <option key={b} value={b}>{BASE_LABEL[b]}</option>)}
        </select>
        <select aria-label="기법" value={method} onChange={(e) => setMethod(e.target.value)} className={SEL}>
          <option value="">기법 전체</option>
          {(Object.keys(METHOD_LABEL) as MethodId[]).map((m) => <option key={m} value={m}>{METHOD_LABEL[m]}</option>)}
        </select>
        <select aria-label="잔" value={glass} onChange={(e) => setGlass(e.target.value)} className={SEL}>
          <option value="">잔 전체</option>
          {glasses.map((g) => <option key={g.id} value={g.id}>{g.nameKo}</option>)}
        </select>
      </form>
      <p className="mb-3 text-sm text-ink-soft" aria-live="polite">{list.length}종</p>
      {list.length === 0 ? (
        <EmptyState title="조건에 맞는 레시피가 없어요" description="필터를 바꾸거나 검색어를 지워 보세요." />
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((r) => (
            <li key={r.id}>
              <RecipeCard r={r} memorize={memorize} flipped={flipped.has(r.id)} onFlip={() => toggle(r.id)} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
