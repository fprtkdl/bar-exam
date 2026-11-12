import type { ReactNode } from 'react'
import { ingredientById } from '../data/practical'
import type { BottleShape } from '../types/practical'
import { shade } from './mixColor'
import { ArtSvg, INK, LINE, useSvgId } from './svg'

/** 병 라벨 (짧은 한국어). 재료 id 마다 하나 */
export const BOTTLE_LABEL: Record<string, string> = {
  'bourbon-whiskey': '버번', 'scotch-whisky': '스카치', 'dry-gin': '진', vodka: '보드카', 'light-rum': '럼',
  'bacardi-rum-white': '바카디', tequila: '데킬라', brandy: '브랜디', 'apple-brandy': '애플BR',
  'creme-de-menthe-green': '망트G', 'creme-de-menthe-white': '망트W', 'creme-de-cacao-brown': '카카오B', 'creme-de-cacao-white': '카카오W',
  'coffee-liqueur': '커피', drambuie: '드람뷔', 'triple-sec': '트리플섹', baileys: '베일리스', 'grand-marnier': '그랑마니에',
  midori: '미도리', 'coconut-rum': '코코넛', 'banana-liqueur': '바나나', 'cherry-brandy': '체리BR', 'apricot-brandy': '살구BR',
  'apple-pucker': '애플퍼커', benedictine: 'D.O.M', 'blue-curacao': '큐라소', 'creme-de-cassis': '카시스', campari: '캄파리',
  'sweet-vermouth': '베르무트S', 'dry-vermouth': '베르무트D', 'white-wine': '와인',
  gamhongro: '감홍로', 'jindo-hongju': '홍주', 'andong-soju': '안동소주', 'geumsan-insamju': '인삼주', 'bokbunja-wine': '복분자',
  'lemon-juice': '레몬', 'lime-juice': '라임', 'fresh-lemon': '생레몬', 'orange-juice': '오렌지', 'pineapple-juice': '파인',
  'cranberry-juice': '크랜베리', 'grapefruit-juice': '자몽', 'white-grape-juice': '청포도',
  'grenadine-syrup': '그레나딘', 'raspberry-syrup': '라즈베리', 'sweet-sour-mix': '사워믹스', 'pina-colada-mix': '피냐믹스',
  'soda-water': '소다', cola: '콜라', 'ginger-ale': '진저에일', sprite: '사이다',
  'light-milk': '우유', 'angostura-bitters': '비터스', 'powdered-sugar': '설탕', salt: '소금',
}

/**
 * 병 실루엣. viewBox 0 0 60 150, 바닥 y=148.
 * body: 외곽선 / liquid: 내용물이 차는 높이(y) / label: [x,y,w,h] / opaque: 불투명 용기(내용물 대신 용기 색 = 재료 색) / cap: 마개
 */
type ShapeDef = { body: string; liquid: number; label: [number, number, number, number]; opaque?: boolean; cap: ReactNode }

const SHAPES: Record<BottleShape, ShapeDef> = {
  spirit: {
    body: 'M24 22 H36 V40 C36 46 50 48 50 58 V144 Q50 148 46 148 H14 Q10 148 10 144 V58 C10 48 24 46 24 40 Z',
    liquid: 56,
    label: [12, 82, 36, 30],
    cap: <rect x={22.5} y={10} width={15} height={14} rx={2} fill="#2f3a6b" {...LINE} />,
  },
  liqueur: {
    body: 'M25 30 H35 V44 C35 52 52 58 52 82 V140 Q52 148 44 148 H16 Q8 148 8 140 V82 C8 58 25 52 25 44 Z',
    liquid: 62,
    label: [12, 92, 36, 28],
    cap: <rect x={23.5} y={18} width={13} height={14} rx={3} fill="#c9a24a" {...LINE} />,
  },
  wine: {
    body: 'M26 18 H34 V50 C34 62 46 64 46 78 V144 Q46 148 42 148 H18 Q14 148 14 144 V78 C14 64 26 62 26 50 Z',
    liquid: 70,
    label: [16, 96, 28, 30],
    cap: <rect x={25} y={6} width={10} height={20} rx={1.5} fill="#8b2a3a" {...LINE} />,
  },
  juice: {
    body: 'M22 32 H38 V40 C46 44 50 50 50 60 V142 Q50 148 44 148 H16 Q10 148 10 142 V60 C10 50 14 44 22 40 Z',
    liquid: 52,
    label: [12, 74, 36, 40],
    cap: <rect x={20} y={22} width={20} height={11} rx={2} fill="#ffffff" {...LINE} />,
  },
  soda: {
    body: 'M26 24 H34 V40 C34 50 44 54 44 66 C44 78 38 82 38 92 C38 102 46 106 46 118 V144 Q46 148 42 148 H18 Q14 148 14 144 V118 C14 106 22 102 22 92 C22 82 16 78 16 66 C16 54 26 50 26 40 Z',
    liquid: 50,
    label: [15, 108, 30, 22],
    cap: <rect x={24} y={16} width={12} height={9} rx={1.5} fill="#d64545" {...LINE} />,
  },
  bitters: {
    body: 'M25 52 H35 V64 C42 66 44 70 44 78 V144 Q44 148 40 148 H20 Q16 148 16 144 V78 C16 70 18 66 25 64 Z',
    liquid: 80,
    label: [13, 84, 34, 54],
    cap: <rect x={23} y={40} width={14} height={14} rx={2} fill="#f2c94c" {...LINE} />,
  },
  syrup: {
    body: 'M26 26 H34 V44 C34 52 44 54 44 64 V144 Q44 148 40 148 H20 Q16 148 16 144 V64 C16 54 26 52 26 44 Z',
    liquid: 58,
    label: [17, 84, 26, 32],
    cap: (
      <g>
        <rect x={24.5} y={18} width={11} height={10} rx={2} fill="#3c3c3c" {...LINE} />
        <path d="M28 18 L30 6 L33 7 L31.5 18 Z" fill="#cfd8e3" {...LINE} strokeWidth={2} />
      </g>
    ),
  },
  carton: {
    body: 'M12 48 L30 28 L48 48 V146 Q48 148 46 148 H14 Q12 148 12 146 Z',
    liquid: 48,
    label: [14, 76, 32, 38],
    opaque: true,
    cap: (
      <g>
        <rect x={26} y={18} width={8} height={12} fill="#f5f5f5" {...LINE} />
        <path d="M12 48 H48" {...LINE} />
      </g>
    ),
  },
  jar: {
    body: 'M10 76 H50 V142 Q50 148 44 148 H16 Q10 148 10 142 Z',
    liquid: 96,
    label: [13, 112, 34, 22],
    cap: <rect x={8} y={64} width={44} height={14} rx={3} fill="#e8eef4" {...LINE} />,
  },
}

export const BOTTLE_SHAPES = SHAPES

export function BottleArt({ ingredientId, size = 140 }: { ingredientId: string; size?: number }) {
  const uid = useSvgId()
  const ing = ingredientById(ingredientId)
  const shape = SHAPES[ing?.bottle ?? 'spirit']
  const color = ing?.color ?? '#eef6fa'
  const text = BOTTLE_LABEL[ingredientId] ?? ing?.nameKo ?? ingredientId
  const [lx, ly, lw, lh] = shape.label
  const fontSize = Math.min(9, lw / 3.2)
  return (
    <ArtSvg kind="bottle" id={ingredientId} label={ing?.nameKo ?? ingredientId} viewBox="0 0 60 150" size={size}>
      <defs>
        <clipPath id={`${uid}-b`}>
          <path d={shape.body} />
        </clipPath>
      </defs>
      {shape.cap}
      <path d={shape.body} fill={shape.opaque ? shade(color, 0.15) : '#e6f3fb'} opacity={shape.opaque ? 1 : 0.85} />
      {!shape.opaque && (
        <rect x={0} y={shape.liquid} width={60} height={150} fill={color} opacity={Math.max(0.35, ing?.opacity ?? 0.85)} clipPath={`url(#${uid}-b)`} />
      )}
      <path d="M15 64 V136" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.6} clipPath={`url(#${uid}-b)`} />
      <path d={shape.body} fill="none" {...LINE} />
      <rect x={lx} y={ly} width={lw} height={lh} rx={2} fill="#fffaf0" stroke={INK} strokeWidth={2} />
      <rect x={lx + 3} y={ly + 3} width={lw - 6} height={3} fill={shade(color, -0.1)} />
      <text
        x={lx + lw / 2}
        y={ly + lh / 2 + fontSize * 0.55}
        textAnchor="middle"
        fontFamily="Galmuri11, sans-serif"
        fontSize={fontSize}
        fill={INK}
        {...(text.length * fontSize > lw - 4 ? { textLength: lw - 4, lengthAdjust: 'spacingAndGlyphs' } : {})}
      >
        {text}
      </text>
    </ArtSvg>
  )
}
