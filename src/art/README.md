# src/art — SVG 일러스트 (`import { ... } from '<상대경로>/art'`)

모두 `size` = 높이 px(폭은 비율대로), `role="img"` + `aria-label` 포함. id 는 `src/data/practical` 의 것.

- `<GlassArt glassId fill? ice? garnishIds? rim? frosted? size?=160 label? />`
  - `fill={{ layers: [{ color, ratio }], level }}` — layers 는 **아래층부터**, ratio 는 상대값(합 무관), level 0~1(범위 밖은 자름). 액체는 잔 안쪽 clip 안에서만 그려지므로 level·layers 만 바꿔도 안 깨진다.
  - `ice: 'cube'|'crushed'|null`, `rim: 'salt'|'sugar'|null`, `frosted` = 칠링 서리, `label` = aria-label 덮어쓰기.
  - 게임 예: `<GlassArt glassId="highball" fill={{ layers: [{ color: mixColor(parts), ratio: 1 }], level: poured / cap }} ice="cube" />`
- `<CocktailArt recipeId size? />` — 레시피 완성 그림(잔·얼음·가니쉬·림·칠링 자동). float 는 층(시럽은 바닥), 나머지는 섞은 한 색. 같은 계산은 `recipeFill(recipe)` 로 얻는다.
- `mixColor(parts: { color, amount }[]): string` — 투명 액체 섞기(감산 근사, 노랑+파랑→초록). 우유처럼 불투명한 건 `blend`(./mixColor).
- `<BottleArt ingredientId size?=140 />` — 재료의 BottleShape 실루엣 + 재료 색 + 짧은 라벨.
- `<ToolArt toolId size?=80 />` (TOOL_IDS 전부) · `<GarnishArt garnishId size?=64 />` · `<IceArt type size?=80 />`
- `<CustomerArt variant={0..5} mood?='neutral'|'happy'|'sad' size?=120 />`
- `<BarScene>{children}</BarScene>` — 게임 배경. 폭 100%, 백바(선반·병·조명)는 고정 크기 타일 반복이라 360~1280px 어디서도 찌그러지지 않음.
  children 은 카운터 상판 바로 위에 가로 가운데 정렬(`flex-wrap items-end gap-4`, 최소 높이 300px, 위 150px 는 선반이 보이는 여백)로 선다. 높이는 children 에 따라 늘어난다.

```tsx
<BarScene>
  <CustomerArt variant={2} mood="happy" />
  <GlassArt glassId={recipe.glassId} fill={fill} ice={recipe.glassIce} garnishIds={done ? recipe.garnishIds : []} />
</BarScene>
```

## 도트 그림으로 교체
`overrides.ts` 의 `artOverrides['<kind>/<id>'] = url` (kind: cocktail·glass·bottle·tool·garnish). 값이 있으면 SVG 대신 `<img>`(pixelated).
`glass/*` 는 빈 잔(채움·얼음·가니쉬·림 없음)일 때만 교체된다 — 게임의 채움 그림은 SVG 유지.
갤러리: `/#/dev/art`. 새 id 가 데이터에 추가되면 `art.test.tsx` 가 그림 누락을 잡는다.
