import { glassById } from '../data/practical'
import type { IceType } from '../types/practical'
import { GARNISH_DEFS } from './GarnishArt'
import { isLight, shade } from './mixColor'
import { ArtSvg, INK, LINE, useSvgId } from './svg'

/**
 * 잔 정의. 모든 잔은 viewBox 0 0 120 160, 바닥 y=152 에 선다.
 * outer: 외곽선 / inner: 액체 clipPath / liq: [액면 최고 y, 볼 안쪽 바닥 y] / rim: [y, 왼쪽 x, 오른쪽 x]
 * ice: 얼음이 쌓이는 상자 [x1,y1,x2,y2] / stem: [스템 시작 y, 받침 반지름] (텀블러는 base = 두꺼운 바닥 시작 y)
 */
type GlassDef = {
  outer: string
  inner: string
  liq: [number, number]
  rim: [number, number, number]
  ice: [number, number, number, number]
  stem?: [number, number]
  base?: number
}

export const GLASS_DEFS: Record<string, GlassDef> = {
  cocktail: {
    outer: 'M12 28 H108 L64 80 Q60 84 56 80 Z',
    inner: 'M18 31 H102 L60 78 Z',
    liq: [32, 77],
    rim: [28, 12, 108],
    ice: [42, 40, 78, 72],
    stem: [82, 26],
  },
  'old-fashioned': {
    outer: 'M18 78 H102 L97 149 Q97 152 94 152 H26 Q23 152 23 149 Z',
    inner: 'M21.5 81 H98.5 L95 137 H25 Z',
    liq: [84, 137],
    rim: [78, 18, 102],
    ice: [26, 86, 94, 137],
    base: 137,
  },
  highball: {
    outer: 'M28 26 H92 L88 149 Q88 152 85 152 H35 Q32 152 32 149 Z',
    inner: 'M31.5 29 H88.5 L85.5 139 H34.5 Z',
    liq: [32, 139],
    rim: [26, 28, 92],
    ice: [35, 42, 85, 139],
    base: 139,
  },
  collins: {
    outer: 'M38 8 H82 L80 149 Q80 152 77 152 H43 Q40 152 40 149 Z',
    inner: 'M41.5 11 H78.5 L77 141 H43 Z',
    liq: [14, 141],
    rim: [8, 38, 82],
    ice: [43, 26, 77, 141],
    base: 141,
  },
  sour: {
    outer: 'M34 50 H86 C87 76 82 96 60 98 C38 96 33 76 34 50 Z',
    inner: 'M37.5 53 H82.5 C83 75 79 93 60 95 C41 93 37 75 37.5 53 Z',
    liq: [55, 95],
    rim: [50, 34, 86],
    ice: [42, 60, 78, 94],
    stem: [97, 22],
  },
  'footed-pilsner': {
    outer: 'M28 8 H92 C86 56 74 98 70 126 H50 C46 98 34 56 28 8 Z',
    inner: 'M31.5 11 H88.5 C82.5 56 71.5 96 67.5 123 H52.5 C48.5 96 37.5 56 31.5 11 Z',
    liq: [14, 123],
    rim: [8, 28, 92],
    ice: [40, 28, 80, 123],
    stem: [126, 22],
  },
  'champagne-saucer': {
    outer: 'M6 62 H114 C112 84 90 94 60 94 C30 94 8 84 6 62 Z',
    inner: 'M10 65 H110 C107 82 88 90.5 60 90.5 C32 90.5 13 82 10 65 Z',
    liq: [67, 90],
    rim: [62, 6, 114],
    ice: [32, 66, 88, 90],
    stem: [94, 28],
  },
  'champagne-flute': {
    outer: 'M44 8 H76 C78 48 77 84 64 94 H56 C43 84 42 48 44 8 Z',
    inner: 'M47.5 11 H72.5 C74.5 48 73.5 81 62 91 H58 C46.5 81 45.5 48 47.5 11 Z',
    liq: [14, 91],
    rim: [8, 44, 76],
    ice: [48, 40, 72, 90],
    stem: [94, 20],
  },
  'white-wine': {
    outer: 'M38 28 H82 C90 46 94 64 90 80 C86 96 74 102 60 102 C46 102 34 96 30 80 C26 64 30 46 38 28 Z',
    inner: 'M41 31 H79 C86.5 47 90.5 64 86.5 79 C83 93 72 98.5 60 98.5 C48 98.5 37 93 33.5 79 C29.5 64 33.5 47 41 31 Z',
    liq: [34, 98],
    rim: [28, 38, 82],
    ice: [40, 52, 80, 97],
    stem: [102, 24],
  },
  sherry: {
    outer: 'M40 74 H80 C83 92 79 106 65 112 H55 C41 106 37 92 40 74 Z',
    inner: 'M43.5 77 H76.5 C79 92 75.5 103.5 63.5 108.5 H56.5 C44.5 103.5 41 92 43.5 77 Z',
    liq: [79, 108],
    rim: [74, 40, 80],
    ice: [46, 80, 74, 107],
    stem: [112, 19],
  },
  liqueur: {
    outer: 'M48 66 H72 L70.5 112 Q60 122 49.5 112 Z',
    inner: 'M51 69 H69 L67.8 110.5 Q60 117.5 52.2 110.5 Z',
    liq: [71, 115],
    rim: [66, 48, 72],
    ice: [52, 72, 68, 114],
    stem: [118, 17],
  },
}

export type GlassFill = { layers: { color: string; ratio: number }[]; level: number }

type Props = {
  glassId: string
  fill?: GlassFill
  ice?: IceType | null
  garnishIds?: string[]
  rim?: 'salt' | 'sugar' | null
  /** 칠링된 잔(서리) */
  frosted?: boolean
  /** 높이 px (기본 160) */
  size?: number
  /** aria-label (기본: 잔 이름) */
  label?: string
}

const GLASS_TINT = '#e6f3fb'
const ROT = [-9, 6, -4, 11, -12, 3, 8, -6]

function iceShapes(type: IceType, [x1, y1, x2, y2]: GlassDef['ice']) {
  const w = x2 - x1
  const s = type === 'cube' ? Math.max(10, Math.min(19, w / 2.4)) : Math.max(6, Math.min(9, w / 5))
  const cols = Math.max(1, Math.floor(w / (s * 0.98)))
  const gap = (w - cols * s) / (cols + 1)
  const out: { x: number; y: number; r: number }[] = []
  let row = 0
  const stop = y2 - (y2 - y1) * 0.78
  for (let y = y2 - s * 0.55; y > stop + s * 0.3; y -= s * 0.9, row++) {
    for (let c = 0; c < cols; c++) {
      const x = x1 + gap + s / 2 + c * (s + gap) + (row % 2 ? s * 0.18 : -s * 0.12)
      out.push({ x, y, r: ROT[(row * 3 + c) % ROT.length] })
    }
  }
  return { s, out }
}

export function GlassArt({ glassId, fill, ice = null, garnishIds = [], rim = null, frosted = false, size = 160, label }: Props) {
  const uid = useSvgId()
  const def = GLASS_DEFS[glassId] ?? GLASS_DEFS.highball
  const name = label ?? glassById(glassId)?.nameKo ?? glassId
  const [top, bottom] = def.liq
  const [rimY, rimL, rimR] = def.rim
  const level = Math.max(0, Math.min(1, fill?.level ?? 0))
  const layers = (fill?.layers ?? []).filter((l) => l.ratio > 0)
  const ratioSum = layers.reduce((s, l) => s + l.ratio, 0)
  const liquidH = (bottom - top) * level
  const surfaceY = bottom - liquidH
  let cursor = bottom
  const rects = layers.map((l) => {
    const h = (liquidH * l.ratio) / ratioSum
    cursor -= h
    return { y: cursor, h, color: l.color }
  })
  const topColor = rects.at(-1)?.color
  const gScale = Math.max(0.55, Math.min(1, (rimR - rimL) / 64))
  const plain = level === 0 && !ice && garnishIds.length === 0 && !rim
  const iceSet = ice ? iceShapes(ice, def.ice) : null
  const clip = `url(#${uid}-in)`

  return (
    <ArtSvg kind={plain ? 'glass' : undefined} id={glassId} label={name} viewBox="0 0 120 160" size={size}>
      <defs>
        <clipPath id={`${uid}-in`}>
          <path d={def.inner} />
        </clipPath>
        <clipPath id={`${uid}-out`}>
          <path d={def.outer} />
        </clipPath>
      </defs>

      {def.stem && (
        <g>
          <rect x={57} y={def.stem[0] - 2} width={6} height={150 - def.stem[0]} fill={GLASS_TINT} {...LINE} />
          <ellipse cx={60} cy={150} rx={def.stem[1]} ry={4.5} fill={GLASS_TINT} {...LINE} />
        </g>
      )}

      <path d={def.outer} fill={GLASS_TINT} opacity={0.75} />
      {def.base && <rect x={0} y={def.base} width={120} height={20} fill="#cfe6f3" clipPath={`url(#${uid}-out)`} />}

      <g clipPath={clip}>
        {rects.map((r, i) => (
          <rect key={i} x={0} y={r.y} width={120} height={r.h + 0.6} fill={r.color} opacity={0.94} />
        ))}
        {topColor && liquidH > 0.5 && <line x1={0} x2={120} y1={surfaceY + 1} y2={surfaceY + 1} stroke={isLight(topColor) ? shade(topColor, -0.22) : shade(topColor, 0.45)} strokeWidth={2.5} />}
        {iceSet?.out.map((c, i) =>
          ice === 'cube' ? (
            <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.r})`}>
              <rect x={-iceSet.s / 2} y={-iceSet.s / 2} width={iceSet.s} height={iceSet.s} rx={3} fill="#ffffff" fillOpacity={0.32} stroke={INK} strokeWidth={1.6} strokeOpacity={0.75} />
              <path d={`M${-iceSet.s / 2 + 3} ${-iceSet.s / 2 + 5} L${-iceSet.s / 2 + 3} ${-iceSet.s / 2 + 3} L${-iceSet.s / 2 + 6} ${-iceSet.s / 2 + 3}`} fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" />
            </g>
          ) : (
            <path
              key={i}
              transform={`translate(${c.x} ${c.y}) rotate(${c.r * 4})`}
              d={`M${-iceSet.s / 2} 0 L${-iceSet.s / 4} ${-iceSet.s / 2} L${iceSet.s / 2} ${-iceSet.s / 3} L${iceSet.s / 3} ${iceSet.s / 2} L${-iceSet.s / 3} ${iceSet.s / 3} Z`}
              fill="#ffffff"
              fillOpacity={0.6}
              stroke={INK}
              strokeWidth={1.2}
              strokeOpacity={0.6}
              strokeLinejoin="round"
            />
          ),
        )}
        {garnishIds
          .filter((g) => GARNISH_DEFS[g]?.mount === 'surface')
          .map((g) => (
            <g key={g} transform={`translate(60 ${Math.min(surfaceY, bottom - 3) + 1.5}) scale(${(rimR - rimL) / 44} 1)`}>
              {GARNISH_DEFS[g].draw}
            </g>
          ))}
        <path d={`M${rimL + 8} ${rimY + 6} L${rimL + 10} ${bottom - 8}`} stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      </g>

      {frosted && (
        <g clipPath={`url(#${uid}-out)`}>
          <rect x={0} y={0} width={120} height={160} fill="#ffffff" opacity={0.16} />
          <path d={def.outer} fill="none" stroke="#ffffff" strokeWidth={7} opacity={0.75} />
        </g>
      )}

      <path d={def.outer} fill="none" {...LINE} />

      {rim && (
        <g>
          <rect x={rimL - 2} y={rimY - 2.5} width={rimR - rimL + 4} height={5} rx={2.5} fill={rim === 'salt' ? '#ffffff' : '#fff1c9'} stroke={INK} strokeWidth={1.5} />
          {Array.from({ length: Math.floor((rimR - rimL) / 4) }, (_, i) => (
            <rect key={i} x={rimL + 1 + i * 4} y={rimY - (i % 2 ? 1.5 : 0)} width={1.6} height={1.6} fill={INK} opacity={0.35} />
          ))}
        </g>
      )}

      {garnishIds
        .filter((g) => GARNISH_DEFS[g] && GARNISH_DEFS[g].mount !== 'surface')
        .map((g, i) => {
          const left = i % 2 === 1
          const x = left ? rimL + 2 : rimR - 2
          return (
            <g key={g} transform={`translate(${x} ${rimY}) scale(${left ? -gScale : gScale} ${gScale})`}>
              {GARNISH_DEFS[g].draw}
            </g>
          )
        })}
    </ArtSvg>
  )
}
