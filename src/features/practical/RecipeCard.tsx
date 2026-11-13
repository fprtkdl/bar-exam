import { Link } from 'react-router-dom'
import { CocktailArt } from '../../art'
import { glassById, ingredientById, garnishById } from '../../data/practical'
import type { Recipe } from '../../types/practical'
import { Badge, Icon } from '../../ui'
import { TONE_BG } from '../../ui/tone'
import { fmtAmount } from './lib/steps'
import { BASE_LABEL, BASE_TONE, METHOD_SHORT } from './lib/labels'

const FACE = 'rounded-pixel border-2 border-ink shadow-pixel backface-hidden group-active:shadow-none'
/** 카드 전체가 누르는 대상일 때 상태: 들림·눌림·포커스 링 (Card interactive 와 같은 값) */
const PRESS =
  'group block rounded-pixel text-left transition-transform hover:-translate-x-px hover:-translate-y-px active:translate-x-1 active:translate-y-1 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none'
const META_DT = 'w-8 shrink-0 pt-px font-pixel text-xs text-ink-soft'

/** 모든 카드가 같은 높이·같은 줄 위치: 이름·영문명·메타 2행 모두 1줄 말줄임 */
function Front({ r }: { r: Recipe }) {
  return (
    <div className={`${FACE} flex flex-col overflow-hidden bg-paper`}>
      <div className={`relative flex h-44 items-end justify-center border-b-2 border-ink pb-2 ${TONE_BG[BASE_TONE[r.base]]}`}>
        <span className="absolute top-2 left-2 flex">
          <Badge tone={BASE_TONE[r.base]}>{BASE_LABEL[r.base]}</Badge>
        </span>
        <CocktailArt recipeId={r.id} size={150} />
      </div>
      <div className="p-4">
        <p title={r.nameKo} className="truncate font-pixel text-lg leading-6">{r.nameKo}</p>
        <p className="truncate text-sm leading-5 text-ink-soft">{r.nameEn}</p>
        <dl className="mt-3 space-y-1 text-sm leading-5">
          <div className="flex gap-2">
            <dt className={META_DT}>기법</dt>
            <dd className="min-w-0 truncate">{r.methods.map((m) => METHOD_SHORT[m]).join(' · ')}</dd>
          </div>
          <div className="flex gap-2">
            <dt className={META_DT}>잔</dt>
            <dd title={glassById(r.glassId)?.nameKo} className="min-w-0 truncate">{glassById(r.glassId)?.nameKo}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

/** 앞면 위에 겹쳐(absolute) 높이는 앞면과 같다. 재료가 많으면 안쪽 스크롤 */
function Back({ r }: { r: Recipe }) {
  return (
    <div className={`${FACE} absolute inset-0 flex rotate-y-180 flex-col bg-butter p-4 text-xs sm:text-sm`}>
      <p className="truncate font-pixel text-base leading-6">{r.nameKo}</p>
      <ul className="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto">
        {r.ingredients.map((x, i) => (
          <li key={i} className="flex items-end gap-1 leading-tight">
            <span className="min-w-0">{ingredientById(x.ingredientId)?.nameKo}</span>
            <span aria-hidden className="mb-1 min-w-2 flex-1 border-b-2 border-dotted border-ink-faint" />
            <span className="shrink-0 font-semibold tabular-nums">{fmtAmount(x.amount, x.unit)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-3 flex gap-2 border-t-2 border-ink pt-2 leading-tight">
        <dt className="shrink-0 pt-px font-pixel text-xs text-ink-soft">가니쉬</dt>
        <dd className="min-w-0">{r.garnishIds.length ? r.garnishIds.map((g) => garnishById(g)?.nameKo).join(', ') : '없음'}</dd>
      </dl>
    </div>
  )
}

/** memorize=false: 카드 전체가 상세 링크. true: 탭/Enter/Space 로 뒤집기 (+ 상세 링크 별도) */
export function RecipeCard({ r, memorize, flipped, onFlip }: { r: Recipe; memorize: boolean; flipped: boolean; onFlip: () => void }) {
  if (!memorize) {
    return (
      <Link to={`/practical/recipes/${r.id}`} className={PRESS}>
        <Front r={r} />
      </Link>
    )
  }
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onFlip}
        aria-pressed={flipped}
        aria-label={`${r.nameKo} 카드, ${flipped ? '뒷면(레시피) 보는 중' : '앞면. 눌러서 레시피 확인'}`}
        className={`${PRESS} w-full [perspective:900px]`}
      >
        <span
          className={`relative block [transform-style:preserve-3d] transition-transform duration-500 motion-reduce:transition-none ${flipped ? 'rotate-y-180' : ''}`}
        >
          <span aria-hidden={flipped} className="contents"><Front r={r} /></span>
          <span aria-hidden={!flipped} className="contents"><Back r={r} /></span>
        </span>
      </button>
      <Link to={`/practical/recipes/${r.id}`} className="text-link mt-1 inline-flex min-h-11 items-center justify-center gap-1 self-center text-sm">
        자세히 보기 <Icon name="arrow-right" size={12} />
      </Link>
    </div>
  )
}
