import { TONE_BG, type Tone } from './tone'

type Props = {
  value: number
  max?: number
  /** 스크린리더용 이름 (예: '단원 진도') */
  label: string
  tone?: Tone
  /** 막대 오른쪽에 `value/max` 표시 */
  showValue?: boolean
}

export function ProgressBar({ value, max = 100, label, tone = 'mint', showValue = false }: Props) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  return (
    <div className="flex items-center gap-2">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className="h-4 flex-1 overflow-hidden rounded-[3px] border-2 border-ink bg-paper"
      >
        <div className={`h-full border-r-2 border-ink ${TONE_BG[tone]}`} style={{ width: `${pct}%` }} />
      </div>
      {showValue && (
        <span className="min-w-12 text-right font-pixel text-xs tabular-nums">
          {value}/{max}
        </span>
      )}
    </div>
  )
}
