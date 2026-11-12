import { useState } from 'react'
import { BarScene, BottleArt, CocktailArt, CustomerArt, GarnishArt, GlassArt, IceArt, ToolArt } from '../../art'
import { garnishes, glasses, ingredients, recipes } from '../../data/practical'
import { TOOL_IDS } from '../../types/practical'
import { PageHeader } from '../../ui'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-pixel text-lg text-ink">{title}</h2>
      <div className="flex flex-wrap items-end gap-3">{children}</div>
    </section>
  )
}

function Cell({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <figure className="flex w-[104px] flex-col items-center gap-1 rounded-pixel border-2 border-ink bg-paper p-2 shadow-pixel-sm">
      <div className="flex h-[124px] items-end">{children}</div>
      <figcaption className="min-h-[2rem] text-center text-xs leading-tight text-ink-soft">{name}</figcaption>
    </figure>
  )
}

const DEMO_LAYERS = [
  { color: '#c0102c', ratio: 1 },
  { color: '#f7a21b', ratio: 3 },
  { color: '#8e1028', ratio: 0.6 },
]

/** 개발용: 모든 일러스트를 한 화면에 */
export default function ArtGalleryPage() {
  const [level, setLevel] = useState(0.6)
  return (
    <div>
      <PageHeader title="일러스트 갤러리" subtitle="개발 확인용 — 잔·레시피·병·도구·가니쉬·배경" />

      <Section title="잔 (빈 잔)">
        {glasses.map((g) => (
          <Cell key={g.id} name={g.nameKo}>
            <GlassArt glassId={g.id} size={120} />
          </Cell>
        ))}
      </Section>

      <Section title={`채움 테스트 (level ${level.toFixed(2)}, 얼음·층)`}>
        <label className="w-full text-sm text-ink">
          level{' '}
          <input type="range" min={0} max={1} step={0.05} value={level} onChange={(e) => setLevel(Number(e.target.value))} />
        </label>
        {glasses.map((g, i) => (
          <Cell key={g.id} name={g.nameKo}>
            <GlassArt glassId={g.id} size={120} fill={{ layers: DEMO_LAYERS, level }} ice={i % 3 === 0 ? 'cube' : i % 3 === 1 ? 'crushed' : null} />
          </Cell>
        ))}
      </Section>

      <Section title="레시피 완성 그림 (40)">
        {recipes.map((r) => (
          <Cell key={r.id} name={r.nameKo}>
            <CocktailArt recipeId={r.id} size={120} />
          </Cell>
        ))}
      </Section>

      <Section title="가니쉬">
        {garnishes.map((g) => (
          <Cell key={g.id} name={g.nameKo}>
            <GarnishArt garnishId={g.id} size={64} />
          </Cell>
        ))}
        <Cell name="큐브드 아이스">
          <IceArt type="cube" />
        </Cell>
        <Cell name="크러시드 아이스">
          <IceArt type="crushed" />
        </Cell>
      </Section>

      <Section title="병">
        {ingredients.map((g) => (
          <Cell key={g.id} name={g.nameKo}>
            <BottleArt ingredientId={g.id} size={110} />
          </Cell>
        ))}
      </Section>

      <Section title="도구">
        {TOOL_IDS.map((id) => (
          <Cell key={id} name={id}>
            <ToolArt toolId={id} size={88} />
          </Cell>
        ))}
      </Section>

      <Section title="손님">
        {[0, 1, 2, 3, 4, 5].map((v) => (
          <Cell key={v} name={`${v} ${['neutral', 'happy', 'sad'][v % 3]}`}>
            <CustomerArt variant={v} mood={(['neutral', 'happy', 'sad'] as const)[v % 3]} size={100} />
          </Cell>
        ))}
      </Section>

      <section className="mt-8">
        <h2 className="mb-3 font-pixel text-lg text-ink">바 배경</h2>
        <div className="overflow-hidden rounded-pixel border-2 border-ink shadow-pixel">
          <BarScene>
            <CustomerArt variant={1} mood="happy" size={130} />
            <CocktailArt recipeId="tequila-sunrise" size={150} />
            <GlassArt glassId="highball" size={150} fill={{ layers: DEMO_LAYERS, level }} ice="cube" garnishIds={['lemon-wedge']} />
          </BarScene>
        </div>
      </section>
    </div>
  )
}
