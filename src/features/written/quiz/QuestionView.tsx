import { useEffect, useRef } from 'react'
import type { ChoiceIndex, Question } from '../../../types/written'
import { QUESTION_TYPE_LABEL } from '../../../types/written'
import { Arrows, Badge, Icon } from '../../../ui'

/** 노트·문항 텍스트의 `**굵게**` 를 해석하고, 문장 속 화살표 문자(→)는 아이콘으로 바꾼다 */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((s, i) => {
        const parts = <Arrows text={s} />
        return i % 2 ? <strong key={i}>{parts}</strong> : <span key={i}>{parts}</span>
      })}
    </>
  )
}

/** 보기 번호 칩 (글리프 ①② 대신 상자 + 숫자) */
export function ChoiceNo({ i, on = false }: { i: number; on?: boolean }) {
  return (
    <span aria-hidden className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[3px] border-2 border-ink font-pixel text-xs leading-none ${on ? 'bg-ink text-paper' : 'bg-paper text-ink'}`}>
      {i + 1}
    </span>
  )
}

/**
 * 문제 풀이 키보드 단축키. 입력창에 포커스가 있거나 모달이 열려 있으면 무시한다.
 * Enter 는 버튼·링크에 포커스가 있으면 그 버튼의 기본 동작에 맡긴다(두 번 실행 방지).
 */
export function useQuizKeys(handlers: { pick?: (c: ChoiceIndex) => void; next?: () => void; prev?: () => void }) {
  const ref = useRef(handlers)
  ref.current = handlers
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.isComposing) return
      const t = e.target as HTMLElement | null
      if (t?.closest('input, textarea, select, [contenteditable="true"], [role="combobox"], [role="listbox"]')) return
      if (document.querySelector('dialog[open]')) return
      const h = ref.current
      if (/^[1-4]$/.test(e.key) && h.pick) h.pick((Number(e.key) - 1) as ChoiceIndex)
      else if (e.key === 'ArrowRight' && h.next) h.next()
      else if (e.key === 'ArrowLeft' && h.prev) h.prev()
      else if (e.key === 'Enter' && h.next && !t?.closest('button, a, summary')) h.next()
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

/** 단축키 안내 — 데스크톱에서만 작게 */
export function KeyHint({ prev = false }: { prev?: boolean }) {
  const k = 'inline-flex h-5 min-w-5 items-center justify-center rounded-[3px] border-2 border-ink-soft px-1 font-pixel text-[11px] leading-none'
  return (
    <p className="hidden items-center gap-2 text-xs text-ink-soft lg:flex">
      <span className={k}>1</span>–<span className={k}>4</span> 보기 선택
      <span className={`${k} ml-2`}>Enter</span> 다음
      {prev && (
        <>
          <span className={`${k} ml-2`}>
            <Icon name="chevron-left" size={12} label="왼쪽 화살표" />
          </span>
          <span className={k}>
            <Icon name="chevron-right" size={12} label="오른쪽 화살표" />
          </span>
          이전·다음
        </>
      )}
    </p>
  )
}

type Props = {
  q: Question
  picked: ChoiceIndex | null
  /** true 면 정답·해설 공개, 선택 불가 */
  reveal: boolean
  onPick?: (c: ChoiceIndex) => void
  /** 오답노트처럼 바깥에 이미 문제가 보일 때: 번호·유형·문제 줄을 생략 (문제 요소 id 는 바깥이 stemId 로 준다) */
  bare?: boolean
  /** 문제 요소 id (기본 `stem-<qid>`). bare 일 때 바깥이 같은 id 를 준다 */
  stemId?: string
} & ({ bare: true; no?: number } | { bare?: false; /** 화면에 보이는 번호 (1부터) */ no: number })

export function QuestionView({ q, no, picked, reveal, onPick, bare = false, stemId = `stem-${q.id}` }: Props) {
  const right = picked === q.answer
  return (
    <article aria-labelledby={stemId}>
      {!bare && (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="font-pixel text-lg">{no}.</span>
            <Badge tone="lavender">{QUESTION_TYPE_LABEL[q.type]}</Badge>
          </div>
          <p id={stemId} className="text-lg leading-relaxed font-semibold">
            <Rich text={q.stem} />
          </p>
        </>
      )}
      {q.passage && (
        <div className={`${bare ? '' : 'mt-3'} whitespace-pre-line rounded-pixel border-2 border-ink bg-paper-deep p-3 leading-relaxed`}>
          <Rich text={q.passage} />
        </div>
      )}

      <ul className={`${bare && !q.passage ? '' : 'mt-4'} grid gap-2`}>
        {q.choices.map((c, i) => {
          const idx = i as ChoiceIndex
          const isAnswer = reveal && idx === q.answer
          const isWrongPick = reveal && idx === picked && !right
          const isPicked = !reveal && idx === picked
          const bg = isAnswer ? 'bg-good-soft' : isWrongPick ? 'bg-bad-soft' : isPicked ? 'bg-sky' : reveal ? 'bg-paper' : 'bg-paper hover:bg-butter'
          return (
            <li key={i}>
              <button
                type="button"
                disabled={reveal}
                aria-pressed={idx === picked}
                onClick={() => onPick?.(idx)}
                className={`flex min-h-11 w-full items-start gap-3 rounded-pixel border-2 border-ink px-3 py-2.5 text-left transition-transform focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-default ${bg} ${
                  isPicked ? 'translate-x-0.5 translate-y-0.5' : reveal ? '' : 'shadow-pixel-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                } ${reveal && !isAnswer && !isWrongPick ? 'text-ink-soft' : ''}`}
              >
                <ChoiceNo i={i} on={isPicked} />
                <span className="flex-1 leading-6">
                  <Rich text={c} />
                </span>
                {isAnswer && (
                  <span className="inline-flex shrink-0 items-center gap-1 font-pixel text-sm leading-6 text-good">
                    <Icon name="check" />
                    정답
                  </span>
                )}
                {isWrongPick && (
                  <span className="inline-flex shrink-0 items-center gap-1 font-pixel text-sm leading-6 text-bad">
                    <Icon name="x" />내 답
                  </span>
                )}
                {isPicked && (
                  <span className="inline-flex shrink-0 items-center gap-1 font-pixel text-sm leading-6">
                    <Icon name="check" />
                    선택
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {reveal && (
        <div role="status" className={`mt-4 rounded-pixel border-2 border-ink p-4 ${right ? 'bg-good-soft' : 'bg-bad-soft'}`}>
          <p className={`flex items-center gap-2 font-pixel ${right ? 'text-good' : 'text-bad'}`}>
            <Icon name={right ? 'check' : 'x'} />
            {right ? '정답입니다' : `${picked === null ? '미응답' : '오답'} · 정답은 ${q.answer + 1}번`}
          </p>
          <p className="mt-2 leading-relaxed">
            <Rich text={q.explanation} />
          </p>
        </div>
      )}
    </article>
  )
}
