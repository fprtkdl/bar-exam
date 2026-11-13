import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'

type Props = {
  title: string
  subtitle?: string
  /** 상위 화면으로 돌아가는 링크 */
  back?: { to: string; label: string }
  /** 제목 오른쪽 버튼 등 */
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, back, actions }: Props) {
  return (
    <header className="mb-6">
      {back && (
        <Link
          to={back.to}
          className="-ml-1 mb-2 inline-flex min-h-9 items-center gap-1 rounded-[3px] px-1 text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
        >
          <Icon name="chevron-left" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-pixel text-2xl sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 max-w-prose text-ink-soft">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  )
}
