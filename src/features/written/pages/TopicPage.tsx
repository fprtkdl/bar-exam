import { useParams } from 'react-router-dom'
import { notes, questions, units } from '../../../data/written'
import type { NoteBlock } from '../../../types/written'
import { Badge, Button, Card, EmptyState, Icon, PageHeader } from '../../../ui'
import { Rich } from '../quiz/QuestionView'

function Block({ b }: { b: NoteBlock }) {
  switch (b.kind) {
    case 'p':
      return (
        <p className="leading-relaxed">
          <Rich text={b.text} />
        </p>
      )
    case 'list':
      return (
        <ul className="list-disc space-y-1 pl-5 leading-relaxed">
          {b.items.map((it, i) => (
            <li key={i}>
              <Rich text={it} />
            </li>
          ))}
        </ul>
      )
    case 'table':
      return (
        // 모바일: 3열 이상 표는 눌러 담지 않고 가로로 스크롤
        <div className="-mx-1 overflow-x-auto px-1 pb-1">
          <table className={`w-full border-collapse border-2 border-ink text-sm ${b.head.length >= 3 ? 'min-w-[32rem]' : ''}`}>
            <thead className="bg-paper-deep">
              <tr>
                {b.head.map((h, i) => (
                  <th key={i} scope="col" className="border-2 border-ink px-2 py-1.5 text-left font-semibold first:min-w-[4.5em] first:break-keep">
                    <Rich text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j} className="border-2 border-ink px-2 py-1.5 align-top first:min-w-[4.5em] first:break-keep">
                      <Rich text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'tip':
      return (
        <aside className="rounded-pixel border-2 border-ink bg-butter p-3 leading-relaxed sm:p-4">
          <p className="mb-1 flex items-center gap-2 font-pixel text-sm">
            <Icon name="tip" />
            시험 포인트
          </p>
          <Rich text={b.text} />
        </aside>
      )
  }
}

export default function TopicPage() {
  const { topicId } = useParams()
  const unit = units.find((u) => u.topics.some((t) => t.id === topicId))
  const topic = unit?.topics.find((t) => t.id === topicId)
  const note = notes.find((n) => n.topicId === topicId)
  const qn = questions.filter((q) => q.topicId === topicId).length

  if (!unit || !topic) {
    return (
      <>
        <PageHeader title="토픽 노트" back={{ to: '/written', label: '필기' }} />
        <EmptyState title="없는 토픽이에요" action={<Button to="/written">필기로</Button>} />
      </>
    )
  }

  const quizBtn = (
    <Button to={qn ? `/written/quiz/topic/${topic.id}` : undefined} disabled={!qn}>
      <Icon name="pencil" />
      {qn ? `확인 문제 ${Math.min(5, qn)}문항` : '확인 문제 준비 중'}
    </Button>
  )

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={topic.title} subtitle={topic.summary} back={{ to: `/written/unit/${unit.id}`, label: unit.title }} actions={quizBtn} />

      {note ? (
        <>
          {note.keywords.length > 0 && (
            <ul aria-label="핵심 키워드" className="mb-8 flex flex-wrap items-center gap-2">
              {note.keywords.map((k) => (
                <li key={k} className="flex">
                  <Badge tone="sky">{k}</Badge>
                </li>
              ))}
            </ul>
          )}
          <div className="grid gap-6">
            {note.sections.map((s, i) => (
              <Card key={i}>
                <h2 className="mb-3 font-pixel text-lg">{s.heading}</h2>
                <div className="grid gap-3">
                  {s.blocks.map((b, j) => (
                    <Block key={j} b={b} />
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex justify-center">{quizBtn}</div>
        </>
      ) : (
        <EmptyState title="노트를 준비 중이에요" description="노트가 준비되면 이곳에 정리됩니다." />
      )}
    </div>
  )
}
