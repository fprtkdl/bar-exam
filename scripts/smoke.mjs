// 핵심 흐름 스모크: dev 서버를 먼저 띄운다 (npm run dev -- --port 5184 --strictPort)
// 사용: node scripts/smoke.mjs [baseUrl=http://localhost:5184]   — 시스템 Chrome 사용, 실패하면 exit 1
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright-core'

const BASE = process.argv[2] ?? 'http://localhost:5184'
const SHOTS = '.shots/smoke'
mkdirSync(SHOTS, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const errors = []
const results = []
let page

const step = async (name, fn) => {
  try {
    await fn()
    results.push(`PASS ${name}`)
  } catch (e) {
    results.push(`FAIL ${name}: ${e.message.split('\n')[0]}`)
    await page?.screenshot({ path: `${SHOTS}/fail-${results.length}.png`, fullPage: true }).catch(() => {})
  }
}
const expect = (ok, msg) => {
  if (!ok) throw new Error(msg)
}
const go = (path) => page.goto(`${BASE}/#${path}`)
const shot = (name) => page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true })
const text = (sel) => page.locator(sel).first().innerText()

const newPage = async (opts = {}) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true, ...opts })
  const p = await ctx.newPage()
  p.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`))
  p.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  return p
}

page = await newPage()
await go('/')
// dev 서버의 데이터 모듈에서 정답표를 읽는다 (일부러 틀리고 맞히기 위해)
const ANSWER = await page.evaluate(async () => {
  const m = await import('/src/data/written/index.ts')
  return Object.fromEntries(m.questions.map((q) => [q.id, q.answer]))
})
const firstTopic = await page.evaluate(async () => (await import('/src/data/written/index.ts')).units[0].topics[0].id)

/** 연습형 문제 풀기: want(i, qid) 가 true 면 정답, false 면 오답을 고른다 */
const solvePractice = async (want) => {
  for (let i = 0; ; i++) {
    const qid = (await page.locator('article').first().getAttribute('aria-labelledby')).replace('stem-', '')
    const a = ANSWER[qid]
    const pick = want(i, qid) ? a : (a + 1) % 4
    await page.locator('article button').nth(pick).click()
    const finish = page.getByRole('button', { name: '결과 보기' })
    if (await finish.isVisible()) {
      await finish.click()
      await page.waitForURL(/#\/written\/result\//)
      await page.getByText('문항별 풀이').waitFor()
      return i + 1
    }
    await page.getByRole('button', { name: '다음 문제' }).click()
  }
}

let wrongQids = []
let solved = 0

await step('토픽 노트 → 확인 문제(3개 틀림) → 결과', async () => {
  await go(`/written/topic/${firstTopic}`)
  await page.getByRole('link', { name: /확인 문제 \d+문항/ }).first().click()
  await page.waitForURL(/quiz\/topic/)
  const seen = []
  const n = await solvePractice((i, qid) => (seen.push(qid), i >= 3))
  solved += n
  wrongQids = seen.slice(0, 3)
  expect((await text('main')).includes(`${n - 3}/${n}`), '결과 화면에 맞힌 수 표시 없음')
})

await step('오답노트: 틀린 3문항이 틀린 횟수와 함께 보임', async () => {
  await page.getByRole('link', { name: '오답노트로' }).first().click()
  await page.waitForURL(/written\/wrong/)
  await page.getByText('✗ 1번 틀림').first().waitFor()
  expect((await page.getByText('✗ 1번 틀림').count()) === 3, '“1번 틀림” 배지 3개가 아님')
})

await step('틀린 문제만 다시 풀기 1회차(1개만 맞힘) → 2회차 표시', async () => {
  await page.getByRole('button', { name: '틀린 문제만 다시 풀기' }).click()
  await page.waitForURL(/quiz\/retry\/r1/)
  solved += await solvePractice((i) => i === 0)
  await go('/written/wrong')
  await page.getByText('현재 2회차').waitFor()
  const t = await text('main')
  expect(t.includes('현재 2회차 · 남은 2문항'), '2회차·남은 2문항 표시 없음')
  expect((await page.getByText('✗ 2번 틀림').count()) === 2, '“2번 틀림” 2개가 아님')
  await shot('wrong-round2-1280')
  await page.setViewportSize({ width: 390, height: 844 })
  await shot('wrong-round2-390')
  await page.setViewportSize({ width: 1280, height: 900 })
})

await step('2회차 전부 맞힘 → 올클리어', async () => {
  await page.getByRole('button', { name: '2회차 이어서 풀기' }).click()
  await page.waitForURL(/quiz\/retry\/r2/)
  solved += await solvePractice(() => true)
  await go('/written/wrong')
  await page.getByText('올클리어 기록').waitFor()
  expect((await text('main')).includes('2회차 만에 올클리어'), '올클리어 기록 없음')
  await shot('wrong-allclear-1280')
  await page.setViewportSize({ width: 390, height: 844 })
  await shot('wrong-allclear-390')
  await page.setViewportSize({ width: 1280, height: 900 })
})

await step('단원평가 1세트 완료', async () => {
  await go('/written/tests')
  await page.locator('a[href*="/written/quiz/unit/"]').first().click()
  await page.waitForURL(/quiz\/unit/)
  solved += await solvePractice((i) => i % 3 !== 0)
  expect((await text('main')).includes('단원별'), '단원평가 결과 화면 아님')
})

await step('모의고사 1회: 30문항 → 새로고침 후 답안 유지 → 60문항 제출 → 합격 여부', async () => {
  await go('/written/mock/')
  await go('/written/quiz/mock/1')
  const answerAt = async (i) => {
    await page.getByRole('button', { name: new RegExp(`^${i + 1}번,`) }).click()
    const qid = (await page.locator('article').first().getAttribute('aria-labelledby')).replace('stem-', '')
    const a = ANSWER[qid]
    await page.locator('article button').nth(i % 4 === 0 ? (a + 1) % 4 : a).click() // 25% 오답
  }
  for (let i = 0; i < 30; i++) await answerAt(i)
  await page.reload()
  await page.getByRole('timer').waitFor()
  expect((await text('main')).includes('응답 30/60'), '새로고침 후 응답 수 유지 안 됨')
  for (let i = 30; i < 60; i++) await answerAt(i)
  await page.getByRole('button', { name: '답안 제출' }).first().click()
  await page.getByRole('button', { name: '제출하기' }).click()
  await page.waitForURL(/written\/result\//)
  await page.getByText('문항별 풀이').waitFor()
  solved += 60
  const t = await text('main')
  expect(t.includes('75점') && t.includes('✓ 합격'), `점수·합격 표시 이상: ${t.slice(0, 120)}`)
})

await step('통계: 단원별·유형별 수치 반영', async () => {
  await go('/written/stats')
  await page.getByText('단원별 정답률').waitFor()
  const t = await text('main')
  expect(t.includes('단원별 정답률') && t.includes('유형별 정답률'), '막대 차트 없음')
  const tile = await page.locator('text=푼 문항').locator('..').innerText()
  expect(tile.includes(String(solved)), `푼 문항 ${solved} 이 아님: ${tile}`)
  expect(t.includes('합격선 60'), '모의고사 추이 합격선 라벨 없음')
  await shot('stats-1280')
})

await step('레시피 카드 암기 모드 뒤집기', async () => {
  await go('/practical/recipes')
  await page.getByRole('button', { name: /암기 모드/ }).click()
  const card = page.getByRole('button', { name: /블랙 러시안 카드/ })
  await card.click()
  expect((await card.getAttribute('aria-pressed')) === 'true', '카드가 뒤집히지 않음')
})

await step('레시피 상세 → 게임에서 만들기 → 서빙 → 채점표 → 상세에 기록', async () => {
  await go('/practical/recipes/black-russian')
  await page.getByRole('link', { name: '게임에서 만들어 보기' }).click()
  await page.waitForURL(/practical\/game\?recipe=black-russian/)
  await page.locator('[data-id="old-fashioned"]').click()
  await page.getByRole('tab', { name: '얼음' }).click()
  await page.getByRole('button', { name: '서빙 잔에 얼음 넣기' }).click()
  await page.getByRole('tab', { name: '술·재료' }).click()
  const pour = async (search, id, amount) => {
    await page.getByLabel('재료 검색').fill(search)
    await page.locator(`[data-id="${id}"]`).click()
    await page.getByRole('group', { name: '양' }).getByRole('button', { name: amount, exact: true }).click()
    await page.getByRole('button', { name: `서빙 잔에 ${amount} 따르기` }).click()
  }
  await pour('보드카', 'vodka', '1oz')
  await pour('커피', 'coffee-liqueur', '1/2oz')
  await shot('game-making-1280')
  await page.getByRole('button', { name: /손님에게 내기/ }).click()
  await page.getByText('100').first().waitFor()
  await shot('game-score-1280')
  await go('/practical/recipes/black-russian')
  expect((await text('main')).includes('1회 플레이 · 최고 100점'), '레시피 상세에 게임 기록 없음')
})

await step('설정: 내보내기 → 초기화 → 가져오기 복원', async () => {
  await go('/settings')
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'JSON 내려받기' }).click()])
  const file = `${SHOTS}/export.json`
  await dl.saveAs(file)
  await page.getByRole('button', { name: '기록 모두 지우기' }).click()
  await page.getByRole('button', { name: '모두 지우기', exact: true }).click()
  const n = () => page.evaluate(() => JSON.parse(localStorage.getItem('bar-exam:v1')).state.attempts.length)
  expect((await n()) === 0, '초기화 안 됨')
  await page.locator('#import-file').setInputFiles(file)
  await page.getByText('✓ 기록을 가져왔어요.').waitFor()
  expect((await n()) === 5, `복원된 시도 수 ${await n()}`)
})

await step('게임 시험 모드 7분 시간 초과 → 결과 화면', async () => {
  const p2 = await newPage()
  await p2.clock.install()
  page = p2
  await go('/practical/game')
  await page.getByRole('button', { name: '시험 시작' }).click()
  await page.getByRole('timer').waitFor()
  await page.locator('section[aria-label="바 작업대"] [data-id]').first().waitFor().catch(() => {})
  await page.getByRole('tab', { name: '잔' }).click()
  await page.clock.fastForward('07:01')
  await page.getByRole('button', { name: '시험 결과 보기' }).click()
  const t = await text('main')
  expect(t.includes('시험 결과 · 평균 0점') && t.includes('✗ 합격선(60점) 미만'), `시간 초과 결과 이상: ${t.slice(0, 200)}`)
  expect((t.match(/0점/g) ?? []).length >= 3, '잔별 0점 표시 없음')
  await shot('game-timeout-1280')
  const rec = await page.evaluate(() => JSON.parse(localStorage.getItem('bar-exam:v1') ?? '{"state":{"game":{}}}').state.game)
  expect(Object.keys(rec).length === 0, '손대지 않은 잔이 게임 기록에 남음')
})

await browser.close()
for (const r of results) console.log(r)
console.log(errors.length ? `콘솔 에러 ${errors.length}건:\n${errors.join('\n')}` : '콘솔 에러 0')
process.exit(results.some((r) => r.startsWith('FAIL')) || errors.length ? 1 : 0)
