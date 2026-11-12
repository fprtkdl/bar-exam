import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { TONE_BG, type Tone } from './tone'

type Props = {
  tone?: Tone
  /** 주면 카드 전체가 링크. 눌림 효과 포함 */
  to?: string
  className?: string
  children: ReactNode
}

export function Card({ tone = 'paper', to, className = '', children }: Props) {
  const cls = `block rounded-pixel border-2 border-ink p-4 shadow-pixel ${TONE_BG[tone]} ${className}`
  if (to) {
    return (
      <Link
        to={to}
        className={`${cls} transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none`}
      >
        {children}
      </Link>
    )
  }
  return <div className={cls}>{children}</div>
}
