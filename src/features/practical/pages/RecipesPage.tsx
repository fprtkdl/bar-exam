import { useMemo, useState, type ReactNode } from 'react'
import { glasses, recipes } from '../../../data/practical'
import type { MethodId } from '../../../types/practical'
import { Button, EmptyState, PageHeader, SearchInput, Select } from '../../../ui'
import { RecipeCard } from '../RecipeCard'
import { BASE_LABEL, METHOD_SHORT } from '../lib/labels'

/** 캡션이 위, 컨트롤이 아래인 세로 필드 (캡션은 장식 — Select 가 aria-label 을 가진다) */
function Field({ caption, className = '', children }: { caption: string; className?: string; children: ReactNode }) {
  return (
    <div className={`flex min-w-0 flex-col gap-1 ${className}`}>
      <span aria-hidden className="font-pixel text-xs text-ink-soft">{caption}</span>
      {children}
    </div>
  )
}

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
      <form role="search" onSubmit={(e) => e.preventDefault()} className="mb-4 grid grid-cols-2 items-end gap-2 sm:grid-cols-4">
        <SearchInput label="이름 검색" placeholder="이름 검색" value={q} onChange={setQ} className="col-span-2 sm:col-span-1" />
        <Field caption="기주">
          <Select label="기주" hideLabel className="min-w-0" value={base} onChange={setBase} options={[{ value: '', label: '전체' }, ...bases.map((b) => ({ value: b, label: BASE_LABEL[b] }))]} />
        </Field>
        <Field caption="기법">
          <Select label="기법" hideLabel className="min-w-0" value={method} onChange={setMethod} options={[{ value: '', label: '전체' }, ...(Object.keys(METHOD_SHORT) as MethodId[]).map((m) => ({ value: m, label: METHOD_SHORT[m] }))]} />
        </Field>
        <Field caption="잔" className="col-span-2 sm:col-span-1">
          <Select label="잔" hideLabel className="min-w-0" value={glass} onChange={setGlass} options={[{ value: '', label: '전체' }, ...glasses.map((g) => ({ value: g.id, label: g.nameKo }))]} />
        </Field>
      </form>
      <p className="mb-3 font-pixel text-sm text-ink-soft" aria-live="polite">{list.length}종</p>
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
