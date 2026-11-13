import type { ReactNode } from 'react'
import { TONE_BG, type Tone } from './tone'

type Props = {
  label: string
  value: string | number
  /** 값 아래 작은 설명 (예: '지난주보다 +5') */
  hint?: ReactNode
  tone?: Tone
}

export function StatTile({ label, value, hint, tone = 'paper' }: Props) {
  return (
    <div className={`rounded-pixel border-2 border-ink p-3 shadow-pixel-sm ${TONE_BG[tone]}`}>
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="font-pixel text-2xl tabular-nums">{value}</p>
      {hint && <p className="flex items-center gap-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  )
}
