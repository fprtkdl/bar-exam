import type { ReactNode } from 'react'
import { garnishById } from '../data/practical'
import { ArtSvg, INK, LINE, THIN } from './svg'

/**
 * 가니쉬 그림. 좌표 원점 = 잔에 붙는 지점.
 * rim: 원점이 잔 오른쪽 테두리(조각이 테두리에 걸침) / pick: 칵테일 픽이 테두리에서 잔 안으로 / surface: 액면 위에 뿌림
 */
export type GarnishMount = 'rim' | 'pick' | 'surface'

const C = {
  lemon: '#ffe35a',
  lemonRind: '#f2c21b',
  lime: '#bfe36a',
  limeRind: '#6fb52c',
  orange: '#ffb04a',
  orangeRind: '#f07f1a',
  cherry: '#e0283c',
  olive: '#9cc04e',
  pimento: '#e0402f',
  pick: '#f4d06f',
  pine: '#ffe07a',
  pineRind: '#d9a23a',
  leaf: '#4fae5b',
  apple: '#fbf5d8',
  appleSkin: '#d93a3a',
  nutmeg: '#8a5a2b',
}

function Wheel({ flesh, rind, r = 13 }: { flesh: string; rind: string; r?: number }) {
  const segs = [0, 60, 120, 180, 240, 300]
  return (
    <g>
      <circle r={r} fill={rind} {...LINE} strokeWidth={2.5} />
      <circle r={r - 3} fill={flesh} />
      {segs.map((a) => (
        <line key={a} x1={0} y1={0} x2={(r - 4) * Math.cos((a * Math.PI) / 180)} y2={(r - 4) * Math.sin((a * Math.PI) / 180)} stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.85} />
      ))}
      <circle r={1.6} fill="#fff" />
    </g>
  )
}

/** 반달 웨지. 둥근 껍질이 바깥(오른쪽 아래) */
function Wedge({ flesh, rind }: { flesh: string; rind: string }) {
  return (
    <g transform="rotate(-25)">
      <path d="M-15 0 A15 15 0 0 0 15 0 Z" fill={rind} {...LINE} strokeWidth={2.5} />
      <path d="M-11.5 0 A11.5 11.5 0 0 0 11.5 0 Z" fill={flesh} />
      <path d="M0 0 L-6 8 M0 0 L0 10 M0 0 L6 8" stroke="#fff" strokeWidth={1.3} strokeLinecap="round" opacity={0.85} />
    </g>
  )
}

/** 비틀린 껍질 띠가 테두리 위에 걸쳐 잔 밖으로 늘어짐 */
function Twist({ color }: { color: string }) {
  const d = 'M-8 2 C-2 -10 10 -8 8 0 C6 8 -4 6 -2 14 C0 22 12 20 12 28'
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={4.5} strokeLinecap="round" />
    </g>
  )
}

function Cherry({ x = 0, y = 0, stem = true }: { x?: number; y?: number; stem?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {stem && <path d="M0 -5 C1 -12 5 -16 9 -18" fill="none" {...THIN} />}
      <circle r={6} fill={C.cherry} {...LINE} strokeWidth={2.5} />
      <circle cx={-2} cy={-2} r={1.6} fill="#fff" opacity={0.9} />
    </g>
  )
}

/** 원점 근처 테두리에 꽂히는 칵테일 픽 (위 끝 → 아래 끝) */
function Pick({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.pick} strokeWidth={1.8} strokeLinecap="round" />
      <circle cx={x1} cy={y1} r={2.6} fill={C.cherry} {...THIN} strokeWidth={1.5} />
    </g>
  )
}

/** 슬라이스 + 체리를 한 픽에 꽂아 테두리에 건 모양 (올드 패션드·위스키 사워) */
function FlagWithCherry({ flesh, rind }: { flesh: string; rind: string }) {
  return (
    <g>
      <Wheel flesh={flesh} rind={rind} />
      <Cherry x={-2} y={-15} stem={false} />
      <Pick x1={-6} y1={-26} x2={4} y2={8} />
    </g>
  )
}

function Pineapple() {
  return (
    <g>
      <path d="M-4 -6 L-10 -20 M0 -7 L0 -22 M4 -6 L10 -19" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d="M-4 -6 L-10 -20 M0 -7 L0 -22 M4 -6 L10 -19" stroke={C.leaf} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M-14 -6 L14 -6 L4 18 Q0 21 -4 18 Z" fill={C.pineRind} {...LINE} strokeWidth={2.5} />
      <path d="M-10 -3 L10 -3 L2 14 Q0 15 -2 14 Z" fill={C.pine} />
      <path d="M-6 1 L4 9 M6 1 L-3 10" stroke={C.pineRind} strokeWidth={1.2} opacity={0.7} />
    </g>
  )
}

const DEFS: Record<string, { mount: GarnishMount; draw: ReactNode; box: string }> = {
  cherry: {
    mount: 'pick',
    draw: (
      <g>
        <Pick x1={10} y1={-22} x2={-14} y2={20} />
        <Cherry x={-9} y={11} stem={false} />
      </g>
    ),
    box: '-24 -28 44 56',
  },
  'green-olive': {
    mount: 'pick',
    draw: (
      <g>
        <Pick x1={10} y1={-22} x2={-14} y2={22} />
        <g transform="translate(-8 11) rotate(-60)">
          <ellipse rx={8} ry={6} fill={C.olive} {...LINE} strokeWidth={2.5} />
          <circle cx={6} r={2.2} fill={C.pimento} />
        </g>
      </g>
    ),
    box: '-24 -28 44 56',
  },
  'orange-cherry': { mount: 'rim', draw: <FlagWithCherry flesh={C.orange} rind={C.orangeRind} />, box: '-18 -32 36 50' },
  'lemon-cherry': { mount: 'rim', draw: <FlagWithCherry flesh={C.lemon} rind={C.lemonRind} />, box: '-18 -32 36 50' },
  'pineapple-cherry': {
    mount: 'rim',
    draw: (
      <g>
        <Pineapple />
        <Cherry x={8} y={-12} stem={false} />
        <Pick x1={13} y1={-24} x2={0} y2={8} />
      </g>
    ),
    box: '-18 -28 36 52',
  },
  nutmeg: {
    mount: 'surface',
    draw: (
      <g fill={C.nutmeg}>
        {[-17, -11, -6, -1, 3, 8, 13, 18, -14, -3, 6, 15].map((x, i) => (
          <circle key={i} cx={x} cy={i < 8 ? 1 : 3} r={i % 3 === 0 ? 1.3 : 0.9} />
        ))}
      </g>
    ),
    box: '-22 -10 44 20',
  },
  'lemon-twist': { mount: 'rim', draw: <Twist color={C.lemonRind} />, box: '-16 -14 34 48' },
  'orange-twist': { mount: 'rim', draw: <Twist color={C.orangeRind} />, box: '-16 -14 34 48' },
  'lime-lemon-twist': { mount: 'rim', draw: <Twist color={C.limeRind} />, box: '-16 -14 34 48' },
  'lemon-slice': { mount: 'rim', draw: <Wheel flesh={C.lemon} rind={C.lemonRind} />, box: '-16 -16 32 32' },
  'lime-lemon-slice': { mount: 'rim', draw: <Wheel flesh={C.lime} rind={C.limeRind} />, box: '-16 -16 32 32' },
  'lemon-wedge': { mount: 'rim', draw: <Wedge flesh={C.lemon} rind={C.lemonRind} />, box: '-18 -10 36 28' },
  'lime-lemon-wedge': { mount: 'rim', draw: <Wedge flesh={C.lime} rind={C.limeRind} />, box: '-18 -10 36 28' },
  'apple-slice': {
    mount: 'rim',
    draw: (
      <g transform="rotate(-20)">
        <path d="M-15 -2 Q0 -6 15 -2 Q12 14 0 16 Q-12 14 -15 -2 Z" fill={C.apple} {...LINE} strokeWidth={2.5} />
        <path d="M-12.5 4 Q-9 13 0 14 Q9 13 12.5 4" fill="none" stroke={C.appleSkin} strokeWidth={3.5} strokeLinecap="round" />
        <ellipse cx={-3} cy={3} rx={1.2} ry={2} fill={C.nutmeg} />
        <ellipse cx={3} cy={3} rx={1.2} ry={2} fill={C.nutmeg} />
      </g>
    ),
    box: '-18 -10 36 28',
  },
}

/** 넛맥은 단독 그림일 때 씨앗 + 가루로 */
const NUTMEG_ICON = (
  <g>
    <ellipse cx={-4} cy={-2} rx={10} ry={8} fill={C.nutmeg} {...LINE} strokeWidth={2.5} />
    <path d="M-10 -4 Q-4 -8 2 -5 M-11 1 Q-4 -2 3 1" fill="none" stroke="#c99a68" strokeWidth={1.3} strokeLinecap="round" />
    {[8, 11, 14, 10, 13, 16].map((x, i) => (
      <circle key={i} cx={x} cy={i < 3 ? 6 : 9} r={1} fill={C.nutmeg} />
    ))}
  </g>
)

export const GARNISH_DEFS = DEFS

export function GarnishArt({ garnishId, size = 64 }: { garnishId: string; size?: number }) {
  const def = DEFS[garnishId]
  if (!def) return null
  const label = garnishById(garnishId)?.nameKo ?? garnishId
  const box = garnishId === 'nutmeg' ? '-16 -12 36 24' : def.box
  return (
    <ArtSvg kind="garnish" id={garnishId} label={label} viewBox={box} size={size}>
      {garnishId === 'nutmeg' ? NUTMEG_ICON : def.draw}
    </ArtSvg>
  )
}
