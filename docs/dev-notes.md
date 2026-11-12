# 개발 노트 (T1 작성)

## 명령
- `npm run dev -- --port <포트> --strictPort` · `npm run build` · `npm test` · `npx tsc --noEmit` (tsconfig 하나, src 전체 검사)
- 스크린샷: `node scripts/shot.mjs "http://localhost:<포트>/#/<경로>" .shots/x.png [폭]`
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
- `Button` variant `primary|secondary|ghost`, size `md|sm`, `to?`(주면 Link) + button 속성. 링크에 스타일만: `buttonClass(v,s,cls)`
- `Card` tone?, `to?`(카드 전체 링크), className
- `Badge` tone?(기본 butter), children
- `ProgressBar` value, max=100, label(필수, aria), tone?, showValue?
- `Tabs<T>` items `{id,label}[]`, value, onChange, label — 패널은 페이지가 그리고 `id="tabpanel-<id>" role="tabpanel" aria-labelledby="tab-<id>"`
- `Modal` open, onClose, title, children, footer?(없으면 '닫기') — 네이티브 dialog, 한 화면에 하나만
- `EmptyState` title, description?, action?
- `PageHeader` title, subtitle?, back?`{to,label}`, actions? — 페이지마다 h1 은 이것 하나
- `StatTile` label, value, hint?, tone?

## 레이아웃·라우팅
- `src/app/Layout.tsx`: 상단 내비(sm 이상) / 하단 탭(모바일, main 아래 pb 확보됨) / 푸터 고지문. main 은 `max-w-5xl px-4 py-8`.
- 푸터 기준일은 Layout 에 `2026-11-12` 하드코딩 — 데이터 기준일이 바뀌면 T14 가 확인.
- `src/app/routes.tsx` 수정 금지. 페이지는 default export 만 교체.

## 스토어 (`src/lib/store.ts`, 로직 `src/lib/progress.ts`)
- `useStore(s => s.attempts)` 식 셀렉터 사용. 액션 시그니처는 플랜 §3 그대로. 저장 키 `bar-exam:v1`.
- `startRetry()` 가 만든 사이클의 `queue` 를 풀고 `recordAttempt({kind:'retry', refId:`r${round}`, ...})`.
- `seededShuffle(items, seed)` in `src/lib/rng.ts`.

## 데이터
- `src/data/written/index.ts`: `units, examMeta, questions, notes, questionById`. questions/notes 파일은 `Question[]`/`TopicNote[]` 를 default export.
- `src/data/validate.test.ts` 실기 검사는 `src/data/practical/index.ts` 의 `recipes, ingredients, glasses, garnishes` named export 를 기대.
