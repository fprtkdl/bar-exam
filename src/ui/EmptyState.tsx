import type { ReactNode } from 'react'

type Props = {
  title: string
  description?: string
  /** 다음 행동 버튼 등 */
  action?: ReactNode
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-pixel border-2 border-dashed border-ink-faint px-4 py-10 text-center">
      <p className="font-pixel text-base">{title}</p>
      {description && <p className="max-w-prose text-sm text-ink-soft">{description}</p>}
      {action}
    </div>
  )
}
