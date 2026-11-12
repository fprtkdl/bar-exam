import { examMeta, questionById, units } from '../../../data/written'
import { useStore } from '../../../lib/store'
import { QUESTION_TYPE_LABEL, type QuestionType } from '../../../types/written'
import { Badge, Button, Card, EmptyState, PageHeader, ProgressBar, StatTile } from '../../../ui'
import { Rich } from '../quiz/QuestionView'
import { byType, byUnit, mockTrend, rateBy, topWrong, weakTopics, type MockPoint } from '../stats/selectors'

const TYPE_DESC: Record<QuestionType, string> = {
  recall: '정의·용어·수치·원산지를 그대로 떠올리는 문제',
  concept: '원리·과정·이유를 이해했는지 묻는 문제',
  compare: '여러 보기 중 옳은 것·틀린 것을 가려내는 문제',
  calc: '도수·용량 환산·원가를 계산하는 문제',
  recipe: '레시피·기법·글라스·가니쉬를 묻는 문제',
  english: '영어 지문·회화·용어를 읽고 푸는 문제',
  practice: '서비스·위생·영업장 관리 상황을 판단하는 문제',
}
const topicTitle = (id: string) => units.flatMap((u) => u.topics).find((t) => t.id === id)?.title ?? id

function Bars({ title, rows }: { title: string; rows: { label: string; seen: number; correct: number; rate: number }[] }) {
  return (
    <Card>
      <h2 className="mb-3 font-pixel">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-ink-soft">아직 푼 문제가 없어요</p>
      ) : (
        <ul className="grid gap-2">
          {rows.map((r) => (
            <li key={r.label} className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:items-center sm:gap-3">
              <span className="text-sm">{r.label}</span>
              <ProgressBar value={r.correct} max={r.seen} label={`${r.label} 정답 수`} showValue tone={r.rate >= examMeta.passScore ? 'mint' : 'peach'} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function Trend({ pts }: { pts: MockPoint[] }) {
  const W = 360, H = 180, L = 30, R = 10, T = 16, B = 16
  const x = (i: number) => (pts.length === 1 ? (L + W - R) / 2 : L + 24 + (i * (W - L - R - 48)) / (pts.length - 1))
  const y = (s: number) => T + ((100 - s) * (H - T - B)) / 100
  return (
    <Card>
      <h2 className="mb-2 font-pixel">모의고사 점수 추이</h2>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`모의고사 ${pts.length}회 점수 추이. 점선은 합격선 ${examMeta.passScore}점`} className="w-full max-w-lg">
        {[0, 50, 100].map((g) => (
          <g key={g}>
            <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke="var(--color-ink-faint)" strokeWidth="1" />
            <text x={L - 4} y={y(g) + 4} textAnchor="end" fontSize="13" fill="var(--color-ink-soft)">{g}</text>
          </g>
        ))}
        <line x1={L} x2={W - R} y1={y(examMeta.passScore)} y2={y(examMeta.passScore)} stroke="var(--color-bad)" strokeWidth="2" strokeDasharray="5 4" />
        <text x={L + 4} y={y(examMeta.passScore) - 4} textAnchor="start" fontSize="13" fill="var(--color-bad)">합격선 {examMeta.passScore}</text>
        <polyline fill="none" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinejoin="round" points={pts.map((p, i) => `${x(i)},${y(p.score)}`).join(' ')} />
        {pts.map((p, i) => (
          <g key={p.id}>
            <circle cx={x(i)} cy={y(p.score)} r="5" fill={p.score >= examMeta.passScore ? 'var(--color-mint)' : 'var(--color-peach)'} stroke="var(--color-ink)" strokeWidth="2" />
            <text x={x(i)} y={y(p.score) - 9} textAnchor="middle" fontSize="13" fill="var(--color-ink)">{p.score}</text>
          </g>
        ))}
      </svg>
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer">표로 보기</summary>
        <table className="mt-2 w-full text-left">
          <thead>
            <tr><th className="py-1">회차</th><th>점수</th><th>결과</th></tr>
          </thead>
          <tbody>
            {pts.map((p) => (
              <tr key={p.id} className="border-t border-ink-faint">
                <td className="py-1">{p.title}</td><td>{p.score}점</td><td>{p.score >= examMeta.passScore ? '✓ 합격' : '✗ 불합격'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </Card>
  )
}

export default function StatsPage() {
  const attempts = useStore((s) => s.attempts)
  const wrong = useStore((s) => s.wrong)

  const unitR = byUnit(attempts)
  const typeR = byType(attempts)
  const seen = Object.values(typeR).reduce((n, r) => n + r.seen, 0)
  const correct = Object.values(typeR).reduce((n, r) => n + r.correct, 0)
  const mocks = mockTrend(attempts)
  const best = mocks.length ? Math.max(...mocks.map((m) => m.score)) : null
  const avg = mocks.length ? Math.round(mocks.reduce((n, m) => n + m.score, 0) / mocks.length) : null
  const weakTypes = Object.entries(typeR).filter(([, r]) => r.seen >= 3).sort((a, b) => a[1].rate - b[1].rate).slice(0, 2)
  const typeTopic = rateBy(attempts, (m) => `${m.type}|${m.topicId}`)
  const weak = weakTopics(attempts)
  const wrongTop = topWrong(wrong)

  if (seen === 0) {
    return (
      <>
        <PageHeader title="학습 통계" back={{ to: '/written', label: '필기' }} />
        <EmptyState title="아직 통계를 낼 기록이 없어요" description="확인 문제나 단원평가를 풀면 단원·유형별 약점이 여기에 나타납니다." action={<Button to="/written/tests">단원평가 풀기</Button>} />
      </>
    )
  }

  return (
    <>
      <PageHeader title="학습 통계" subtitle="푼 기록에서 계산한 나의 강점과 약점이에요." back={{ to: '/written', label: '필기' }} />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="푼 문항" value={seen} />
        <StatTile label="정답률" value={`${Math.round((correct / seen) * 100)}%`} tone="mint" />
        <StatTile label="모의고사 최고 / 평균" value={best === null ? '-' : `${best} / ${avg}`} hint={mocks.length ? `${mocks.length}회 응시` : '아직 응시 전'} tone="butter" />
        <StatTile
          label="합격선 대비"
          value={avg === null ? '-' : `${avg - examMeta.passScore >= 0 ? '+' : ''}${avg - examMeta.passScore}점`}
          hint={avg === null ? `합격선 ${examMeta.passScore}점` : avg >= examMeta.passScore ? '✓ 평균 합격권' : '✗ 평균 합격선 아래'}
          tone={avg === null ? 'paper' : avg >= examMeta.passScore ? 'good' : 'bad'}
        />
      </div>

      {mocks.length > 0 && <div className="mb-6"><Trend pts={mocks} /></div>}

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Bars title="단원별 정답률" rows={units.filter((u) => unitR[u.id]).map((u) => ({ label: u.title, ...unitR[u.id] }))} />
        <Bars title="유형별 정답률" rows={Object.entries(typeR).map(([t, r]) => ({ label: QUESTION_TYPE_LABEL[t as QuestionType], ...r }))} />
      </div>

      <h2 className="mb-3 font-pixel text-xl">자주 틀리는 유형</h2>
      {weakTypes.length === 0 ? (
        <p className="mb-6 text-sm text-ink-soft">유형별로 3문항 이상 풀면 가장 약한 유형을 알려 드려요.</p>
      ) : (
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          {weakTypes.map(([t, r]) => {
            const best = Object.entries(typeTopic).filter(([k]) => k.startsWith(`${t}|`)).sort((a, b) => a[1].rate - b[1].rate)[0]
            const topicId = best?.[0].split('|')[1]
            return (
              <Card key={t} tone="peach">
                <p className="font-pixel text-lg">{QUESTION_TYPE_LABEL[t as QuestionType]} · 정답률 {r.rate}%</p>
                <p className="mt-1 text-sm">{TYPE_DESC[t as QuestionType]}</p>
                {topicId && (
                  <div className="mt-3">
                    <Button variant="secondary" size="sm" to={`/written/topic/${topicId}`}>
                      {topicTitle(topicId)} 노트 보기
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-1 font-pixel">약점 토픽 TOP5</h2>
          <p className="mb-3 text-xs text-ink-soft">3문항 이상 푼 토픽 중 정답률이 낮은 순</p>
          {weak.length === 0 ? (
            <p className="text-sm text-ink-soft">토픽별로 3문항 이상 풀면 나타납니다.</p>
          ) : (
            <ol className="grid gap-3">
              {weak.map((w) => (
                <li key={w.topicId}>
                  <p className="text-sm font-semibold">{topicTitle(w.topicId)} <span className="font-normal text-ink-soft">({w.correct}/{w.seen}, {w.rate}%)</span></p>
                  <div className="mt-1 flex gap-2">
                    <Button variant="secondary" size="sm" to={`/written/topic/${w.topicId}`}>노트</Button>
                    <Button variant="secondary" size="sm" to={`/written/quiz/topic/${w.topicId}`}>확인 문제</Button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>
        <Card>
          <h2 className="mb-3 font-pixel">자주 틀린 문항 TOP10</h2>
          {wrongTop.length === 0 ? (
            <p className="text-sm text-ink-soft">틀린 문항이 없어요.</p>
          ) : (
            <ol className="grid gap-2">
              {wrongTop.map((w) => (
                <li key={w.qid} className="flex items-start gap-2 text-sm">
                  <Badge tone="peach">✗ {w.wrongCount}</Badge>
                  <span className="line-clamp-2 flex-1"><Rich text={questionById[w.qid].stem} /></span>
                </li>
              ))}
            </ol>
          )}
          <div className="mt-3"><Button variant="secondary" size="sm" to="/written/wrong">오답노트로</Button></div>
        </Card>
      </div>
    </>
  )
}
