import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Icon } from './Icon'
import { moveIndex, typeaheadIndex } from './selectLogic'

export type SelectOption = { value: string; label: string }

type Props = {
  /** 라벨. 기본은 트리거 왼쪽에 보이고, hideLabel 이면 aria-label 로만 */
  label: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  className?: string
  hideLabel?: boolean
  disabled?: boolean
}

const GAP = 6
const EDGE = 8
const MAX_H = 288

/**
 * 기본 <select> 대체 (WAI-ARIA select-only combobox). 포커스는 트리거에 머물고 aria-activedescendant 로 항목을 가리킨다.
 * 리스트는 popover(top layer)로 띄워 부모 overflow·모달에 잘리지 않는다.
 */
export function Select({ label, value, onChange, options, className = '', hideLabel = false, disabled = false }: Props) {
  const id = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [pos, setPos] = useState<CSSProperties>({ visibility: 'hidden' })
  const typed = useRef({ text: '', at: 0 })

  const selectedIndex = options.findIndex((o) => o.value === value)
  const selected = options[selectedIndex]
  const optId = (i: number) => `${id}-opt-${i}`

  const show = (index = Math.max(0, selectedIndex)) => {
    setActive(index)
    setOpen(true)
  }
  const close = () => setOpen(false)
  const commit = (i: number) => {
    if (options[i] && options[i].value !== value) onChange(options[i].value)
    close()
  }

  // 위치: 아래 공간이 모자라고 위가 더 넓으면 위로. 높이는 남은 공간으로 제한
  const place = () => {
    const t = triggerRef.current
    const l = listRef.current
    if (!t || !l) return
    const r = t.getBoundingClientRect()
    const vw = document.documentElement.clientWidth
    const vh = window.innerHeight
    const below = vh - r.bottom - GAP - EDGE
    const above = r.top - GAP - EDGE
    // 폭 제한을 먼저 걸고 잰다 (scrollHeight 는 max-height 와 무관한 전체 높이)
    Object.assign(l.style, { minWidth: `${r.width}px`, maxWidth: `${vw - EDGE * 2}px` })
    const want = Math.min(MAX_H, l.scrollHeight + 4)
    const up = want > below && above > below
    const left = Math.min(Math.max(EDGE, r.left), vw - l.offsetWidth - EDGE)
    setPos({
      left,
      minWidth: r.width,
      maxWidth: vw - EDGE * 2,
      maxHeight: Math.min(MAX_H, up ? above : below),
      ...(up ? { bottom: vh - r.top + GAP } : { top: r.bottom + GAP }),
    })
  }

  useLayoutEffect(() => {
    const l = listRef.current
    if (!open || !l) return
    l.showPopover?.()
    place()
    return () => {
      if (l.matches?.(':popover-open')) l.hidePopover()
      setPos({ visibility: 'hidden' })
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      const n = e.target as Node
      if (!triggerRef.current?.contains(n) && !listRef.current?.contains(n)) close()
    }
    const onScroll = (e: Event) => {
      if (e.target !== listRef.current) place()
    }
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', place)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', place)
    }
  }, [open])

  useEffect(() => {
    if (open) document.getElementById(optId(active))?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const onKeyDown = (e: KeyboardEvent) => {
    const k = e.key
    if (!open) {
      if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ') {
        e.preventDefault()
        show()
      } else if (k === 'Home' || k === 'End') {
        e.preventDefault()
        show(k === 'Home' ? 0 : options.length - 1)
      } else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        jump(k, false)
      }
      return
    }
    if (k === 'Escape') {
      e.preventDefault() // 모달 안에서도 모달은 닫지 않는다
      e.stopPropagation()
      close()
    } else if (k === 'Enter' || k === ' ') {
      e.preventDefault()
      if (k === ' ' && typed.current.text && Date.now() - typed.current.at < 600) return jump(k, true)
      commit(active)
    } else if (k === 'Tab') {
      close()
    } else {
      const next = moveIndex(k, active, options.length)
      if (next !== null) {
        e.preventDefault()
        setActive(next)
      } else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        jump(k, true)
      }
    }
  }

  // 글자 입력: 열려 있으면 활성 항목만 옮기고, 닫혀 있으면 바로 선택(네이티브 select 와 같음)
  const jump = (ch: string, isOpen: boolean) => {
    const now = Date.now()
    const t = typed.current
    t.text = now - t.at < 600 ? t.text + ch : ch
    t.at = now
    const from = isOpen ? active : Math.max(0, selectedIndex)
    const i = typeaheadIndex(
      options.map((o) => o.label),
      t.text,
      from,
    )
    if (i < 0) return
    if (isOpen) setActive(i)
    else if (options[i].value !== value) onChange(options[i].value)
  }

  return (
    <div className={`inline-flex min-w-0 items-center gap-2 ${className}`}>
      {!hideLabel && (
        <span id={`${id}-label`} className="shrink-0 font-pixel text-sm text-ink-soft">
          {label}
        </span>
      )}
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? optId(active) : undefined}
        {...(hideLabel ? { 'aria-label': label } : { 'aria-labelledby': `${id}-label` })}
        disabled={disabled}
        onClick={() => (open ? close() : show())}
        onKeyDown={onKeyDown}
        className={`inline-flex min-h-11 min-w-0 flex-1 items-center justify-between gap-2 rounded-pixel border-2 border-ink bg-paper py-1 pr-2 pl-3 text-left font-pixel text-sm leading-none text-ink shadow-pixel-sm select-none hover:bg-butter disabled:pointer-events-none disabled:opacity-50 sm:min-h-9 ${
          open ? 'bg-butter' : ''
        }`}
      >
        <span className="truncate py-0.5">{selected?.label ?? '선택'}</span>
        <Icon name="chevron-down" className={open ? 'rotate-180' : ''} />
      </button>
      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          popover="manual"
          aria-label={label}
          tabIndex={-1}
          style={pos}
          onMouseDown={(e) => e.preventDefault() /* 트리거 포커스 유지 */}
          className="fixed inset-auto z-50 m-0 overflow-y-auto overscroll-contain rounded-pixel border-2 border-ink bg-paper p-1 text-ink shadow-pixel"
        >
          {options.map((o, i) => {
            const isSel = o.value === value
            return (
              <li
                key={o.value}
                id={optId(i)}
                role="option"
                aria-selected={isSel}
                onPointerMove={() => i !== active && setActive(i)}
                onClick={() => commit(i)}
                className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-[3px] px-2 py-1.5 font-pixel text-sm leading-tight sm:min-h-8 ${
                  i === active ? 'bg-butter' : ''
                }`}
              >
                <span className="flex w-4 shrink-0 justify-center">{isSel && <Icon name="check" />}</span>
                {o.label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
