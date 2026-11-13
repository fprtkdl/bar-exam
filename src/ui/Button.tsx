import type { ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'sm'

const VARIANT: Record<Variant, string> = {
  primary: 'bg-ink text-paper border-ink shadow-pixel-sm hover:bg-ink-soft',
  secondary: 'bg-paper text-ink border-ink shadow-pixel-sm hover:bg-butter',
  ghost: 'bg-transparent text-ink border-transparent hover:border-ink',
}
const SIZE: Record<Size, string> = {
  md: 'min-h-11 px-4 text-base',
  sm: 'min-h-11 px-3 text-sm sm:min-h-9',
}

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', className = '') {
  return `inline-flex items-center justify-center gap-2 rounded-pixel border-2 font-pixel leading-none select-none transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 ${VARIANT[variant]} ${SIZE[size]} ${className}`
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  /** 주면 라우터 링크(<a>)로 렌더 */
  to?: string
}

export function Button({ variant, size, to, className, type = 'button', children, ...rest }: Props) {
  const cls = buttonClass(variant, size, className)
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  )
}
