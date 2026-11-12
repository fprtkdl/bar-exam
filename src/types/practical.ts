/** 실기 데이터 계약. 데이터 파일: src/data/practical/** (계약 변경은 컨트롤러만) */

export type MethodId = 'build' | 'stir' | 'shake' | 'float' | 'blend'

export const METHOD_LABEL: Record<MethodId, string> = {
  build: '빌드 (Build)',
  stir: '스터 (Stir)',
  shake: '셰이크 (Shake)',
  float: '플로트 (Float)',
  blend: '블렌드 (Blend)',
}

export type IceType = 'cube' | 'crushed'

/** fill = 잔을 채움(amount 0), part = 비율(푸스카페·B-52), ea = 개 */
export type PourUnit = 'oz' | 'part' | 'tsp' | 'dash' | 'ea' | 'fill'

export type IngredientCategory =
  | 'spirit' // 증류주 (진·보드카·럼·테킬라·위스키·브랜디)
  | 'liqueur'
  | 'wine' // 와인·베르무트 등 양조주
  | 'traditional' // 전통주
  | 'juice'
  | 'syrup'
  | 'mixer' // 탄산·콜라·진저에일 등
  | 'dairy'
  | 'bitters'
  | 'other' // 설탕·소금·달걀 등

export type BottleShape = 'spirit' | 'liqueur' | 'wine' | 'juice' | 'soda' | 'bitters' | 'syrup' | 'carton' | 'jar'

export interface Ingredient {
  id: string // kebab-case 영문. 예: 'dry-gin'
  nameKo: string
  nameEn: string
  category: IngredientCategory
  /** 알코올 도수(%). 무알코올 0 */
  abv: number
  /** 액체 색 hex. 잔 채움·색 혼합에 사용 */
  color: string
  /** 0~1, 기본 0.85. 투명한 술(진·보드카)은 낮게 */
  opacity?: number
  bottle: BottleShape
  description: string
}

export interface Glass {
  id: string // 예: 'cocktail', 'highball'
  nameKo: string
  nameEn: string
  capacityOz: number
  stemmed: boolean
  description: string
}

export interface Garnish {
  id: string // 예: 'lemon-twist', 'cherry'
  nameKo: string
  nameEn: string
  description: string
}

export interface RecipeIngredient {
  ingredientId: string
  /** unit 이 fill 이면 0 */
  amount: number
  unit: PourUnit
  /** 이 재료가 들어가는 경로. shake=셰이커, stir=믹싱글라스, blend=블렌더, build=잔에 직접, float=잔 위에 띄움 */
  via: MethodId
}

export type BaseCategory =
  | 'gin'
  | 'vodka'
  | 'rum'
  | 'tequila'
  | 'whiskey'
  | 'brandy'
  | 'liqueur'
  | 'wine'
  | 'traditional'
  | 'non-alcoholic'

export interface Recipe {
  id: string // kebab-case. 예: 'dry-martini'
  nameEn: string
  nameKo: string
  base: BaseCategory
  glassId: string
  /** 공식 표기 순서. 예: ['shake','build'] */
  methods: MethodId[]
  /** 투입 순서대로. float 레시피는 아래층 → 위층 */
  ingredients: RecipeIngredient[]
  /** 서빙 잔에 넣는 얼음. 없으면 null */
  glassIce: IceType | null
  /** 잔 칠링 필요 여부 (얼음 없이 서빙하는 스템 잔 등) */
  chill: boolean
  rim: 'salt' | 'sugar' | null
  garnishIds: string[]
  /** 공식 가니쉬 표기 원문. 없으면 '없음' */
  garnishText: string
  /** 암기 팁·감점 포인트 */
  tip: string
}

/** 도구 id 고정 목록 (도감 내용·일러스트가 같은 id 사용) */
export const TOOL_IDS = [
  'cobbler-shaker',
  'boston-shaker',
  'mixing-glass',
  'bar-spoon',
  'strainer',
  'jigger',
  'muddler',
  'pourer',
  'squeezer',
  'blender',
  'ice-bucket',
  'ice-tongs',
  'ice-scoop',
  'ice-pick',
  'cocktail-pick',
  'bar-knife',
  'cutting-board',
  'corkscrew',
  'bottle-opener',
  'glass-rimmer',
  'coaster',
  'straw',
  'bar-towel',
] as const
export type ToolId = (typeof TOOL_IDS)[number]

export type GuideCategoryId = 'tools' | 'glasses' | 'spirits' | 'mixers' | 'garnishes' | 'ice' | 'techniques'

export interface GuideEntry {
  id: string
  nameKo: string
  nameEn: string
  /** 카테고리 내 소분류. 예: '증류주 > 위스키' */
  group: string
  summary: string
  /** 외형·특징 */
  features: string[]
  /** 사용법·주의점 */
  usage: string[]
  examTip?: string
  /** 연결할 일러스트. id 는 TOOL_IDS / glasses / ingredients / garnishes / IceType 의 id */
  art?: { kind: 'tool' | 'glass' | 'bottle' | 'garnish' | 'ice'; id: string }
}

export interface GuideCategory {
  id: GuideCategoryId
  title: string
  intro: string
  entries: GuideEntry[]
}
