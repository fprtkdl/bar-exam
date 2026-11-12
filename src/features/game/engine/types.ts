import type { IceType, MethodId, PourUnit } from '../../../types/practical'

export type Vessel = 'shaker' | 'mixingGlass' | 'blender'
export type Target = 'glass' | Vessel

/** 잔에 들어간 한 번의 투입 (아래 → 위, 부은 순서) */
export interface Layer {
  ingredientId: string
  amount: number
  unit: PourUnit
  /** 잔에 들어온 경로: build/float = 잔에 직접, shake/stir/blend = 해당 용기에서 스트레인 */
  via: MethodId
  /** 섞였는가. 용기 재료는 흔들기/젓기/갈기 수행 여부, float 은 잔에서 저어져 층이 깨졌는지 */
  mixed: boolean
  /** 스트레인 당시 용기 안 얼음 (잔에 직접 부은 것은 null) */
  vesselIce: IceType | null
  /** 들어올 때 서빙 잔에 얼음이 있었는가 */
  onIce: boolean
}

export interface GlassState {
  glassId: string | null
  /** icing = 칠링 얼음이 들어 있음, chilled = 칠링 후 얼음·물을 버림 */
  chill: 'none' | 'icing' | 'chilled'
  ice: IceType | null
  rim: 'salt' | 'sugar' | null
  layers: Layer[]
  garnishIds: string[]
  /** 칠링 얼음을 버리기 전에 음료를 따른 적이 있음 */
  pouredWhileIcing: boolean
}

export interface Pour {
  ingredientId: string
  amount: number
  unit: PourUnit
}

export interface Container {
  ice: IceType | null
  contents: Pour[]
  /** 흔들기/젓기/갈기를 마쳤는가 (이후 재료·얼음을 더하면 false) */
  done: boolean
}

export interface GameState {
  glass: GlassState
  shaker: Container
  mixingGlass: Container
  blender: Container
  served: boolean
  /** 성공한 액션만 순서대로 */
  log: Action[]
}

export type Action =
  | { type: 'pickGlass'; glassId: string }
  | { type: 'chillGlass' }
  | { type: 'dumpChill' }
  | { type: 'rim'; rim: 'salt' | 'sugar' }
  | { type: 'addIce'; target: Target; ice: IceType }
  | { type: 'pour'; target: Target; ingredientId: string; amount: number; unit: PourUnit; float?: boolean }
  | { type: 'shake' }
  | { type: 'stir'; target: 'mixingGlass' | 'glass' }
  | { type: 'blend' }
  | { type: 'strain'; from: Vessel }
  | { type: 'garnish'; garnishId: string }
  | { type: 'removeGarnish'; garnishId: string }
  | { type: 'reset' }
  | { type: 'serve' }

export type StepResult = { ok: true; state: GameState } | { ok: false; reason: string; state: GameState }

export type ScoreKey = 'glass' | 'chill' | 'ice' | 'ingredients' | 'measure' | 'technique' | 'garnish' | 'process'

export interface ScoreItem {
  key: ScoreKey
  label: string
  earned: number
  max: number
  ok: boolean
  /** 무엇이 틀렸고 정답이 무엇인지 (한국어) */
  message: string
}

export interface ScoreSheet {
  total: number
  max: 100
  items: ScoreItem[]
}
