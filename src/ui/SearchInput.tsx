import { useRef } from 'react'
import { Icon } from './Icon'
import { inputClass } from './TextField'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** 스크린리더용 이름 (예: '레시피 검색') */
  label: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder, label, className = '' }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className={`relative min-w-0 ${className}`}>
      <Icon name="search" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-soft" />
      <input
        ref={ref}
        type="search"
        aria-label={label}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && value && (e.preventDefault(), onChange(''))}
        className={`${inputClass} pr-10 pl-9`}
      />
      {value && (
        <button
          type="button"
          aria-label="검색어 지우기"
          onClick={() => {
            onChange('')
            ref.current?.focus()
          }}
          className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 items-center justify-center rounded-[3px] text-ink-soft hover:bg-butter hover:text-ink sm:size-7"
        >
          <Icon name="x" size={12} />
        </button>
      )}
    </div>
  )
}
