import { useEffect, useRef, type ReactNode } from 'react'
import { Button } from './Button'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** 하단 버튼 영역. 없으면 '닫기' 버튼 하나 */
  footer?: ReactNode
}

/** 네이티브 <dialog> 사용: 포커스 가두기·Esc 닫기 기본 제공 */
export function Modal({ open, onClose, title, children, footer }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="modal-title"
      className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-pixel border-2 border-ink bg-paper p-0 text-ink shadow-pixel backdrop:bg-ink/50"
    >
      <div className="p-5">
        <h2 id="modal-title" className="mb-3 font-pixel text-lg">
          {title}
        </h2>
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
