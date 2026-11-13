import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { TONE_BG, type Tone } from './tone'

type Props = {
  tone?: Tone
  /** 주면 카드 전체가 링크(interactive 자동) */
  to?: string
  /** hover 들림·눌림·포커스 링. 카드 안에 버튼·링크를 덮어 씌운 경우 등 */
  interactive?: boolean
  className?: string
  children: ReactNode
}

const INTERACTIVE =
  'transition-transform hover:-translate-x-px hover:-translate-y-px active:translate-x-1 active:translate-y-1 active:shadow-none has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink'

export function Card({ tone = 'paper', to, interactive = false, className = '', children }: Props) {
  const cls = `block rounded-pixel border-2 border-ink p-4 shadow-pixel sm:p-5 ${TONE_BG[tone]} ${className}`
  if (to) {
    return (
      <Link to={to} className={`${cls} ${INTERACTIVE}`}>
        {children}
      </Link>
    )
  }
  return <div className={interactive ? `${cls} ${INTERACTIVE}` : cls}>{children}</div>
}
