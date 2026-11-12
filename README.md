# 조주기능사 공부바

조주기능사 필기와 실기를 한곳에서 공부하는 한국어 정적 웹사이트입니다. 서버·계정이 없고, 학습 기록은 브라우저에만 저장됩니다.

> **비공식 학습용 사이트입니다.** 한국산업인력공단(Q-net)과 관계가 없습니다.

## 기능

**필기**
- 목차(출제기준 주요항목 8단원, 토픽 32개)별 정리 노트와 토픽마다 확인 문제 5문항
- 단원평가: 단원마다 20문항 안팎의 고정 세트 여러 개
- 모의고사 5회: 회차마다 60문항, 60분 타이머, 단원 출제 비중대로 뽑음(회차끼리 문항 중복 없음). 새로고침해도 답안·남은 시간이 유지되고, 시간이 끝나면 자동 제출
- 오답노트: 문항별 틀린 횟수, "틀린 문제만 다시 풀기" 회차제(또 틀린 문제만 다음 회차로, 다 맞히면 올클리어 기록)
- 통계: 단원별·유형별 정답률, 모의고사 점수 추이(합격선 표시), 약점 토픽, 자주 틀린 문항

**실기**
- 도감: 도구·잔·술·믹서·가니쉬·얼음·기법
- 표준 레시피 카드 40종(파스텔 도트풍 SVG 일러스트), 암기 모드(카드 뒤집기), 레시피 상세(재료·계량·만드는 순서)
- 바텐더 게임: 손님 주문 → 잔 고르기 → 칠링과 녹은 물 버리기 → 얼음 → 셰이크·스터·빌드·블렌드·플로트 → 가니쉬·리밍 → 서빙 → 항목별 채점표. 연습·실전·시험(3잔 7분) 모드

**설정**: 기록 내보내기(JSON)·가져오기·전체 초기화

## 실행

```bash
npm install
npm run dev        # 개발 서버
npm run build      # 타입 검사 + dist/ 빌드 (base './' 라 아무 경로에 올려도 동작)
npm test           # vitest
```

스모크 테스트(시스템 Chrome 필요): `npm run dev -- --port 5184 --strictPort` 를 띄운 뒤 `node scripts/smoke.mjs`.

## 폴더 구조

```
src/
  app/            라우터·레이아웃(내비·푸터)
  ui/             공용 컴포넌트 (Button, Card, Modal …)
  styles/         디자인 토큰(tokens.css)·전역 스타일
  lib/            기록 저장(store.ts)과 순수 로직(progress.ts), seededShuffle
  types/          데이터 계약 (written·practical·storage)
  data/written/   syllabus.ts(목차) · examMeta.ts(시험 정보·기준일) · notes/ · questions/
  data/practical/ 재료·잔·가니쉬·레시피 · guide/(도감)
  art/            SVG 일러스트와 도트 이미지 교체 맵(overrides.ts)
  features/       화면: home · written · practical · game(engine = 순수 TS 채점) · settings · dev(/dev/art 갤러리)
docs/             조사 기록(research/)·개발 노트
scripts/          스크린샷·스모크 스크립트
```

## 문항·노트 추가

- 노트: `src/data/written/notes/<unitId>.ts` 가 `TopicNote[]` 를 default export. 블록은 `p`·`list`·`table`·`tip`, 텍스트 안에서는 `**굵게**` 만 씁니다.
- 문항: `src/data/written/questions/<unitId>.ts` 가 `Question[]` 를 default export. id 는 `u1-t1-q01` 형식, 4지선다, `answer` 는 0~3.
- 새 파일은 `src/data/written/index.ts` 가 자동으로 모읍니다. 추가한 뒤 `npm test` 로 형식(id 유일, 보기 4개, 해설 길이, 정답 번호 분포, 토픽당 6문항 이상)을 확인하세요.
- 단원·토픽 id(`src/data/written/syllabus.ts`)는 기록과 연결되어 있으니 바꾸지 마세요.

## 도트 이미지로 교체

1. 투명 배경 PNG 를 `public/art/<kind>/<id>.png` 에 넣습니다. kind 는 `cocktail`·`glass`·`bottle`·`tool`·`garnish`, id 는 `src/data/practical` 의 id 입니다.
2. `src/art/overrides.ts` 에 등록합니다: `export const artOverrides = { 'cocktail/margarita': 'art/cocktail/margarita.png' }` (앞에 `/` 없이).
3. 등록된 그림은 SVG 대신 `image-rendering: pixelated` 로 그려집니다. `glass/<id>` 는 빈 잔 그림에만 적용되고, 게임에서 액체가 채워지는 잔은 SVG 로 남습니다. 얼음·바 배경·손님 그림은 아직 교체 맵이 없어 코드 연결이 따로 필요합니다.

전체 그림은 `/#/dev/art` 갤러리에서 한눈에 볼 수 있습니다.

## 데이터 기준과 한계

- 필기 출제기준: 원문을 확인한 적용 기간은 **2022.1.1~2024.12.31** 입니다. 2025년 이후 적용본은 원문을 확인하지 못했습니다(시험 과목·형식은 Q-net 종목 안내와 같음). 세부 항목이 다를 수 있습니다. 출처는 `src/data/written/examMeta.ts`·`docs/research/written-syllabus.md`.
- 필기 문제는 출제기준 범위의 사실을 바탕으로 **새로 만든 창작 문제이며 기출문제가 아닙니다.** 단원 출제 비중은 추정치입니다. 팩트체크 기록은 `docs/research/factcheck-*.md`.
- 실기 레시피: 2026년 적용 공개 표준 레시피 40종 기준(`src/data/practical/index.ts` 의 `practicalMeta`, `docs/research/practical-recipes.md`). 게임 채점은 학습용 근사이며 실제 채점 기준과 같지 않습니다.

## 개인정보

학습 기록(풀이·오답·게임 점수)은 이 브라우저의 localStorage(`bar-exam:v1`)에만 저장되고 어디로도 전송되지 않습니다. 외부 폰트·CDN·분석 도구를 쓰지 않습니다. 다른 기기로 옮기려면 설정에서 내보내기/가져오기를 쓰세요.
