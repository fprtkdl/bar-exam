import { useRef, useState } from 'react'
import { useStore } from '../../lib/store'
import { Button, Card, Modal, PageHeader } from '../../ui'

export default function SettingsPage() {
  const exportState = useStore((s) => s.exportState)
  const importState = useStore((s) => s.importState)
  const resetAll = useStore((s) => s.resetAll)
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirm, setConfirm] = useState(false)
  const [msg, setMsg] = useState('')

  const download = () => {
    const url = URL.createObjectURL(new Blob([exportState()], { type: 'application/json' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: `bar-exam-${new Date().toISOString().slice(0, 10)}.json` })
    a.click()
    URL.revokeObjectURL(url)
    setMsg('✓ 기록을 내려받았어요.')
  }
  const upload = async (file?: File) => {
    if (!file) return
    setMsg(importState(await file.text()) ? '✓ 기록을 가져왔어요.' : '✗ 형식이 맞지 않아 가져오지 못했어요. 기존 기록은 그대로입니다.')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <>
      <PageHeader title="설정" subtitle="학습 기록은 이 브라우저에만 저장돼요. 서버로 전송되지 않습니다." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="font-pixel text-lg">기록 내보내기</h2>
          <p className="mt-1 mb-3 text-sm">풀이 기록·오답노트·게임 기록을 JSON 파일로 저장합니다.</p>
          <Button onClick={download}>JSON 내려받기</Button>
        </Card>
        <Card>
          <h2 className="font-pixel text-lg">기록 가져오기</h2>
          <p className="mt-1 mb-3 text-sm">내보낸 JSON 을 고르면 현재 기록을 덮어씁니다.</p>
          <input ref={fileRef} id="import-file" type="file" accept="application/json,.json" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} />
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>JSON 파일 고르기</Button>
        </Card>
        <Card tone="peach" className="md:col-span-2">
          <h2 className="font-pixel text-lg">전체 초기화</h2>
          <p className="mt-1 mb-3 text-sm">모든 풀이 기록과 오답노트를 지웁니다. 되돌릴 수 없어요.</p>
          <Button variant="secondary" onClick={() => setConfirm(true)}>기록 모두 지우기</Button>
        </Card>
      </div>
      <p role="status" className="mt-4 min-h-6 text-sm">{msg}</p>

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
                setMsg('✓ 기록을 모두 지웠어요.')
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
