import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BottleArt, GarnishArt, GlassArt, IceArt, ToolArt } from '../../../art'
import { guideCategories } from '../../../data/practical/guide'
import type { GuideEntry } from '../../../types/practical'
import { Arrows, Badge, Card, ChipGroup, EmptyState, Icon, PageHeader, Select } from '../../../ui'
import type { IceType } from '../../../types/practical'

function EntryArt({ art }: { art: NonNullable<GuideEntry['art']> }) {
  const { kind, id } = art
  if (kind === 'tool') return <ToolArt toolId={id as never} size={88} />
  if (kind === 'glass') return <GlassArt glassId={id} size={96} />
  if (kind === 'bottle') return <BottleArt ingredientId={id} size={96} />
  if (kind === 'garnish') return <GarnishArt garnishId={id} size={72} />
  return <IceArt type={id as IceType} size={88} />
}

/** 분류 이동 링크 — ChipGroup 과 같은 모양·상태 */
const chip = (on: boolean) =>
  `inline-flex min-h-11 items-center rounded-pixel border-2 border-ink px-3 font-pixel text-sm leading-none select-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink sm:min-h-9 ${
    on
      ? 'translate-x-0.5 translate-y-0.5 bg-ink text-paper'
      : 'bg-paper text-ink shadow-pixel-sm hover:bg-butter active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
  }`
const CAPTION = 'mt-3 font-pixel text-xs text-ink-soft'

export default function GuidePage() {
  const { categoryId } = useParams()
  const [group, setGroup] = useState('')
  const cat = guideCategories.find((c) => c.id === categoryId)
  if (!cat) return <EmptyState title="없는 분류예요" />
  const groups = [...new Set(cat.entries.map((e) => e.group))]
  const shown = cat.entries.filter((e) => !group || e.group === group)
  const groupOptions = [
    { value: '', label: `전체 ${cat.entries.length}` },
    ...groups.map((g) => ({ value: g, label: `${g} ${cat.entries.filter((e) => e.group === g).length}` })),
  ]

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
        <div className="mb-6">
          {groups.length + 1 > 5 ? (
            <Select label="소분류" value={group} onChange={setGroup} options={groupOptions} className="w-full sm:w-72" />
          ) : (
            <ChipGroup label="소분류" value={group} onChange={setGroup} options={groupOptions} />
          )}
        </div>
      )}
      <ul className="grid gap-4 md:grid-cols-2">
        {shown.map((e) => (
          <li key={e.id}>
            <Card className="flex h-full gap-4">
              {e.art && (
                <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-pixel border-2 border-ink bg-paper-deep">
                  <EntryArt art={e.art} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="font-pixel text-lg leading-tight">{e.nameKo}</h2>
                <p className="text-sm text-ink-soft">{e.nameEn}</p>
                <div className="mt-1"><Badge tone="lavender">{e.group}</Badge></div>
                <p className="mt-2"><Arrows text={e.summary} /></p>
                {e.features.length > 0 && (
                  <>
                    <p className={CAPTION}>특징</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{e.features.map((f, i) => <li key={i}><Arrows text={f} /></li>)}</ul>
                  </>
                )}
                {e.usage.length > 0 && (
                  <>
                    <p className={CAPTION}>사용법</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{e.usage.map((f, i) => <li key={i}><Arrows text={f} /></li>)}</ul>
                  </>
                )}
                {e.examTip && (
                  <div className="mt-4 flex gap-2 rounded-pixel border-2 border-ink bg-butter p-3 text-sm">
                    <Icon name="tip" className="mt-0.5 shrink-0" />
                    <p><b className="font-pixel font-normal">시험 팁</b> <Arrows text={e.examTip} /></p>
                  </div>
                )}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}
