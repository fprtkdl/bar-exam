import { Link } from 'react-router-dom'
import { CocktailArt } from '../../art'
import { glassById, ingredientById, garnishById } from '../../data/practical'
import { METHOD_LABEL, type Recipe } from '../../types/practical'
import { Badge } from '../../ui'
import { TONE_BG } from '../../ui/tone'
import { fmtAmount } from './lib/steps'
import { BASE_LABEL, BASE_TONE } from './lib/labels'

const FACE = 'rounded-pixel border-2 border-ink shadow-pixel [grid-area:1/1] backface-hidden'

function Front({ r }: { r: Recipe }) {
  return (
    <div className={`${FACE} flex flex-col overflow-hidden bg-paper`}>
      <div className={`flex h-44 items-end justify-center border-b-2 border-ink pb-2 ${TONE_BG[BASE_TONE[r.base]]}`}>
        <CocktailArt recipeId={r.id} size={150} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 text-left">
        <div>
          <p className="font-pixel text-lg leading-tight">{r.nameKo}</p>
          <p className="text-sm text-ink-soft">{r.nameEn}</p>
        </div>
        <div className="mt-auto flex flex-wrap gap-1">
          <Badge tone={BASE_TONE[r.base]}>{BASE_LABEL[r.base]}</Badge>
          <Badge tone="paper">{r.methods.map((m) => METHOD_LABEL[m].split(' ')[0]).join('+')}</Badge>
          <Badge tone="paper">{glassById(r.glassId)?.nameKo}</Badge>
        </div>
      </div>
    </div>
  )
}

function Back({ r }: { r: Recipe }) {
  return (
    <div className={`${FACE} flex rotate-y-180 flex-col gap-2 bg-butter p-3 text-left text-sm`}>
      <p className="font-pixel text-base">{r.nameKo}</p>
      <ul className="space-y-0.5">
        {r.ingredients.map((x, i) => (
          <li key={i} className="flex justify-between gap-2">
            <span>{ingredientById(x.ingredientId)?.nameKo}</span>
            <span className="shrink-0 font-semibold">{fmtAmount(x.amount, x.unit)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-auto border-t-2 border-ink pt-2">
        {glassById(r.glassId)?.nameKo} · {r.garnishIds.length ? r.garnishIds.map((g) => garnishById(g)?.nameKo).join(', ') : '가니쉬 없음'}
      </p>
    </div>
  )
}

/** memorize=false: 카드 전체가 상세 링크. true: 탭/Enter/Space 로 뒤집기 (+ 상세 링크 별도) */
export function RecipeCard({ r, memorize, flipped, onFlip }: { r: Recipe; memorize: boolean; flipped: boolean; onFlip: () => void }) {
  const stack = 'grid [transform-style:preserve-3d] transition-transform duration-500 motion-reduce:transition-none'
  if (!memorize) {
    return (
      <Link to={`/practical/recipes/${r.id}`} className="grid h-full transition-transform hover:-translate-y-0.5">
        <Front r={r} />
      </Link>
    )
  }
  return (
    <div className="flex h-full flex-col gap-2">
      <button
        type="button"
        onClick={onFlip}
        aria-pressed={flipped}
        aria-label={`${r.nameKo} 카드, ${flipped ? '뒷면(레시피) 보는 중' : '앞면. 눌러서 레시피 확인'}`}
        className="flex-1 [perspective:900px]"
      >
        <span className={`${stack} h-full ${flipped ? 'rotate-y-180' : ''}`}>
          <span aria-hidden={flipped} className="contents"><Front r={r} /></span>
          <span aria-hidden={!flipped} className="contents"><Back r={r} /></span>
        </span>
      </button>
      <Link to={`/practical/recipes/${r.id}`} className="text-center text-sm text-ink-soft underline underline-offset-4">
        자세히 보기
      </Link>
    </div>
  )
}
