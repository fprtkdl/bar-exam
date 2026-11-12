# 조주기능사 필기·실기 학습 사이트 구현 플랜

> 실행 방식: 컨트롤러(메인 세션)가 이 플랜으로 서브에이전트를 단계별 병렬 투입한다.
> 에이전트는 **§0~§5 공통 + 자기 Task 절만** 읽는다. 다른 Task 절은 읽지 않는다.

**Goal:** 조주기능사 필기(목차 노트·확인 문제·단원평가·모의고사·오답노트·통계)와 실기(도감·레시피 카드·바텐더 게임)를 한 곳에서 공부하는 한국어 정적 웹사이트.

**Architecture:** 백엔드 없는 SPA. 모든 콘텐츠는 타입이 붙은 TS 데이터 모듈, 학습 기록은 브라우저 localStorage 에만 저장. 일러스트는 코드로 그리는 SVG 컴포넌트(잔·액체·얼음·가니쉬 조합)이며, 나중에 도트 이미지로 갈아끼울 수 있는 override 맵을 둔다.

**Tech Stack:** Vite + React 18+ + TypeScript(strict) · react-router-dom(HashRouter) · zustand(persist) · Tailwind CSS v4(`@tailwindcss/vite`) · vitest(+happy-dom) · playwright-core(시스템 Chrome 으로 스크린샷) · 폰트 npm 패키지 `pretendard`, `galmuri` (번들 포함).

---

## §0 Global Constraints

- UI 문구·콘텐츠는 전부 한국어(칵테일·재료 영문명 병기).
- 외부 요청 0: 분석 도구·CDN·외부 폰트·외부 이미지 금지. 계정·서버 없음. 기록은 localStorage `bar-exam:v1` 만.
- 개인정보 금지: 사이트·문서·커밋 어디에도 사용자 실명·이메일·로컬 경로(`/Users/...`) 넣지 않는다. 비밀키·`.env` 없음.
- 저작권: Q-net 기출문제 원문 복사 금지. 문제는 출제기준 범위의 **사실에 기반한 창작 문제**. 타인의 이미지·일러스트 파일을 저장소에 넣지 않는다.
- 정확성: 사실·수치·레시피는 출처 2곳 이상 교차 확인. 불확실하면 넣지 않거나 리포트에 표시. 공식 기준일을 데이터에 기록.
- 의존성은 Tech Stack 목록만. 추가 필요하면 설치하지 말고 리포트에 적는다 (T1 만 `npm install` 실행).
- 데이터 계약은 `src/types/{written,practical,storage}.ts`. 수정 금지(필요하면 리포트). 예외: T3 은 `practical.ts` 의 id 관련 주석만 손댈 수 있다.
- 접근성: 버튼은 `<button>`, 키보드 조작 가능, 색만으로 정오 표시하지 않기(아이콘·문구 병기), 본문 대비 4.5:1 이상.
- 반응형: 360px 폭에서 가로 스크롤 없음.
- 사이트 푸터에 “비공식 학습용 사이트 · 출제기준/레시피 기준일” 표기.

## §1 디렉터리와 소유권

```
src/types/**                      컨트롤러 (작성 완료)
src/app/**  src/ui/**  src/styles/**  src/lib/**  scripts/**  루트 설정   T1
src/data/written/syllabus.ts, examMeta.ts                         T2
src/data/written/notes/{unitId}.ts, questions/{unitId}.ts         T4-*
src/data/written/index.ts (import.meta.glob 자동 수집)            T1
src/data/practical/{ingredients,glasses,garnishes,recipes,index}.ts  T3
src/data/practical/guide/*.ts                                     T8
src/art/**  src/features/dev/ArtGalleryPage.tsx                   T6
src/features/written/quiz/**, pages/{WrittenHub,Unit,Topic,UnitTests,MockList,Quiz,Result}Page.tsx  T5
src/features/written/pages/{WrongNote,Stats}Page.tsx, written/stats/**, home/**, settings/**   T11
src/features/practical/**                                         T10
src/features/game/engine/**                                       T7
src/features/game/ui/**, game/GamePage.tsx                        T9
docs/research/**                  조사한 에이전트
```

자기 소유 경로 밖 파일은 수정하지 않는다. 밖에서 버그를 찾으면 리포트에 `파일:줄 + 제안`.

## §2 라우트 ↔ 페이지 파일 (T1 이 전부 stub 으로 만들고 lazy 라우팅, 이후 소유자가 내용 교체)

| 경로 | 파일 (default export) |
|---|---|
| `/` | `src/features/home/HomePage.tsx` |
| `/written` | `src/features/written/pages/WrittenHubPage.tsx` |
| `/written/unit/:unitId` | `.../UnitPage.tsx` |
| `/written/topic/:topicId` | `.../TopicPage.tsx` |
| `/written/tests` | `.../UnitTestsPage.tsx` |
| `/written/mock` | `.../MockListPage.tsx` |
| `/written/quiz/:kind/:refId` | `.../QuizPage.tsx` (kind = topic·unit·mock·retry) |
| `/written/result/:attemptId` | `.../ResultPage.tsx` |
| `/written/wrong` | `.../WrongNotePage.tsx` |
| `/written/stats` | `.../StatsPage.tsx` |
| `/practical` | `src/features/practical/pages/PracticalHubPage.tsx` |
| `/practical/guide/:categoryId` | `.../GuidePage.tsx` |
| `/practical/recipes` | `.../RecipesPage.tsx` |
| `/practical/recipes/:recipeId` | `.../RecipeDetailPage.tsx` |
| `/practical/game` | `src/features/game/GamePage.tsx` |
| `/settings` | `src/features/settings/SettingsPage.tsx` |
| `/dev/art` | `src/features/dev/ArtGalleryPage.tsx` |

`src/app/routes.tsx` 는 T1 이후 아무도 수정하지 않는다.

## §3 스토어 (T1 구현: `src/lib/store.ts` + 순수 로직 `src/lib/progress.ts`)

`useStore` = `PersistedState`(src/types/storage.ts) + 액션:

```ts
recordAttempt(input: { kind: AttemptKind; refId: string; title: string; startedAt: number; answers: AnswerRecord[] }): AttemptRecord
startRetry(): RetryCycle | null      // 진행 중 사이클 있으면 그대로 반환. 없으면 cleared=false 인 오답 전부로 1회차 생성. 오답 0개면 null
abandonRetry(): void
recordGame(recipeId: string, score: number): void
resetAll(): void
importState(json: string): boolean   // 형식 검증 실패 시 false, 기존 데이터 유지
exportState(): string
```

`recordAttempt` 규칙 (순수 함수 `applyAttempt(state, attempt)` 로 구현·테스트):
1. attempts 끝에 추가 (`id` = `${finishedAt}-${난수}`), `correct`/`total`/`durationSec` 계산.
2. 틀리거나 미응답인 문항: `wrong[qid].wrongCount += 1`, `lastWrongAt`, `lastPicked` 갱신, `cleared = false`.
3. `kind === 'retry'` 일 때만: 맞힌 문항 `cleared = true, clearedAt`. 그리고 `retry.rounds` 에 이번 회차 결과 push, `queue` = 이번에 또 틀린 문항, `round += 1`. queue 가 비면 `retryHistory` 에 기록하고 `retry = null` (올클리어).
4. retry 가 아닌 시도에서 맞혀도 오답노트 상태는 바뀌지 않는다 (다시 풀기로만 극복 처리).
5. 진행 중 사이클 도중 다른 시험에서 새로 틀린 문항은 현재 queue 에 넣지 않는다 (다음 사이클 1회차에 포함).

통계는 `attempts[].answers` 에서 파생한다 (별도 집계 저장 없음).

## §4 디자인 방향

- 컨셉: **“심야 바 + 파스텔 도트”**. 학습 화면은 크림색 종이 바탕 + 잉크 네이비 글자 + 파스텔 포인트(피치·민트·라벤더·버터·스카이). 게임 화면만 어두운 바 조명.
- 폰트: 본문 Pretendard, 제목·HUD·배지 Galmuri11 (도트 느낌). 둘 다 npm 패키지에서 import.
- 일러스트: 파스텔 플랫 + 굵은 잉크 외곽선(둥근 캡). 카드 프레임은 2px 잉크 테두리 + 오프셋 그림자(픽셀 UI 느낌).
- 토큰은 `src/styles/tokens.css` 의 Tailwind v4 `@theme` 한 곳. 하드코딩 색 금지(일러스트 내부 제외).
- 공용 컴포넌트(`src/ui`): Button, Card, Badge, ProgressBar, Tabs, Modal, EmptyState, PageHeader, StatTile. 페이지는 이것만 조합한다.
- UI 작업 에이전트는 시작할 때 `frontend-design:frontend-design` 스킬을 Skill 도구로 불러 참고한다.

## §5 에이전트 공통 규칙

- **git commit / push / branch 조작 금지.** 커밋은 컨트롤러가 단계 끝에 한다.
- 다른 에이전트가 같은 작업 트리에서 동시에 작업 중이다. `npx tsc --noEmit` 에 남의 경로 오류가 보이면 무시하고 리포트에만 적는다.
- dev 서버는 자기 포트로만(`npm run dev -- --port <Task 절의 포트> --strictPort`), 끝나면 반드시 종료.
- 화면 확인: `node scripts/shot.mjs "http://localhost:<포트>/#/<경로>" <출력.png> [폭]` 후 Read 도구로 PNG 를 직접 본다. 출력은 `.shots/` (gitignore) 에.
- 새 로직(분기·루프·파서·채점)은 vitest 테스트를 같이 둔다. 완료 전 `npm test` (자기 테스트) 와 `npx tsc --noEmit` 실행.
- 플랜에 없는 기능·옵션·추상화 추가 금지.
- **최종 리포트는 12줄 이내**: `STATUS: DONE | DONE_WITH_CONCERNS | BLOCKED` / 만든 파일 수와 핵심 경로 / 실행한 검증 명령과 결과 한 줄 / 우려·미완·남의 경로 버그. 코드·긴 로그 붙이지 않는다.

---

## Phase 1 (병렬)

### T1 스캐폴드·디자인 시스템·스토어 — opus · 포트 5171

- Vite React-TS 프로젝트를 저장소 루트에 구성 (기존 `src/types`, `docs` 유지). `.gitignore`: node_modules, dist, .shots, .env*, .DS_Store.
- npm scripts: `dev`, `build`(`tsc -b && vite build`), `test`(`vitest run`), `shot`. `vite.config` `base: './'`.
- `src/styles/tokens.css`(§4), `global.css`, 폰트 import. `src/ui/*` 공용 컴포넌트.
- `src/app`: HashRouter, `Layout`(상단 내비: 홈·필기·실기·게임·설정, 모바일은 하단 탭, 푸터 고지문), §2 라우트 전부 lazy + stub 페이지 생성(제목만 있는 PageHeader).
- `src/lib/store.ts`, `src/lib/progress.ts`(§3) + `progress.test.ts`: 오답 누적, retry 회차 진행, 올클리어, 규칙 4·5, importState 검증 실패.
- `src/lib/rng.ts`: `seededShuffle<T>(items: T[], seed: string): T[]` (+테스트: 같은 seed 같은 결과).
- `src/data/written/index.ts`: `import.meta.glob('./questions/*.ts', { eager: true })`, `./notes/*.ts` 의 default export 를 합쳐 `questions: Question[]`, `notes: TopicNote[]`, `questionById`, 그리고 `units`, `examMeta` 재수출. syllabus/examMeta 파일이 아직 없으면 T2 가 만들 것이므로 **임시 파일을 만들지 말고** T2 완료를 `ls` 로 확인한 뒤 연결(없으면 최소 placeholder 를 만들되 리포트에 명시).
- `src/data/validate.test.ts` (데이터 검증, 파일이 없을 땐 skip 아님 — glob 결과가 비면 통과): 문항 id 유일·형식, unitId/topicId 가 syllabus 에 존재, 보기 4개 서로 다름·빈 문자열 없음, 해설 20자 이상, 단원별 정답 번호 분포(각 번호 10~40%), 토픽당 문항 6개 이상(문항 파일이 있는 단원만), 단원 examWeight 합 60; 실기: recipe 의 glassId/ingredientId/garnishIds 참조 무결성, methods 와 ingredients[].via 일치.
- `scripts/shot.mjs`: playwright-core, `channel: 'chrome'`, headless, 인자 URL·출력·폭(기본 1280, 높이 fullPage).
- 검증: `npm run build`, `npm test` 통과, `/` 와 `/written` 스크린샷을 직접 확인(데스크톱 1280 + 모바일 390).

### T2 필기 출제기준 조사 → 목차 — sonnet

- 웹에서 조주기능사 필기 **현행 출제기준**(Q-net/한국산업인력공단, 적용 기간 포함)과 시험 형식(문항 수·시간·합격 기준)을 확인.
- 산출물: `docs/research/written-syllabus.md`(출처 URL, 적용 기간, 주요항목→세부항목→세세항목 원문 요약), `src/data/written/syllabus.ts`(`export const units: Unit[]`), `src/data/written/examMeta.ts`(`export const examMeta: ExamMeta`).
- 단원(unit) = 출제기준 주요항목 (8~10개 예상), 토픽 = 세부항목 수준으로 단원당 3~7개. 토픽 `summary` 는 그 토픽에서 배우는 것 한 줄.
- `examWeight`: 출제 비중 추정(공개 자료·기출 경향 근거를 md 에 기록), 합 정확히 60, 단원 최소 3.
- 검증: 합계 60 을 스크립트로 확인.

### T3 실기 표준 레시피·마스터 데이터 — opus

- 웹에서 조주기능사 실기 **현행 공개 표준 레시피 전체**(개수·목록·기준 연도)를 확인. 최근 개편(추가·삭제 칵테일)을 반드시 반영하고 출처·기준일을 `docs/research/practical-recipes.md` 에 기록. 시험 방식(제한 시간, 출제 잔 수)도 기록.
- 산출물 (`src/data/practical/`): `ingredients.ts`(레시피에 쓰이는 모든 재료 + 색 hex), `glasses.ts`, `garnishes.ts`, `recipes.ts`(공식 레시피 전부), `index.ts`(재수출 + `recipeById`, `ingredientById`, `glassById`, `garnishById`, `practicalMeta = { recipeCount, standardYear, examMinutes, examDrinks, sources }`).
- 레시피 필드 규칙은 `src/types/practical.ts` 주석. `via` 를 정확히: 예) Singapore Sling 은 진·레몬·설탕 `shake`, 소다 `build`, 체리 브랜디 `float`. 푸스카페·B-52 는 전부 `float`, 아래층부터.
- `chill`: 공식 채점 기준상 칠링이 필요한 잔(얼음 없이 서빙하는 칵테일 글라스 등)에 true.
- 재료 색은 실제 액체 색에 가깝게(그레나딘 진홍, 블루 큐라소 파랑, 크렘 드 민트 그린 초록 …).
- 검증: 간단한 node/tsx 스크립트 또는 vitest 로 참조 무결성·레시피 개수 확인. 공식 표기와 다른 임의 변형 금지.

## Phase 2 (병렬, Phase 1 커밋 후)

### T4-* 필기 콘텐츠 (단원 묶음별) — opus

- 담당 단원은 디스패치 메시지에 명시. 단원마다 `src/data/written/notes/{unitId}.ts`(`export default TopicNote[]`, 단원의 모든 토픽), `src/data/written/questions/{unitId}.ts`(`export default Question[]`).
- 노트: 토픽당 섹션 2~5개. 표·목록 위주로 “보기 쉽게”, 시험 포인트는 `tip` 블록. 분량은 토픽당 화면 2~4스크롤.
- 문항 수: 단원당 `examWeight × 8`, 토픽당 최소 6. id `u1-t1-q01` 형식.
- 문항 품질: 4지선다, 정답 1개가 명확, 보기 길이 고르게, “모두 고른 것” 류 남발 금지, 정답 번호 고르게 분포, 유형(type)·난이도 섞기(난이도 1:2:3 ≈ 3:5:2), 해설에는 정답 근거와 헷갈리는 오답 설명. 기출 원문 복사 금지.
- 노트에 없는 내용을 묻는 문항 금지(노트만 읽고 풀 수 있어야 함).
- 검증: `npx vitest run src/data/validate.test.ts`, 자기 파일 tsc 통과.

### T5 필기 학습·시험 화면 — opus · 포트 5175

- `src/features/written/quiz/build.ts`(+테스트):
  - `topicQuiz(topicId): Question[]` — 그 토픽에서 무작위 5문항.
  - `unitTestSets(unitId): { refId: string; title: string; questionIds: string[] }[]` — `seededShuffle(단원 문항, unitId)` 를 20문항씩 자름. 마지막 조각이 10 미만이면 앞 세트에 합침. refId `${unitId}-${n}`.
  - `mockRounds(): { refId: string; title: string; questionIds: string[] }[]` — 5회차. 단원별 `examWeight` 만큼 seed 고정 비복원 추출 → 회차 간 문항 중복 없음(풀이 모자라면 그 단원만 중복 허용). 회차 내 순서는 단원 order.
  - `resolveQuiz(kind, refId)` — 위 셋 + retry(`useStore.retry.queue`) 를 `{ title, questions, timed }` 로.
- 페이지: WrittenHub(단원 카드: 토픽 수·문항 수·내 정답률, 바로가기 4개), Unit(토픽 목록 + 이 단원 단원평가 세트), Topic(노트 렌더러: p/list/table/tip, `**굵게**`, 키워드 칩, “확인 문제 5문항” 버튼), UnitTests(전 단원 세트 목록 + 세트별 최근 점수), MockList(회차별 최고점·응시 횟수·합격 여부, 시험 안내).
- QuizPage: 연습형(topic·unit·retry) = 한 문항씩, 고르면 즉시 정오+해설, 다음. 모의고사(mock) = 60분 타이머, 문항 번호판(응답/미응답/표시), “나중에 볼 문제” 표시, 제출 확인 모달, 시간 종료 시 자동 제출, 해설은 제출 후. 종료 시 `recordAttempt` → `/written/result/:attemptId`.
- 진행 중 모의고사는 새로고침해도 유지(sessionStorage 에 답안·시작 시각).
- ResultPage: 점수, 모의고사면 합격/불합격(examMeta.passScore), 단원별·유형별 정오 막대, 문항별 내 답/정답/해설(틀린 것만 보기 토글), “오답노트로” 버튼.
- 데이터가 아직 일부 단원뿐이어도 깨지지 않게(빈 상태 처리). 개발 중에는 `questions` 가 비어 있을 수 있으니 테스트는 자체 fixture 사용.
- 검증: 테스트 + 스크린샷으로 QuizPage(연습·모의고사)·ResultPage 확인.

### T6 일러스트 시스템 — opus · 포트 5176

- `src/art/`: `GlassArt`, `CocktailArt`, `BottleArt`, `ToolArt`, `GarnishArt`, `IceArt`, `BarScene`, `CustomerArt`, `mixColor.ts`, `overrides.ts`, `index.ts`.
- API:
  - `<GlassArt glassId fill={{ layers: { color: string; ratio: number }[]; level: number }} ice={IceType|null} garnishIds={string[]} rim={'salt'|'sugar'|null} frosted? size? />` — 잔마다 외곽선 path + 볼 내부 clipPath 를 정의, 액체는 clip 안에 아래부터 층으로 채움(level 0~1). 얼음·가니쉬·림은 잔별 앵커에 배치. `frosted` = 칠링된 잔(서리 효과).
  - `<CocktailArt recipeId size? />` — 레시피에서 자동 구성: float 재료는 층으로, 나머지는 `mixColor` 로 섞은 한 색.
  - `mixColor(parts: { color: string; amount: number }[]): string` (+테스트).
  - `<BottleArt ingredientId size? />`(BottleShape 9종 실루엣 × 재료 색 × 짧은 라벨), `<ToolArt toolId />`(TOOL_IDS 전부), `<GarnishArt garnishId />`, `<IceArt type />`.
  - `<BarScene>{children}</BarScene>` — 게임 배경(백바 선반·병 실루엣·조명·카운터 상판), `<CustomerArt variant={0..5} mood={'neutral'|'happy'|'sad'} />`.
  - `overrides.ts`: `export const artOverrides: Record<string, string> = {}` 키 `${kind}/${id}`(kind: cocktail·glass·bottle·tool·garnish). 값이 있으면 SVG 대신 `<img>`(`image-rendering: pixelated`).
- 모든 glasses/garnishes/TOOL_IDS/ingredients id 에 그림이 있어야 한다(테스트로 확인: id 마다 정의 존재).
- `/dev/art` 갤러리: 전 잔·전 레시피 완성 그림·병·도구·가니쉬·배경을 한 화면에. 스크린샷을 직접 보고 어색한 형태(액체가 잔 밖으로 나옴, 가니쉬 위치 등)를 고친다 — 최소 2회 확인·수정 반복.
- SVG 는 `viewBox` 기반, `size` 로만 크기 조절, `role="img"` + `aria-label`.

### T7 게임 엔진 (순수 TS) — opus

- `src/features/game/engine/`: `types.ts`, `reducer.ts`, `judge.ts`, `solve.ts`, `index.ts`, 테스트.
- 상태: 서빙 잔 `{ glassId|null, chill: 'none'|'icing'|'chilled', ice: IceType|null, rim, layers(부은 순서·float 여부), garnishIds }`, 용기 `shaker`·`mixingGlass`·`blender` 각각 `{ ice, contents, done }`(done = 흔들기/젓기/갈기 수행), 행동 로그.
- 액션: `pickGlass`, `chillGlass`(칠링용 얼음 넣기), `dumpChill`(칠링 얼음·녹은 물 버리기), `rim`, `addIce(target, ice)`, `pour(target, ingredientId, amount, unit, float?)`, `shake`, `stir(target: 'mixingGlass'|'glass')`, `blend`, `strain(from)`(내용물만 잔으로, 블렌더는 얼음째), `garnish`, `removeGarnish`, `reset`, `serve`.
- 불가능한 행동은 상태를 바꾸지 않고 `{ ok: false, reason: 한국어 }` 반환(잔 없이 따르기, 빈 셰이커 흔들기 등).
- `judge(state, recipe): ScoreSheet` — 100점: 잔 15 · 칠링 10 · 얼음 10 · 재료 종류 20 · 계량 15 · 기법 15 · 가니쉬·림 10 · 순서·처리 5. 해당 없는 항목은 만점. 항목마다 `{ key, label, earned, max, ok, message }`(message = 무엇이 틀렸고 정답이 무엇인지 한국어).
  - 칠링: 필요한데 안 함 0점, 얼음을 버리지 않고 술을 따름 0점 + 순서·처리 감점.
  - 재료: 누락·불필요·경로(via) 오류를 구분해 메시지. 계량은 정확히 일치 만점, 오차 1/4oz 이내 부분 점수.
  - 기법: via 별 용기 사용 + 수행 여부(셰이커에 넣고 안 흔듦 등), 탄산을 셰이커에 넣으면 감점, float 층 순서.
- `solve(recipe): Action[]` — 만점 풀이. **테스트: 전 레시피에 대해 `judge(run(solve(r))) === 100`**, 그리고 변형 테스트(잔 틀림·칠링 생략·재료 누락·가니쉬 누락·계량 오차 각각 해당 항목만 감점).
- `amountOptions(unit)`: 선택 가능한 계량 목록(oz: 1/4, 1/3, 1/2, 3/4, 1, 1¼, 1½, 2, 3, 4 등 — 전 레시피의 값이 반드시 포함되도록 테스트).
- React·DOM 의존 금지.

### T8 실기 도감 콘텐츠 — sonnet

- `src/data/practical/guide/{tools,glasses,spirits,mixers,garnishes,ice,techniques}.ts`(각 `export default GuideCategory`) + `guide/index.ts`(`guideCategories: GuideCategory[]`).
- tools: TOOL_IDS 전부(외형·용도·사용법·시험 팁). glasses: `glasses.ts` 의 모든 잔(모양·용량·어울리는 칵테일). spirits: 6대 증류주·리큐어·와인/베르무트·전통주(레시피에 쓰이는 재료는 ingredient id 로 art 연결). mixers: 주스·시럽·탄산·비터. garnishes: `garnishes.ts` 전부(만드는 법 포함). ice: 큐브·크러시드·블록·럼프 등 모양별 용도. techniques: 빌드·스터·셰이크·플로트·블렌드·머들·칠링·프로스팅(림)·스트레인 — 단계별 방법과 실기 감점 포인트.
- 사실 확인은 §0. 검증: tsc + art.id 참조 무결성 스크립트.

## Phase 3 (병렬, Phase 2 커밋 후)

### T9 바텐더 게임 UI — opus · 포트 5179

- `src/features/game/GamePage.tsx`, `ui/**`. 엔진(T7)·일러스트(T6)·스토어 사용. 엔진에 빠진 게 있으면 엔진을 직접 고치되 테스트 유지.
- 모드: **연습**(레시피 패널 표시, 칵테일 직접 선택 가능) · **실전**(무작위 주문, 레시피 숨김, 힌트 버튼은 감점 없이 횟수 표시) · **시험**(무작위 3잔 연속, 7분 타이머, 레시피 숨김 — 시간·잔 수는 `practicalMeta`).
- 화면: `BarScene` 위에 손님 + 말풍선 주문, HUD(모드·타이머·현재 잔 번호), 카운터 작업대(서빙 잔과 꺼낸 용기를 실시간 그림으로: 액체가 차오르고 색이 섞이고 층이 쌓임, 칠링 중 서리), 아래 트레이 탭 [잔][얼음][도구][술·재료(분류 필터+검색)][가니쉬], 행동 로그 한 줄.
- 조작: 클릭/탭 중심. 따르기 = 병 선택 → 대상 용기 → 계량 칩(`amountOptions`) → 따르기(바 스푼 float 토글). 칠링 = 잔에 칠링 얼음 → 2~3초 게이지 → “얼음·물 버리기”. 셰이크·스터 = 길게 누르기/연타 게이지 + 흔들림 애니메이션. 스트레인, 림, 가니쉬, 서빙.
- 서빙 후 채점표(ScoreSheet 항목별 ✓/✗ + 메시지 + 정답 레시피 + 완성 그림), 손님 반응, `recordGame`. 시험 모드는 3잔 종합 결과.
- 360px 모바일에서도 플레이 가능. `prefers-reduced-motion` 존중.
- 검증: 스크린샷으로 주문 → 제조 중 → 채점표 3장면 확인, 최소 한 레시피를 실제 클릭 흐름으로 끝까지(Playwright 스크립트로 `solve` 순서 재현 가능).

### T10 실기 도감·레시피 카드 화면 — sonnet · 포트 5180

- PracticalHub(도감 7개 분류 + 레시피 카드 + 게임 진입, 실기 시험 안내), GuidePage(분류별 항목 카드: 일러스트·특징·사용법·시험 팁, 소분류 필터), RecipesPage(카드 그리드: `CocktailArt`·이름·기주/기법/잔 배지, 필터(기주·기법·잔)·검색, **암기 모드**: 카드 탭하면 뒤집혀 레시피), RecipeDetailPage(큰 그림, 재료·계량 표, 잔·기법·얼음·가니쉬, 만드는 순서(재료 via 로 생성), 팁, 내 게임 기록, “게임에서 만들어 보기” 링크 `/practical/game?recipe=<id>`).
- 검증: 스크린샷 4장면(데스크톱+모바일 1장).

### T11 오답노트·통계·홈·설정 — sonnet · 포트 5181

- `src/features/written/stats/selectors.ts`(+테스트): attempts 에서 단원별·토픽별·유형별·난이도별 `{ seen, correct, rate }`, 모의고사 점수 추이, 약점 토픽 TOP5(3문항 이상 푼 것 중 정답률 낮은 순), 자주 틀린 문항 TOP10(wrongCount).
- WrongNotePage: 탭 [복습 중 / 극복함], 문항 카드(틀린 횟수 배지, 단원·유형, 마지막으로 고른 답, 펼치면 정답·해설), 필터(단원·유형)·정렬(많이 틀린 순/최근), 회차 카드(“현재 n회차 · 남은 m문항”, 지난 사이클 기록 “n회차 만에 올클리어”), 버튼 “틀린 문제만 다시 풀기” → `startRetry()` → `/written/quiz/retry/current`.
- StatsPage: 요약 타일(푼 문항·정답률·모의고사 최고/평균·합격선 대비), 모의고사 추이 SVG 꺾은선(합격선 표시), 단원별·유형별 정답률 막대, “자주 틀리는 유형” 설명 카드(가장 약한 유형 2개 + 무엇을 묻는 유형인지 + 추천 학습 링크), 약점 토픽 TOP5(노트·확인 문제 링크), 자주 틀린 문항 TOP10. 차트는 직접 그린 SVG/CSS(라이브러리 없음), 표 대안 텍스트 제공.
- HomePage: 필기/실기 진입 카드, 이어서 하기(최근 시도), 오늘의 추천(가장 약한 토픽, 남은 오답 수, 아직 안 만든 칵테일), 시험 개요.
- SettingsPage: 기록 내보내기(JSON 다운로드)/가져오기/전체 초기화(확인 모달).
- 검증: selectors 테스트 + 가짜 기록을 넣은 상태로 스크린샷.

### T12-* 문항 팩트체크 — sonnet (단원 묶음별)

- 담당 단원 문항·노트를 전부 검토: 정답이 사실인지, 정답이 하나뿐인지, 해설과 일치하는지, 노트와 모순 없는지. 의심 항목은 웹으로 확인.
- 확실한 오류만 직접 수정(출처 확인된 경우). 애매하면 수정하지 말고 표시. 결과 `docs/research/factcheck-{unitId}.md`(수정 목록·보류 목록).
- 검증: validate 테스트 재실행.

### T13 도트 외주 의뢰 패키지 — sonnet

- 저장 위치: 사용자 바탕화면 `~/Desktop/조주기능사_도트_외주/` (저장소 밖, 커밋 안 함).
- `01_의뢰서.md`(프로젝트 소개, 필요한 그림 범위·우선순위, 스타일 방향, 규격: 캔버스 크기·배경 투명 PNG·팔레트 제한·파일명 규칙 = `artOverrides` 키와 동일, 납품 폴더 구조, 일정·금액·저작권/사용 범위는 빈칸 양식), `02_에셋_목록.md`(데이터에서 뽑은 전체 목록 표: 칵테일·잔·도구·병·가니쉬·배경·손님 — id·이름·잔·색·가니쉬 메모), `03_레퍼런스.md`(웹 조사: 도트 바/칵테일 게임·아이콘팩·팔레트 자료 링크 + 무엇을 참고할지 한 줄씩; 타인 이미지를 내려받아 저장하지 않는다), `04_현재_시안/`(사이트 SVG 시안 스크린샷: `/dev/art`, 레시피 카드, 게임 화면).
- 개인정보·실명 넣지 않는다.

## Phase 4

### T14 통합 QA·최종 리뷰 — opus · 포트 5184

- `npm run build`, `npm test`, `npx tsc --noEmit` 전부 통과시키기. 전 라우트 스크린샷(데스크톱·모바일)으로 깨진 화면·빈 상태·넘침 수정. 핵심 흐름 Playwright 스모크(`scripts/smoke.mjs`): 토픽 확인 문제 → 결과 → 오답노트 → 다시 풀기 1회차 → 통계, 모의고사 제출, 레시피 카드 뒤집기, 게임 1잔 서빙.
- §0 위반 검색(외부 URL 요청, 개인정보, 하드코딩 경로), 죽은 코드·stub 제거, `README.md`(소개·실행법·구조·데이터 추가법·도트 이미지 교체법·기준일 고지).
- 발견한 문제는 직접 수정하고 리포트에 목록.

---

## 스킬 기본 절차와 다르게 한 점 (사용자 지시 우선)

- 플랜에 전체 코드를 싣지 않음: 사용자가 “플랜은 메인, 구현은 opus/sonnet 서브에이전트, 토큰 효율” 을 지시. 대신 타입 계약 파일과 API·규칙을 확정해 둠.
- 구현 에이전트 병렬 실행: 파일 소유권을 겹치지 않게 나누고 커밋은 컨트롤러가 단계 끝에 수행.
- Task 마다 리뷰어를 붙이는 대신: 콘텐츠는 T12 팩트체크, 코드는 자체 테스트 + T14 전체 리뷰.
- 빈 저장소라 main 에 직접 커밋·푸시(사용자가 허락 없이 진행하라고 지시).
