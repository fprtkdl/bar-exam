import type { AttemptRecord as Attempt } from '../../../types/storage'
import { Card, Icon } from '../../../ui'
import { toScore } from '../quiz/build'

/** 단원평가 세트 카드: 제목 / 문항 수 / 최근 결과 — 모든 카드가 같은 세 줄 */
export function SetCard({ to, title, n, last }: { to: string; title: string; n: number; last?: Attempt }) {
  return (
    <Card tone={last ? 'mint' : 'paper'} to={to} className="h-full">
      <p className="flex items-center justify-between gap-2 font-pixel">
        {title}
        {last && <Icon name="check" label="푼 세트" />}
      </p>
      <p className="mt-1 text-sm">{n}문항</p>
      <p className={`mt-1 font-pixel text-xs tabular-nums ${last ? '' : 'text-ink-soft'}`}>
        {last ? `최근 ${last.correct}/${last.total} · ${toScore(last.correct, last.total)}점` : '아직 안 풀었어요'}
      </p>
    </Card>
  )
}
