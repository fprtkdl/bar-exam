import type { ReactNode } from 'react'
import { Icon } from '../../../ui'
import { Rich } from './QuestionView'

/** 촘촘한 아코디언 행: 왼쪽 고정 칸(lead) · 위줄(top) · 문제 2줄 말줄임 · 펼치면 children. 오답노트·결과 화면 공용 */
export function QuestionRow({ id, stem, lead, top, open, onToggle, children }: {
  id: string
  stem: string
  lead: ReactNode
  top: ReactNode
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <li className="border-ink-faint not-first:border-t-2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`wn-${id}`}
        onClick={onToggle}
        className={`grid w-full grid-cols-[3.5rem_minmax(0,1fr)_auto] items-start gap-3 px-3 py-3 text-left hover:bg-butter focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-ink active:bg-paper-deep sm:px-4 ${open ? 'bg-paper-deep' : ''}`}
      >
        {lead}
        <span className="min-w-0">
          <span className="flex items-center gap-2">{top}</span>
          <span id={`stem-${id}`} className={`mt-1.5 block leading-relaxed font-semibold ${open ? '' : 'line-clamp-2'}`}>
            <Rich text={stem} />
          </span>
        </span>
        <Icon name="chevron-down" className={`mt-1 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div id={`wn-${id}`} className="border-t-2 border-ink-faint px-3 pt-3 pb-4 sm:pr-4 sm:pl-[5.25rem]">
          {children}
        </div>
      )}
    </li>
  )
}
