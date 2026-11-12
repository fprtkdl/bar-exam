import { garnishById, glassById, ingredientById } from '../../../data/practical'
import { VESSEL_LABEL, VESSEL_METHOD } from './amount'
import type { Action, Container, GameState, GlassState, Layer, StepResult, Vessel } from './types'

const emptyContainer = (): Container => ({ ice: null, contents: [], done: false })
const emptyGlass = (glassId: string | null = null): GlassState => ({
  glassId,
  chill: 'none',
  ice: null,
  rim: null,
  layers: [],
  garnishIds: [],
  pouredWhileIcing: false,
})

export const initialState = (): GameState => ({
  glass: emptyGlass(),
  shaker: emptyContainer(),
  mixingGlass: emptyContainer(),
  blender: emptyContainer(),
  served: false,
  log: [],
})

/** 액션 하나 적용. 불가능하면 상태를 그대로 두고 ok:false + 한국어 사유 */
export function step(state: GameState, action: Action): StepResult {
  const fail = (reason: string): StepResult => ({ ok: false, reason, state })
  if (action.type === 'reset') return { ok: true, state: initialState() }
  if (state.served) return fail('이미 서빙했습니다. 처음부터 다시 하려면 초기화하세요.')

  const next = (patch: Partial<GameState>): StepResult => ({ ok: true, state: { ...state, ...patch, log: [...state.log, action] } })
  const g = state.glass
  const setGlass = (patch: Partial<GlassState>) => next({ glass: { ...g, ...patch } })
  const intoGlass = (layers: Layer[], patch: Partial<GlassState> = {}) =>
    setGlass({ layers: [...g.layers, ...layers], pouredWhileIcing: g.pouredWhileIcing || g.chill === 'icing', ...patch })
  const noGlass = '먼저 잔을 고르세요.'

  switch (action.type) {
    case 'pickGlass': {
      if (!glassById(action.glassId)) return fail('없는 잔입니다.')
      if (g.layers.length) return fail('잔에 음료가 들어 있습니다. 잔을 바꾸려면 초기화하세요.')
      return setGlass(emptyGlass(action.glassId))
    }
    case 'chillGlass': {
      if (!g.glassId) return fail(noGlass)
      if (g.chill === 'icing') return fail('이미 칠링 중입니다.')
      if (g.layers.length || g.ice) return fail('칠링은 빈 잔에만 할 수 있습니다.')
      return setGlass({ chill: 'icing' })
    }
    case 'dumpChill': {
      if (g.chill !== 'icing') return fail('버릴 칠링 얼음이 없습니다.')
      // 칠링 얼음 위에 따른 음료도 함께 버려진다
      return setGlass({ chill: 'chilled', layers: [] })
    }
    case 'rim': {
      if (!g.glassId) return fail(noGlass)
      if (g.layers.length) return fail('리밍은 음료를 따르기 전에 해야 합니다.')
      return setGlass({ rim: action.rim })
    }
    case 'addIce': {
      if (action.target === 'glass') {
        if (!g.glassId) return fail(noGlass)
        if (g.chill === 'icing') return fail('칠링 얼음과 녹은 물을 먼저 버리세요.')
        return setGlass({ ice: action.ice })
      }
      return next({ [action.target]: { ...state[action.target], ice: action.ice, done: false } })
    }
    case 'pour': {
      const { target, ingredientId, amount, unit } = action
      if (!ingredientById(ingredientId)) return fail('없는 재료입니다.')
      if (unit === 'fill' ? amount !== 0 : !(amount > 0)) return fail('계량값이 올바르지 않습니다.')
      if (target === 'glass') {
        if (!g.glassId) return fail(noGlass)
        const via = action.float ? 'float' : 'build'
        return intoGlass([{ ingredientId, amount, unit, via, mixed: false, vesselIce: null, onIce: g.ice !== null }])
      }
      if (action.float) return fail('플로트는 서빙 잔에만 할 수 있습니다.')
      const c = state[target]
      return next({ [target]: { ...c, contents: [...c.contents, { ingredientId, amount, unit }], done: false } })
    }
    case 'shake':
    case 'blend': {
      const v: Vessel = action.type === 'shake' ? 'shaker' : 'blender'
      if (!state[v].contents.length) return fail(`${VESSEL_LABEL[v]}가 비어 있습니다.`)
      return next({ [v]: { ...state[v], done: true } })
    }
    case 'stir': {
      if (action.target === 'glass') {
        if (!g.layers.length) return fail('잔이 비어 있습니다.')
        return setGlass({ layers: g.layers.map((l) => ({ ...l, mixed: true })) })
      }
      if (!state.mixingGlass.contents.length) return fail('믹싱 글라스가 비어 있습니다.')
      return next({ mixingGlass: { ...state.mixingGlass, done: true } })
    }
    case 'strain': {
      const v = action.from
      const c = state[v]
      if (!g.glassId) return fail(noGlass)
      if (!c.contents.length) return fail(`${VESSEL_LABEL[v]}가 비어 있습니다.`)
      const onIce = g.ice !== null
      const layers = c.contents.map((p) => ({ ...p, via: VESSEL_METHOD[v], mixed: c.done, vesselIce: c.ice, onIce }))
      // 블렌더는 얼음째 붓는다
      const isBlender = v === 'blender'
      const r = intoGlass(layers, isBlender && c.ice ? { ice: c.ice } : {})
      if (!r.ok) return r
      return { ok: true, state: { ...r.state, [v]: { ice: isBlender ? null : c.ice, contents: [], done: false } } }
    }
    case 'garnish': {
      if (!g.glassId) return fail(noGlass)
      if (!garnishById(action.garnishId)) return fail('없는 가니쉬입니다.')
      if (g.garnishIds.includes(action.garnishId)) return fail('이미 올린 가니쉬입니다.')
      return setGlass({ garnishIds: [...g.garnishIds, action.garnishId] })
    }
    case 'removeGarnish': {
      if (!g.garnishIds.includes(action.garnishId)) return fail('올리지 않은 가니쉬입니다.')
      return setGlass({ garnishIds: g.garnishIds.filter((id) => id !== action.garnishId) })
    }
    case 'serve': {
      if (!g.glassId) return fail(noGlass)
      if (!g.layers.length) return fail('잔이 비어 있습니다.')
      return next({ served: true })
    }
  }
}

/** 액션 목록을 처음부터 실행. 하나라도 불가능하면 예외 (테스트·풀이 재생용) */
export function run(actions: Action[], from: GameState = initialState()): GameState {
  return actions.reduce((s, a) => {
    const r = step(s, a)
    if (!r.ok) throw new Error(`${a.type}: ${r.reason}`)
    return r.state
  }, from)
}
