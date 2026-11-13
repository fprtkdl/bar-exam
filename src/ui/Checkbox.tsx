import type { ReactNode } from 'react'
import { Icon } from './Icon'

type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
  children: ReactNode
}

/** 도트 체크 상자. 진짜 checkbox 를 시각적으로만 숨겨 키보드·스크린리더는 기본 동작 그대로 */
export function Checkbox({ checked, onChange, disabled = false, className = '', children }: Props) {
  return (
    <label
      className={`group inline-flex min-h-11 items-center gap-2 select-none sm:min-h-9 ${
        disabled ? 'opacity-50' : 'cursor-pointer'
      } ${className}`}
    >
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden
        className={`flex size-5 shrink-0 items-center justify-center rounded-[3px] border-2 border-ink shadow-pixel-sm peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink ${
          checked ? 'bg-butter' : 'bg-paper'
        } ${disabled ? '' : 'group-hover:bg-butter group-active:translate-x-0.5 group-active:translate-y-0.5 group-active:shadow-none'}`}
      >
        {checked && <Icon name="check" size={12} />}
      </span>
      <span className="text-sm">{children}</span>
    </label>
  )
}
