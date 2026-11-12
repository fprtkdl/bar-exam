# 게임 엔진 (순수 TS, `import … from 'src/features/game/engine'`)

**상태 `GameState`**: `glass { glassId, chill: 'none'|'icing'|'chilled', ice, rim, layers[], garnishIds[], pouredWhileIcing }` ·
`shaker`/`mixingGlass`/`blender` 각각 `{ ice, contents: Pour[], done }` · `served` · `log`(성공한 액션).
`Layer = { ingredientId, amount, unit, via, mixed, vesselIce, onIce }` — 잔 아래 → 위, 부은 순서. `via` 는 들어온 경로(build/float = 잔에 직접, shake/stir/blend = 그 용기에서 스트레인).

**액션 `Action`** (`step(state, action)` → `{ ok: true, state } | { ok: false, reason, state }`, 실패 시 state 그대로·reason 은 한국어 토스트용)
- `pickGlass{glassId}` · `chillGlass` · `dumpChill` · `rim{rim:'salt'|'sugar'}`
- `addIce{target:'glass'|'shaker'|'mixingGlass'|'blender', ice:'cube'|'crushed'}`
- `pour{target, ingredientId, amount, unit, float?}` — `fill` 은 amount 0, float 은 target 'glass' 만
- `shake` · `stir{target:'mixingGlass'|'glass'}` · `blend` · `strain{from: vessel}` (블렌더는 얼음째 잔으로)
- `garnish{garnishId}` · `removeGarnish{garnishId}` · `reset` · `serve`
- `initialState()`, `run(actions)`(하나라도 실패하면 throw, 테스트·데모용)

**채점** `judge(state, recipe): ScoreSheet` → `{ total, max: 100, items: { key, label, earned, max, ok, message }[] }`
잔 15 · 칠링 10 · 얼음 10 · 재료 20 · 계량 15 · 기법 15 · 가니쉬·림 10 · 순서·처리 5. `message` 는 틀린 것과 정답을 문장으로 담으니 그대로 보여주면 된다.
**풀이** `solve(recipe): Action[]` — 만점 액션 순서(정답 시연·힌트용). **계량** `amountOptions(unit): number[]`, 표시는 `formatAmount(amount, unit)`("1 1/2oz", "가득 채움").
라벨: `VIA_LABEL`, `VESSEL_LABEL`, `ICE_LABEL`, 조사 `josa(word, '을'|'이'|'은'|'으로')`.

**UI 가 알아야 할 제약**
- 칠링: `chillGlass`(빈 잔만) → 용기 작업 → `dumpChill` → 따르기. 칠링 얼음 위에 따르면 칠링 0점 + 순서 감점이고, `dumpChill` 이 그 음료까지 버린다.
- 칠링 중(`chill==='icing'`)엔 잔에 얼음을 못 넣는다. 리밍은 잔이 빈 동안만. 음료가 든 잔은 `pickGlass` 로 못 바꾼다(`reset`).
- `glassIce` 레시피는 스트레인·빌드 전에 잔에 얼음. 예외: 설탕을 녹이는 빌드(올드 패션드·레몬 스쿼시)는 `preIceIds(recipe)` 재료를 얼음 전에.
- 용기에 재료·얼음을 더하면 `done` 이 false 로 돌아간다(다시 흔들어야 함). 셰이크·스터 용기는 큐브드, 블렌더는 크러시드 아이스가 정답.
- 플로트는 `pour{target:'glass', float:true}`. 레시피 순서(아래 → 위)대로 쌓아야 하고, 그 뒤 `stir{target:'glass'}` 하면 층이 깨진 것으로 감점.
- `fill` 재료는 양이 아니라 넣었는지만 본다. 같은 재료를 여러 번 부으면 합계로 계량한다. 탄산(category 'mixer')을 셰이커에 넣으면 기법 감점.
- `serve` 후엔 `reset` 외 모든 액션이 거부된다. `judge` 는 서빙 전 상태에도 호출할 수 있다.
