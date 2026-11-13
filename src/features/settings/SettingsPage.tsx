import { useRef, useState } from 'react'
import { useStore } from '../../lib/store'
import type { ReactNode } from 'react'
import { Button, Card, Icon, Modal, PageHeader } from '../../ui'

function Row({ tone, title, desc, children }: { tone?: 'peach'; title: string; desc: string; children: ReactNode }) {
  return (
    <Card tone={tone}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-pixel text-lg">{title}</h2>
          <p className="mt-1 text-sm">{desc}</p>
        </div>
        <div className="shrink-0">{children}</div>
      </div>
    </Card>
  )
}

export default function SettingsPage() {
  const exportState = useStore((s) => s.exportState)
  const importState = useStore((s) => s.importState)
  const resetAll = useStore((s) => s.resetAll)
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirm, setConfirm] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const download = () => {
    const url = URL.createObjectURL(new Blob([exportState()], { type: 'application/json' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `bar-exam-${new Date().toISOString().slice(0, 10)}.json` })
    a.click()
    URL.revokeObjectURL(url)
    setMsg({ ok: true, text: '기록을 내려받았어요.' })
  }
  const upload = async (file?: File) => {
    if (!file) return
    setMsg(importState(await file.text()) ? { ok: true, text: '기록을 가져왔어요.' } : { ok: false, text: '형식이 맞지 않아 가져오지 못했어요. 기존 기록은 그대로입니다.' })
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <>
      <PageHeader title="설정" subtitle="학습 기록은 이 브라우저에만 저장돼요. 서버로 전송되지 않습니다." />
      <div className="grid gap-4">
        <Row title="기록 내보내기" desc="풀이 기록·오답노트·게임 기록을 JSON 파일로 저장합니다.">
          <Button onClick={download}>
            <Icon name="download" />
            JSON 내려받기
          </Button>
        </Row>
        <Row title="기록 가져오기" desc="내보낸 JSON 을 고르면 현재 기록을 덮어씁니다.">
          <input ref={fileRef} id="import-file" type="file" accept="application/json,.json" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} />
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            <Icon name="upload" />
            JSON 파일 고르기
          </Button>
        </Row>
        <Row tone="peach" title="전체 초기화" desc="모든 풀이 기록과 오답노트를 지웁니다. 되돌릴 수 없어요.">
          <Button variant="secondary" onClick={() => setConfirm(true)}>
            <Icon name="trash" />
            기록 모두 지우기
          </Button>
        </Row>
      </div>
      <p role="status" aria-live="polite" className="mt-4 flex min-h-6 items-center gap-2 text-sm">
        {msg && (
          <>
            <Icon name={msg.ok ? 'check' : 'x'} className={msg.ok ? 'text-good' : 'text-bad'} />
            {msg.text}
          </>
        )}
      </p>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="기록을 모두 지울까요?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(false)}>취소</Button>
            <Button
              onClick={() => {
                resetAll()
                setConfirm(false)
                setMsg({ ok: true, text: '기록을 모두 지웠어요.' })
              }}
            >
              모두 지우기
            </Button>
          </>
        }
      >
        <p>풀이 기록, 오답노트, 게임 기록이 삭제됩니다. 필요하면 먼저 내보내기를 해 두세요.</p>
      </Modal>
    </>
  )
}
