import { useParams } from 'react-router-dom'
import { CocktailArt } from '../../../art'
import { garnishById, glassById, ingredientById, recipeById } from '../../../data/practical'
import { useStore } from '../../../lib/store'
import { METHOD_LABEL } from '../../../types/practical'
import { Button, Card, EmptyState, PageHeader } from '../../../ui'
import { TONE_BG } from '../../../ui/tone'
import { BASE_LABEL, BASE_TONE } from '../lib/labels'
import { buildSteps, fmtAmount } from '../lib/steps'

export default function RecipeDetailPage() {
  const { recipeId = '' } = useParams()
  const r = recipeById(recipeId)
  const rec = useStore((s) => s.game[recipeId])
  if (!r) return <EmptyState title="없는 레시피예요" action={<Button to="/practical/recipes">레시피 목록</Button>} />
  const glass = glassById(r.glassId)
  const fact = (k: string, v: string) => (
    <div className="flex justify-between gap-3 border-b border-ink-faint py-1.5 last:border-0">
      <dt className="text-ink-soft">{k}</dt>
      <dd className="text-right font-semibold">{v}</dd>
    </div>
  )
  return (
    <>
      <PageHeader title={r.nameKo} subtitle={r.nameEn} back={{ to: '/practical/recipes', label: '레시피 카드' }} />
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="space-y-4">
          <div className={`flex justify-center rounded-pixel border-2 border-ink pb-3 pt-6 shadow-pixel ${TONE_BG[BASE_TONE[r.base]]}`}>
            <CocktailArt recipeId={r.id} size={240} />
          </div>
          <Card>
            <dl>
              {fact('기주', BASE_LABEL[r.base])}
              {fact('기법', r.methods.map((m) => METHOD_LABEL[m]).join(' → '))}
              {fact('잔', `${glass?.nameKo} (${glass?.capacityOz}oz)`)}
              {fact('잔 얼음', r.glassIce === 'cube' ? '각얼음' : r.glassIce === 'crushed' ? '크러시드 아이스' : '없음')}
              {fact('칠링', r.chill ? '필요' : '불필요')}
              {r.rim && fact('림', r.rim === 'salt' ? '소금' : '설탕')}
              {fact('가니쉬', r.garnishIds.length ? r.garnishIds.map((g) => garnishById(g)?.nameKo).join(', ') : '없음')}
            </dl>
            {r.garnishText !== '없음' && <p className="mt-1 text-sm text-ink-soft">공식 표기: {r.garnishText}</p>}
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <h2 className="mb-2 font-pixel text-lg">재료와 계량</h2>
            <table className="w-full text-left">
              <thead className="sr-only"><tr><th>재료</th><th>계량</th></tr></thead>
              <tbody>
                {r.ingredients.map((x, i) => (
                  <tr key={i} className="border-b border-ink-faint last:border-0">
                    <td className="py-1.5">{ingredientById(x.ingredientId)?.nameKo}<span className="block text-xs text-ink-soft">{ingredientById(x.ingredientId)?.nameEn}</span></td>
                    <td className="py-1.5 text-right font-semibold">{fmtAmount(x.amount, x.unit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card tone="mint">
            <h2 className="mb-2 font-pixel text-lg">만드는 순서</h2>
            <ol className="list-decimal space-y-1.5 pl-5">
              {buildSteps(r).map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </Card>
          <Card tone="butter">
            <h2 className="mb-1 font-pixel text-lg">암기 팁</h2>
            <p>{r.tip}</p>
          </Card>
          <Card>
            <h2 className="mb-1 font-pixel text-lg">내 게임 기록</h2>
            <p className="mb-3 text-ink-soft">
              {rec ? `${rec.plays}회 플레이 · 최고 ${rec.bestScore}점 · 최근 ${rec.lastScore}점` : '아직 만들어 본 적이 없어요'}
            </p>
            <Button to={`/practical/game?recipe=${r.id}`}>게임에서 만들어 보기</Button>
          </Card>
        </div>
      </div>
    </>
  )
}
