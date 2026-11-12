import { useRef, type KeyboardEvent } from 'react'

type Props<T extends string> = {
  items: { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
  /** 스크린리더용 탭 묶음 이름 */
  label: string
}

/** 탭 버튼 줄만 그린다. 패널은 페이지에서 value 로 분기 (패널에 id=`tabpanel-${id}` 를 주면 aria 연결) */
export function Tabs<T extends string>({ items, value, onChange, label }: Props<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (i + step + items.length) % items.length
    onChange(items[next].id)
    refs.current[next]?.focus()
  }
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto border-b-2 border-ink">
      {items.map((it, i) => {
        const on = it.id === value
        return (
          <button
            key={it.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`tab-${it.id}`}
            aria-selected={on}
            aria-controls={`tabpanel-${it.id}`}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(it.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`-mb-0.5 shrink-0 rounded-t-pixel border-2 px-3 py-2 font-pixel text-sm ${
              on ? 'border-ink border-b-paper bg-paper' : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            {it.label}
          </button>
        )
      })}
    </div>
  )
}
