import type { ReactNode } from 'react'
import { TONE_BG, type Tone } from './tone'

export function Badge({ tone = 'butter', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 self-center rounded-[3px] border-2 border-ink px-1.5 py-0.5 font-pixel text-xs leading-none text-ink ${TONE_BG[tone]}`}
    >
      {children}
    </span>
  )
}
