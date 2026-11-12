import { CocktailArt } from '../../../art'
import { practicalMeta } from '../../../data/practical'
import { guideCategories } from '../../../data/practical/guide'
import { Card, PageHeader, StatTile } from '../../../ui'
import type { Tone } from '../../../ui'

const TONES: Tone[] = ['sky', 'peach', 'lavender', 'mint', 'butter', 'sky', 'peach']

export default function PracticalHubPage() {
  return (
    <>
      <PageHeader title="실기" subtitle="도구와 재료를 익히고, 표준 레시피를 카드로 외운 뒤, 게임으로 직접 만들어 보세요." />

      <section aria-label="실기 시험 안내" className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="레시피" value={`${practicalMeta.recipeCount}종`} />
        <StatTile label="출제" value={`${practicalMeta.examDrinks}잔`} hint="추첨으로 출제" />
        <StatTile label="제한 시간" value={`${practicalMeta.examMinutes}분`} hint="3잔 합계" />
        <StatTile label="기준 연도" value={`${practicalMeta.standardYear}년`} hint="표준 레시피" />
      </section>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Card to="/practical/recipes" tone="peach" className="flex items-center gap-4">
          <CocktailArt recipeId="manhattan" size={110} />
          <div>
            <p className="font-pixel text-xl">레시피 카드</p>
            <p className="mt-1 text-sm">{practicalMeta.recipeCount}종을 카드로 보고, 암기 모드로 뒤집어 확인</p>
          </div>
        </Card>
        <Card to="/practical/game" tone="lavender" className="flex flex-col justify-center">
          <p className="font-pixel text-xl">바텐더 게임</p>
          <p className="mt-1 text-sm">손님 주문대로 직접 만들어 점수를 받아요</p>
        </Card>
      </div>

      <h2 className="mb-3 font-pixel text-xl">도감</h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {guideCategories.map((c, i) => (
          <li key={c.id}>
            <Card to={`/practical/guide/${c.id}`} tone={TONES[i]} className="h-full">
              <p className="font-pixel text-lg">{c.title}</p>
              <p className="mt-1 text-sm">{c.entries.length}항목</p>
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}
