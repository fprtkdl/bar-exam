# 개발 노트

## 명령
- `npm run dev -- --port <포트> --strictPort` · `npm run build` · `npm test` · `npx tsc --noEmit` (tsconfig 하나, src 전체 검사)
- 스크린샷: `node scripts/shot.mjs "http://localhost:<포트>/#/<경로>" .shots/x.png [폭]`
- 스모크(핵심 흐름 Playwright): dev 서버를 띄운 뒤 `node scripts/smoke.mjs http://localhost:<포트>` — 결과 PASS/FAIL 과 콘솔 에러 수, 스크린샷은 `.shots/smoke/`
- rtk 훅이 vitest/tsc 출력을 삼키면 `rtk proxy npx vitest run` 처럼 감싼다.

## 토큰 (`src/styles/tokens.css`, Tailwind v4 @theme) — 하드코딩 색 금지
- 면: `bg-paper`(기본 종이) `bg-paper-deep` / 파스텔 `bg-peach|mint|lavender|butter|sky` (위 글자는 항상 `text-ink`)
- 글자: `text-ink`(본문) `text-ink-soft`(보조, 대비 OK) — `ink-faint` 는 장식 선 전용, 글자 금지
- 정오: `text-good`/`bg-good-soft`, `text-bad`/`bg-bad-soft` — 반드시 ✓/✗ 아이콘·문구 병기
- 게임(어두운 바): `bg-bar-night` `bg-bar-wall` `bg-bar-wood` `text-bar-glow` `text-bar-neon`
- 폰트: `font-sans`(Pretendard, 기본) `font-pixel`(Galmuri11: 제목·HUD·배지·버튼)
- 픽셀 프레임: `border-2 border-ink rounded-pixel shadow-pixel`(카드) / `shadow-pixel-sm`(버튼·작은 요소)
- 동적 톤은 `src/ui/tone.ts` 의 `Tone` 타입 + `TONE_BG[tone]` (클래스 문자열 조립 금지 — Tailwind 스캔 안 됨)

## 공용 컴포넌트 (`import { ... } from '<상대경로>/ui'`)
- `Button` variant `primary|secondary|ghost`, size `md|sm`(sm 은 모바일 44px·sm 이상 36px), `to?`(주면 Link) + button 속성. 링크에 스타일만: `buttonClass(v,s,cls)`
- `Card` tone?, `to?`(카드 전체 링크, 상태 자동), `interactive?`(hover 1px 들림·눌림·안쪽 포커스 시 링 — 카드 안 버튼에 `after:absolute after:inset-0` 을 주고 Card 에 `className="relative"`), className. 안쪽 여백 16/20 내장
- `Badge` tone?(기본 butter), children
- `ProgressBar` value, max=100, label(필수, aria), tone?, showValue?
- `Tabs<T>` items `{id,label}[]`, value, onChange, label — 패널은 페이지가 그리고 `id="tabpanel-<id>" role="tabpanel" aria-labelledby="tab-<id>"`
- `Modal` open, onClose, title, children, footer?(없으면 '닫기') — 네이티브 dialog(Esc·포커스 가둠), 오른쪽 위 `x` 버튼(이름 '창 닫기'), 열린 동안 배경 스크롤 잠금
- `EmptyState` title, description?, action?
- `PageHeader` title, subtitle?, back?`{to,label}`(앞에 `chevron-left` 자동 — 라벨에 ‹ 넣지 말 것), actions? — 페이지마다 h1 은 이것 하나
- `StatTile` label, value, hint?, tone?

### 다듬기 단계에서 추가 (모양 확인: `/#/dev/ui`)
- **브라우저 기본 UI 를 쓰지 않는다.** `<select>`→`Select`(≤5개 선택지는 `ChipGroup`), `<input type=checkbox>`→`Checkbox`, `<details>`→`Disclosure`, 검색창→`SearchInput`, 글리프(▶ ▼ ‹ › → ✓ ✗ × ★)·이모지→`Icon`.
- `Icon` name, size?=16, className?, label?(주면 role=img, 없으면 aria-hidden). 색은 글자색을 따른다(`text-good` 등). 이름 24개: `chevron-down|right|left` `arrow-right` `check` `x` `search` `flag` `clock` `tip` `star` `refresh` `download` `upload` `trash` `book` `pencil` `glass` `shaker` `gear` `home` `chart` `note` `play`. 버튼 안: `<Button><Icon name="play" />시작</Button>`(gap 내장). Badge 안은 `size={12}`. 그림은 `src/ui/icons.ts` 의 16×16 문자열 — 새 아이콘도 여기에 그린다(테스트가 크기 검사).
- `Select` label, value, onChange(value), options `{value,label}[]`, className?, hideLabel?(라벨을 시각적으로 숨기고 aria-label 로), disabled?. 라벨은 기본으로 트리거 왼쪽에 보인다. 트리거 높이 = `Button size="sm"` = `SearchInput`(모바일 44 / sm 이상 36) — 한 줄 툴바에 섞어도 맞는다. 리스트는 popover(top layer)라 부모 `overflow-hidden`·Modal 에 잘리지 않고, 아래가 모자라면 위로 연다. 키보드 ↑↓ Home End PgUp PgDn Enter Space Esc Tab, 글자 입력 이동. Playwright: `getByRole('combobox', { name: '정렬' })` → `getByRole('option', { name })`.
- `ChipGroup<T>` label, value, onChange, options `{value,label}[]`, hideLabel?, className? — radiogroup, ←→↑↓ 로 이동하며 즉시 선택. 선택 = 잉크 바탕(눌린 모양). Playwright: `getByRole('radio', { name })`.
- `Checkbox` checked, onChange(checked), disabled?, className?, children(라벨) — 진짜 checkbox 를 숨긴 것이라 `getByRole('checkbox', { name })` 그대로.
- `Disclosure` summary, defaultOpen?, className?, children — 테두리 상자 + `chevron-right` 회전. 테두리 없는 접기가 필요하면 쓰지 말고 말해 줄 것.
- `SearchInput` value, onChange(value), placeholder?, label(aria), className? — 값이 있으면 지우기 버튼('검색어 지우기'), Esc 로도 지움. 폭은 className 으로(`w-full sm:w-64`).
- `inputClass` — `<input className={inputClass} />`, textarea 는 `` `${inputClass} h-auto py-2` ``. 모바일 16px 글자(iOS 확대 방지).
- `PageLoading` — 라우트 Suspense fallback(Layout 이 이미 씀). 화면 안 로딩에도 사용 가능.
- 본문 속 링크: `<a className="text-link">` / `<Link className="text-link">` (밑줄 2px, hover 버터).
- 간격은 4·8·12·16·24·32(`gap-1|2|3|4|6|8`)만, 섹션 사이 `mt-8`.

## 레이아웃·라우팅
- `src/app/Layout.tsx`: 상단 내비(sm 이상) / 하단 탭(모바일, 아이콘+라벨, safe-area 반영, 푸터에 pb 확보됨) / 푸터 고지문. main 은 `max-w-5xl px-4 py-8`. `document.title` 은 Layout 의 `TITLES` 표(`<화면> · 공부바`) — 새 라우트면 거기에 한 줄.
- 전역 CSS(`global.css`)가 검색창 ×·details 삼각형·숫자 스핀·파일 버튼·스크롤바(얇은 잉크, `bg-bar-night` 안은 조명색)·선택 색(버터)·탭 하이라이트를 정리한다. 페이지에서 따로 할 필요 없음.
- 푸터 기준일은 데이터에서 읽는다: 필기 `verifiedPeriod`(`examMeta.ts`, 원문 확인된 적용 기간), 실기 `practicalMeta.standardYear`.
- `src/app/routes.tsx` 수정 금지. 페이지는 default export 만 교체. 개발 확인용 `/dev/ui`(공용 UI)·`/dev/art`(일러스트).

## 스토어 (`src/lib/store.ts`, 로직 `src/lib/progress.ts`)
- `useStore(s => s.attempts)` 식 셀렉터 사용. 액션 시그니처는 플랜 §3 그대로. 저장 키 `bar-exam:v1`.
- `startRetry(exists?)` 가 만든 사이클의 `queue` 를 풀고 `recordAttempt({kind:'retry', refId:`r${round}`, ...})`. refId 가 현재 회차와 다르면 회차는 넘어가지 않는다(중복 제출 방지). `exists` 로 데이터에서 사라진 문항을 거른다.
- 손상된 localStorage 값은 `persist` 의 `merge` 에서 `isPersistedState` 검증에 실패하면 버리고 빈 기록으로 시작한다.
- `seededShuffle(items, seed)` in `src/lib/rng.ts`.

## 데이터
- `src/data/written/index.ts`: `units, examMeta, questions, notes, questionById`. questions/notes 파일은 `Question[]`/`TopicNote[]` 를 default export.
- `src/data/validate.test.ts` 실기 검사는 `src/data/practical/index.ts` 의 `recipes, ingredients, glasses, garnishes` named export 를 기대.
