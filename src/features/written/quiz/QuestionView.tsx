import type { ChoiceIndex, Question } from '../../../types/written'
import { QUESTION_TYPE_LABEL } from '../../../types/written'
import { Badge } from '../../../ui'

export const CHOICE_MARK = ['①', '②', '③', '④'] as const

/** 노트·문항 텍스트의 `**굵게**` 만 해석 */
export function Rich({ text }: { text: string }) {
  return <>{text.split(/\*\*(.+?)\*\*/g).map((s, i) => (i % 2 ? <strong key={i}>{s}</strong> : s))}</>
}

type Props = {
  q: Question
  /** 화면에 보이는 번호 (1부터) */
  no: number
  picked: ChoiceIndex | null
  /** true 면 정답·해설 공개, 선택 불가 */
  reveal: boolean
  onPick?: (c: ChoiceIndex) => void
}

export function QuestionView({ q, no, picked, reveal, onPick }: Props) {
  const right = picked === q.answer
  return (
    <article aria-labelledby={`stem-${q.id}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="font-pixel text-lg">{no}.</span>
        <Badge tone="lavender">{QUESTION_TYPE_LABEL[q.type]}</Badge>
      </div>
      <p id={`stem-${q.id}`} className="text-lg leading-relaxed font-semibold">
        <Rich text={q.stem} />
      </p>
      {q.passage && (
        <div className="mt-3 whitespace-pre-line rounded-pixel border-2 border-ink bg-paper-deep p-3 leading-relaxed">
          <Rich text={q.passage} />
        </div>
      )}

      <ul className="mt-4 grid gap-2">
        {q.choices.map((c, i) => {
          const idx = i as ChoiceIndex
          const isAnswer = reveal && idx === q.answer
          const isWrongPick = reveal && idx === picked && !right
          const isPicked = !reveal && idx === picked
          const bg = isAnswer ? 'bg-good-soft' : isWrongPick ? 'bg-bad-soft' : isPicked ? 'bg-sky' : 'bg-paper hover:bg-butter'
          return (
            <li key={i}>
              <button
                type="button"
                disabled={reveal}
                aria-pressed={idx === picked}
                onClick={() => onPick?.(idx)}
                className={`flex w-full items-start gap-3 rounded-pixel border-2 border-ink px-3 py-3 text-left shadow-pixel-sm disabled:cursor-default ${bg} ${
                  isPicked ? 'translate-x-0.5 translate-y-0.5 shadow-none' : ''
                }`}
              >
                <span className="font-pixel text-lg leading-6" aria-hidden>
                  {CHOICE_MARK[i]}
                </span>
                <span className="flex-1 leading-6">
                  <Rich text={c} />
                </span>
                {isAnswer && <span className="shrink-0 font-pixel text-sm text-good">✓ 정답</span>}
                {isWrongPick && <span className="shrink-0 font-pixel text-sm text-bad">✗ 내 답</span>}
                {isPicked && <span className="shrink-0 font-pixel text-sm">● 선택</span>}
              </button>
            </li>
          )
        })}
      </ul>

      {reveal && (
        <div
          role="status"
          className={`mt-4 rounded-pixel border-2 border-ink p-4 ${right ? 'bg-good-soft' : 'bg-bad-soft'}`}
        >
          <p className={`font-pixel ${right ? 'text-good' : 'text-bad'}`}>
            {right ? '✓ 정답입니다' : `✗ ${picked === null ? '미응답' : '오답'} · 정답은 ${CHOICE_MARK[q.answer]}`}
          </p>
          <p className="mt-2 leading-relaxed">
            <Rich text={q.explanation} />
          </p>
        </div>
      )}
    </article>
  )
}
