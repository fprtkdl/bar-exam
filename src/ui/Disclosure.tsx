import type { ReactNode } from 'react'
import { Icon } from './Icon'

type Props = {
  summary: ReactNode
  defaultOpen?: boolean
  className?: string
  children: ReactNode
}

/** 접기/펼치기. 네이티브 details 라 키보드·찾기(⌘F)로 자동 펼침이 그대로 동작 */
export function Disclosure({ summary, defaultOpen = false, className = '', children }: Props) {
  return (
    <details
      open={defaultOpen}
      className={`group rounded-pixel border-2 border-ink bg-paper shadow-pixel-sm ${className}`}
    >
      <summary className="flex min-h-11 cursor-pointer items-center gap-2 rounded-[4px] px-4 py-2 font-pixel text-sm select-none hover:bg-butter">
        <Icon name="chevron-right" className="transition-transform group-open:rotate-90" />
        <span className="min-w-0 flex-1">{summary}</span>
      </summary>
      <div className="border-t-2 border-ink px-4 py-3">{children}</div>
    </details>
  )
}
