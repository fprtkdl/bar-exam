import { useId, useRef, type KeyboardEvent } from 'react'

type Props<T extends string> = {
  /** 묶음 이름. 기본은 왼쪽에 보이고, hideLabel 이면 aria-label 로만 */
  label: string
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
  hideLabel?: boolean
  className?: string
}

/** 5개 이하 단일 선택(정렬·모드 등). 라디오 그룹: 방향키로 이동하며 바로 선택 */
export function ChipGroup<T extends string>({ label, value, onChange, options, hideLabel = false, className = '' }: Props<T>) {
  const id = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const current = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  )
  const onKey = (e: KeyboardEvent, i: number) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    const next = step ? (i + step + options.length) % options.length : e.key === 'Home' ? 0 : e.key === 'End' ? options.length - 1 : -1
    if (next < 0) return
    e.preventDefault()
    onChange(options[next].value)
    refs.current[next]?.focus()
  }
  return (
    <div className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      {!hideLabel && (
        <span id={`${id}-label`} className="font-pixel text-sm text-ink-soft">
          {label}
        </span>
      )}
      <div
        role="radiogroup"
        {...(hideLabel ? { 'aria-label': label } : { 'aria-labelledby': `${id}-label` })}
        className="flex flex-wrap gap-2"
      >
        {options.map((o, i) => {
          const on = i === current
          return (
            <button
              key={o.value}
              ref={(el) => {
                refs.current[i] = el
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(o.value)}
              onKeyDown={(e) => onKey(e, i)}
              className={`inline-flex min-h-11 items-center rounded-pixel border-2 border-ink px-3 font-pixel text-sm leading-none select-none sm:min-h-9 ${
                on
                  ? 'translate-x-0.5 translate-y-0.5 bg-ink text-paper'
                  : 'bg-paper text-ink shadow-pixel-sm hover:bg-butter active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
