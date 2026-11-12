import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BottleArt, GarnishArt, GlassArt, IceArt, ToolArt } from '../../../art'
import { guideCategories } from '../../../data/practical/guide'
import type { GuideEntry } from '../../../types/practical'
import { Badge, Card, EmptyState, PageHeader } from '../../../ui'
import type { IceType } from '../../../types/practical'

function EntryArt({ art }: { art: NonNullable<GuideEntry['art']> }) {
  const { kind, id } = art
  if (kind === 'tool') return <ToolArt toolId={id as never} size={88} />
  if (kind === 'glass') return <GlassArt glassId={id} size={96} />
  if (kind === 'bottle') return <BottleArt ingredientId={id} size={96} />
  if (kind === 'garnish') return <GarnishArt garnishId={id} size={72} />
  return <IceArt type={id as IceType} size={88} />
}

const chip = (on: boolean) =>
  `inline-flex min-h-9 items-center rounded-pixel border-2 border-ink px-3 font-pixel text-sm ${on ? 'bg-ink text-paper' : 'bg-paper hover:bg-butter'}`

export default function GuidePage() {
  const { categoryId } = useParams()
  const [group, setGroup] = useState('')
  const cat = guideCategories.find((c) => c.id === categoryId)
  if (!cat) return <EmptyState title="없는 분류예요" />
  const groups = [...new Set(cat.entries.map((e) => e.group))]
  const shown = cat.entries.filter((e) => !group || e.group === group)

  return (
    <>
      <PageHeader title={cat.title} subtitle={cat.intro} back={{ to: '/practical', label: '실기' }} />
      <nav aria-label="도감 분류" className="mb-4 flex flex-wrap gap-2">
        {guideCategories.map((c) => (
          <Link key={c.id} to={`/practical/guide/${c.id}`} onClick={() => setGroup('')} aria-current={c.id === cat.id ? 'page' : undefined} className={chip(c.id === cat.id)}>
            {c.title}
          </Link>
        ))}
      </nav>
      {groups.length > 1 && (
        <div role="group" aria-label="소분류" className="mb-5 flex flex-wrap gap-2">
          <button type="button" aria-pressed={!group} onClick={() => setGroup('')} className={chip(!group)}>전체 {cat.entries.length}</button>
          {groups.map((g) => (
            <button key={g} type="button" aria-pressed={group === g} onClick={() => setGroup(g)} className={chip(group === g)}>{g}</button>
          ))}
        </div>
      )}
      <ul className="grid gap-4 md:grid-cols-2">
        {shown.map((e) => (
          <li key={e.id}>
            <Card className="flex h-full gap-4">
              {e.art && (
                <div className="flex w-24 shrink-0 items-start justify-center rounded-pixel border-2 border-ink bg-paper-deep p-2 self-start">
                  <EntryArt art={e.art} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="font-pixel text-lg leading-tight">{e.nameKo}</h2>
                <p className="text-sm text-ink-soft">{e.nameEn}</p>
                <div className="mt-1"><Badge tone="lavender">{e.group}</Badge></div>
                <p className="mt-2">{e.summary}</p>
                {e.features.length > 0 && (
                  <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm">{e.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
                )}
                {e.usage.length > 0 && (
                  <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm">{e.usage.map((f, i) => <li key={i}>{f}</li>)}</ul>
                )}
                {e.examTip && <p className="mt-3 rounded-pixel border-2 border-ink bg-butter p-2 text-sm"><b>시험 팁</b> {e.examTip}</p>}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}
