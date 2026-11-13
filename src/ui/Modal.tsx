import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Button } from './Button'
import { Icon } from './Icon'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** 하단 버튼 영역. 없으면 '닫기' 버튼 하나 */
  footer?: ReactNode
}

/** 네이티브 <dialog>: 포커스 가두기·Esc 닫기 기본 제공. 열린 동안 배경 스크롤 잠금 */
export function Modal({ open, onClose, title, children, footer }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
    if (!open) return
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = prev
    }
  }, [open])
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby={titleId}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] overscroll-contain rounded-pixel border-2 border-ink bg-paper p-0 text-ink shadow-pixel backdrop:bg-ink/50"
    >
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 id={titleId} className="pt-1 font-pixel text-lg leading-snug">
            {title}
          </h2>
          <button
            type="button"
            aria-label="창 닫기"
            onClick={onClose}
            className="-mt-1 -mr-1 flex size-9 shrink-0 items-center justify-center rounded-[3px] border-2 border-transparent hover:border-ink hover:bg-butter"
          >
            <Icon name="x" />
          </button>
        </div>
        <div>{children}</div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          {footer ?? (
            <Button variant="secondary" onClick={onClose}>
              닫기
            </Button>
          )}
        </div>
      </div>
    </dialog>
  )
}
