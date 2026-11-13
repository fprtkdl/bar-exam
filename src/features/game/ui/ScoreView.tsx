import type { ReactNode } from 'react'
import { CocktailArt, GlassArt } from '../../../art'
import { glassById, garnishById } from '../../../data/practical'
import type { Recipe } from '../../../types/practical'
import { Arrows, Badge, Icon } from '../../../ui'
import { formatAmount, ICE_LABEL, VIA_LABEL, type GameState, type ScoreSheet } from '../engine'
import { glassFill, ingName } from './helpers'

/** 서빙 후 채점표: 항목별 ✓/✗ + 메시지, 내 잔 vs 정답 잔, 정답 레시피 */
export function ScoreView({ recipe, sheet, game, after }: { recipe: Recipe; sheet: ScoreSheet; game: GameState; after: ReactNode }) {
  const g = game.glass
  const pass = sheet.total >= 60
  return (
    <div className="anim-pop space-y-4 p-4">
      <div className="flex flex-wrap items-baseline gap-3">
        <h2 className="font-pixel text-2xl text-ink">
          {recipe.nameKo} 채점표 <span className="text-4xl">{sheet.total}</span>
          <span className="text-base text-ink-soft"> / {sheet.max}점</span>
        </h2>
        <Badge tone={pass ? 'good' : 'bad'}>{pass ? '✓ 60점 이상' : '✗ 60점 미만'}</Badge>
      </div>

      <ul className="divide-y-2 divide-paper-deep rounded-pixel border-2 border-ink bg-paper">
        {sheet.items.map((it) => (
          <li key={it.key} className="flex gap-3 px-3 py-2">
            <span aria-hidden="true" className={`mt-0.5 font-pixel text-lg ${it.ok ? 'text-good' : 'text-bad'}`}>
              {it.ok ? '✓' : '✗'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-baseline gap-2 font-pixel text-sm text-ink">
                <span className="sr-only">{it.ok ? '정답' : '오답'}</span>
                {it.label}
                <span className={`ml-auto ${it.ok ? 'text-good' : 'text-bad'}`}>
                  {it.earned}/{it.max}
                </span>
              </p>
              <p className="text-sm break-keep text-ink-soft">{it.message.replace(/^[^:]{1,10}:\s*/, '')}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="grid gap-4 md:grid-cols-[auto_1fr]">
        <div className="flex items-end justify-center gap-4 rounded-pixel border-2 border-ink bg-bar-night px-4 pt-3 pb-2">
          <figure className="flex flex-col items-center gap-1">
            {g.glassId ? (
              <GlassArt
                glassId={g.glassId}
                fill={glassFill(game)}
                ice={g.ice}
                garnishIds={g.garnishIds}
                rim={g.rim}
                frosted={g.chill === 'chilled'}
                size={130}
                label="내가 만든 잔"
              />
            ) : (
              <div className="h-[130px] w-20" />
            )}
            <figcaption className="font-pixel text-xs text-paper">내가 만든 잔</figcaption>
          </figure>
          <figure className="flex flex-col items-center gap-1">
            <CocktailArt recipeId={recipe.id} size={130} />
            <figcaption className="font-pixel text-xs text-bar-glow">정답</figcaption>
          </figure>
        </div>
        <RecipeCard recipe={recipe} />
      </div>

      <div className="flex flex-wrap gap-2">{after}</div>
    </div>
  )
}

/** 표준 레시피 요약 (연습 모드 패널·채점표 공용) */
export function RecipeCard({ recipe, dark }: { recipe: Recipe; dark?: boolean }) {
  const soft = dark ? 'text-bar-glow' : 'text-ink-soft'
  return (
    <div className={`space-y-2 rounded-pixel border-2 border-ink p-3 text-sm ${dark ? 'bg-bar-wall text-paper' : 'bg-paper-deep text-ink'}`}>
      <p className="font-pixel">
        표준 레시피 · {recipe.nameKo} <span className={soft}>{recipe.nameEn}</span>
      </p>
      <p>
        <span className={soft}>잔</span> {glassById(recipe.glassId)?.nameKo}
        {recipe.chill && ' (칠링)'}
        {' · '}
        <span className={soft}>얼음</span> {recipe.glassIce ? ICE_LABEL[recipe.glassIce] : '없음'}
        {recipe.rim && ` · ${recipe.rim === 'salt' ? '소금' : '설탕'} 리밍`}
      </p>
      <ol className="space-y-0.5">
        {recipe.ingredients.map((r, i) => (
          <li key={i} className="flex flex-wrap gap-x-2">
            <span className="font-bold">{ingName(r.ingredientId)}</span>
            <span>{formatAmount(r.amount, r.unit)}</span>
            <span className={soft}>{VIA_LABEL[r.via]}</span>
          </li>
        ))}
      </ol>
      <p>
        <span className={soft}>가니쉬</span> {recipe.garnishIds.length ? recipe.garnishIds.map((id) => garnishById(id)?.nameKo).join(', ') : '없음'}
      </p>
      <p className={`${soft} break-keep`}>
        <Icon name="tip" className="mr-1 inline align-[-3px]" /> <Arrows text={recipe.tip} />
      </p>
    </div>
  )
}
