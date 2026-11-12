import type { ReactNode } from 'react'
import type { ToolId } from '../types/practical'
import { ArtSvg, INK, LINE, THIN } from './svg'

const STEEL = '#d5dee8'
const STEEL_D = '#a3b3c6'
const WOOD = '#d9a06c'
const GLASS = '#e6f3fb'
const RED = '#e8505b'
const L = LINE
const T = THIN

/** 도구 그림. viewBox 0 0 100 100, 바닥 y≈92 */
export const TOOL_ART: Record<ToolId, { label: string; draw: ReactNode }> = {
  'cobbler-shaker': {
    label: '쉐이커(코블러)',
    draw: (
      <g>
        <rect x={43} y={6} width={14} height={9} rx={3} fill={STEEL} {...L} />
        <path d="M38 15 H62 L66 32 H34 Z" fill={STEEL} {...L} />
        <path d="M33 32 H67 L64 92 H36 Z" fill={STEEL} {...L} />
        <path d="M33 38 H67" {...T} />
        <path d="M42 42 L41 84" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      </g>
    ),
  },
  'boston-shaker': {
    label: '보스턴 쉐이커',
    draw: (
      <g>
        <path d="M30 44 H70 L64 92 H36 Z" fill={STEEL} {...L} />
        <g transform="rotate(-6 50 30)">
          <path d="M36 50 H64 L68 8 H32 Z" fill={GLASS} {...L} />
          <path d="M38 14 L40 44" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
        </g>
        <path d="M30 50 H70" {...T} />
        <path d="M40 58 L42 86" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      </g>
    ),
  },
  'mixing-glass': {
    label: '믹싱 글라스',
    draw: (
      <g>
        <path d="M24 22 H76 L80 16 L78 26 L74 90 Q74 92 72 92 H28 Q26 92 26 90 Z" fill={GLASS} {...L} />
        <path d="M26 82 H74" {...T} />
        {[36, 46, 56, 66].map((x) => (
          <path key={x} d={`M${x} 28 V78`} stroke={INK} strokeWidth={1} opacity={0.25} />
        ))}
        <path d="M31 30 L32 76" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      </g>
    ),
  },
  'bar-spoon': {
    label: '바 스푼',
    draw: (
      <g transform="rotate(35 50 50)">
        <path d="M50 18 V84" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <path d="M50 18 V84" stroke={STEEL} strokeWidth={3} strokeLinecap="round" />
        {[26, 34, 42, 50, 58, 66, 74].map((y) => (
          <path key={y} d={`M47.5 ${y} L52.5 ${y + 4}`} stroke={INK} strokeWidth={1.2} />
        ))}
        <circle cx={50} cy={10} r={6} fill={STEEL} {...L} />
        <ellipse cx={50} cy={90} rx={6} ry={8} fill={STEEL} {...L} />
      </g>
    ),
  },
  strainer: {
    label: '스트레이너',
    draw: (
      <g>
        <rect x={56} y={44} width={38} height={10} rx={5} fill={STEEL} {...L} />
        <circle cx={38} cy={50} r={26} fill={STEEL} {...L} />
        <circle cx={38} cy={50} r={26} fill="none" stroke={INK} strokeWidth={5} strokeDasharray="2 4" opacity={0.6} />
        {[30, 38, 46].flatMap((x) => [42, 50, 58].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2} fill={INK} opacity={0.55} />))}
        <path d="M18 28 L12 22 M58 28 L64 22" {...L} />
      </g>
    ),
  },
  jigger: {
    label: '지거',
    draw: (
      <g>
        <path d="M30 8 H70 L54 48 H46 Z" fill={STEEL} {...L} />
        <path d="M46 52 H54 L66 92 H34 Z" fill={STEEL} {...L} />
        <rect x={42} y={46} width={16} height={8} rx={2} fill={STEEL_D} {...L} />
        <path d="M38 14 L47 40 M42 86 L49 58" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
      </g>
    ),
  },
  muddler: {
    label: '머들러',
    draw: (
      <g transform="rotate(30 50 50)">
        <path d="M44 6 H56 Q58 6 58 9 L60 74 H40 L42 9 Q42 6 44 6 Z" fill={WOOD} {...L} />
        <rect x={38} y={74} width={24} height={18} rx={4} fill="#b9794a" {...L} />
        <path d="M46 14 L45 66" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" opacity={0.6} />
      </g>
    ),
  },
  pourer: {
    label: '푸어러',
    draw: (
      <g>
        <path d="M38 56 H62 L60 90 H40 Z" fill="#3c3f58" {...L} />
        {[64, 72, 80].map((y) => (
          <path key={y} d={`M39 ${y} H61`} stroke="#8890b8" strokeWidth={1.5} />
        ))}
        <rect x={34} y={48} width={32} height={9} rx={3} fill={STEEL} {...L} />
        <path d="M47 48 L47 30 L80 10 L84 16 L54 34 L54 48 Z" fill={STEEL} {...L} />
      </g>
    ),
  },
  squeezer: {
    label: '스퀴저',
    draw: (
      <g>
        <ellipse cx={46} cy={80} rx={36} ry={10} fill={GLASS} {...L} />
        <path d="M10 80 V70 H82 V80" fill={GLASS} {...L} />
        <ellipse cx={46} cy={70} rx={36} ry={10} fill="#f2f9fd" {...L} />
        <path d="M32 70 Q34 36 46 30 Q58 36 60 70 Z" fill={GLASS} {...L} />
        <path d="M40 66 Q41 44 46 34 M52 66 Q51 44 46 34" {...T} />
        <rect x={80} y={70} width={14} height={8} rx={3} fill={GLASS} {...L} />
      </g>
    ),
  },
  blender: {
    label: '블렌더',
    draw: (
      <g>
        <rect x={34} y={4} width={32} height={8} rx={3} fill="#3c3f58" {...L} />
        <path d="M32 12 H68 L64 64 H36 Z" fill={GLASS} {...L} />
        <path d="M68 20 Q80 22 78 36 Q76 48 66 48" fill="none" {...L} />
        <path d="M44 56 L56 52 M44 52 L56 56" {...T} />
        <path d="M38 18 L40 58" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
        <path d="M28 64 H72 L76 92 H24 Z" fill={RED} {...L} />
        <circle cx={50} cy={78} r={5} fill="#fff" {...T} />
      </g>
    ),
  },
  'ice-bucket': {
    label: '아이스 페일(버킷)',
    draw: (
      <g>
        <path d="M24 36 L29 26 H38 L36 32 Z M76 36 L71 26 H62 L64 32 Z" fill={STEEL} {...T} />
        <rect x={34} y={20} width={14} height={14} rx={2} fill="#eaf7ff" {...T} transform="rotate(-10 41 27)" />
        <rect x={50} y={18} width={14} height={14} rx={2} fill="#eaf7ff" {...T} transform="rotate(12 57 25)" />
        <path d="M20 32 H80 L72 92 H28 Z" fill={STEEL} {...L} />
        <path d="M23 44 H77 M25 80 H75" {...T} />
        <path d="M30 50 L33 74" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      </g>
    ),
  },
  'ice-tongs': {
    label: '아이스 텅',
    draw: (
      <g>
        <path d="M50 8 Q42 8 40 18 L22 84" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
        <path d="M50 8 Q58 8 60 18 L78 84" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
        <path d="M50 8 Q42 8 40 18 L22 84" fill="none" stroke={STEEL} strokeWidth={4} strokeLinecap="round" />
        <path d="M50 8 Q58 8 60 18 L78 84" fill="none" stroke={STEEL} strokeWidth={4} strokeLinecap="round" />
        <path d="M16 82 L20 92 L26 84 L30 92 M84 82 L80 92 L74 84 L70 92" fill="none" {...T} />
      </g>
    ),
  },
  'ice-scoop': {
    label: '아이스 스쿱',
    draw: (
      <g transform="rotate(-20 50 50)">
        <path d="M14 34 H62 Q70 34 70 50 Q70 66 62 66 H14 Q22 50 14 34 Z" fill={STEEL} {...L} />
        <rect x={68} y={45} width={26} height={10} rx={5} fill="#3c3f58" {...L} />
        <path d="M24 40 Q30 50 24 60" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
      </g>
    ),
  },
  'ice-pick': {
    label: '아이스 픽',
    draw: (
      <g transform="rotate(35 50 50)">
        <rect x={42} y={6} width={16} height={36} rx={6} fill={WOOD} {...L} />
        <rect x={44} y={42} width={12} height={6} fill={STEEL_D} {...L} />
        <path d="M48 48 H52 L50 94 Z" fill={STEEL} {...L} />
      </g>
    ),
  },
  'cocktail-pick': {
    label: '칵테일 픽',
    draw: (
      <g>
        {[
          [28, '#e8505b'],
          [50, '#3fa7d6'],
          [72, '#5cbf72'],
        ].map(([x, c], i) => (
          <g key={i} transform={`rotate(${(i - 1) * 14} ${x} 60)`}>
            <path d={`M${x} 26 V92`} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
            <path d={`M${x} 26 V92`} stroke="#f4d06f" strokeWidth={2} strokeLinecap="round" />
            <circle cx={Number(x)} cy={20} r={7} fill={String(c)} {...L} />
          </g>
        ))}
      </g>
    ),
  },
  'bar-knife': {
    label: '바 나이프',
    draw: (
      <g transform="rotate(-35 50 50)">
        <path d="M10 44 H58 V56 H18 Q10 52 10 44 Z" fill={STEEL} {...L} />
        <rect x={58} y={42} width={34} height={16} rx={6} fill="#3c3f58" {...L} />
        <circle cx={68} cy={50} r={1.8} fill="#fff" />
        <circle cx={82} cy={50} r={1.8} fill="#fff" />
        <path d="M18 48 H52" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      </g>
    ),
  },
  'cutting-board': {
    label: '커팅 보드',
    draw: (
      <g>
        <path d="M8 46 H80 Q92 46 92 58 V82 Q92 90 84 90 H14 Q8 90 8 84 Z" fill={WOOD} {...L} />
        <circle cx={82} cy={60} r={4} fill="#fff8ea" {...T} />
        <path d="M16 78 H70" stroke="#b9794a" strokeWidth={2} strokeLinecap="round" />
        <path d="M22 62 A16 16 0 0 1 54 62 Z" fill="#f2c21b" {...L} />
        <path d="M25.5 62 A12.5 12.5 0 0 1 50.5 62 Z" fill="#ffe35a" />
        <path d="M38 62 L30 54 M38 62 V50 M38 62 L46 54" stroke="#fff" strokeWidth={1.3} />
      </g>
    ),
  },
  corkscrew: {
    label: '코르크 스크류',
    draw: (
      <g>
        <rect x={10} y={30} width={78} height={14} rx={7} fill="#3c3f58" {...L} />
        <path d="M80 37 L94 22" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <path d="M80 37 L94 22" stroke={STEEL} strokeWidth={2.5} strokeLinecap="round" />
        <path d="M40 44 V50 Q48 54 40 58 Q32 62 40 66 Q48 70 40 74 Q32 78 40 82 L40 90" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <path d="M40 44 V50 Q48 54 40 58 Q32 62 40 66 Q48 70 40 74 Q32 78 40 82 L40 90" fill="none" stroke={STEEL} strokeWidth={2.5} strokeLinecap="round" />
        <path d="M14 30 L22 22 H28 L24 30" fill={STEEL} {...T} />
      </g>
    ),
  },
  'bottle-opener': {
    label: '병따개',
    draw: (
      <g transform="rotate(-30 50 50)">
        <path d="M20 36 Q8 36 8 50 Q8 64 20 64 H90 Q94 64 94 60 V40 Q94 36 90 36 Z" fill={STEEL} {...L} />
        <path d="M14 46 Q14 42 20 42 H30 Q34 42 34 46 L28 50 L34 54 Q34 58 30 58 H20 Q14 58 14 54 Z" fill="#fff8ea" {...T} />
        <circle cx={84} cy={50} r={4} fill="#fff8ea" {...T} />
      </g>
    ),
  },
  'glass-rimmer': {
    label: '글라스 리머',
    draw: (
      <g>
        <path d="M14 70 V82 Q50 94 86 82 V70" fill="#7aa6d6" {...L} />
        <ellipse cx={50} cy={70} rx={36} ry={10} fill="#ffffff" {...L} />
        <path d="M18 54 V66 Q50 78 82 66 V54" fill="#f5c26b" {...L} />
        <ellipse cx={50} cy={54} rx={32} ry={9} fill="#fff1c9" {...L} />
        <path d="M24 38 V50 Q50 62 76 50 V38" fill="#9bd3ae" {...L} />
        <ellipse cx={50} cy={38} rx={26} ry={8} fill="#c9ecd6" {...L} />
        {[38, 46, 54, 62].map((x) => (
          <circle key={x} cx={x} cy={56} r={1.2} fill={INK} opacity={0.4} />
        ))}
      </g>
    ),
  },
  coaster: {
    label: '코스터',
    draw: (
      <g>
        <ellipse cx={50} cy={70} rx={40} ry={16} fill="#b9794a" {...L} />
        <ellipse cx={50} cy={66} rx={40} ry={16} fill="#f2e3c9" {...L} />
        <ellipse cx={50} cy={66} rx={30} ry={11} fill="none" stroke={RED} strokeWidth={2.5} />
        <ellipse cx={50} cy={66} rx={14} ry={5} fill="#ffc9b0" {...T} />
      </g>
    ),
  },
  straw: {
    label: '스트로',
    draw: (
      <g>
        {[
          [36, -12, RED],
          [60, 10, '#3fa7d6'],
        ].map(([x, r, c], i) => (
          <g key={i} transform={`rotate(${r} ${x} 92)`}>
            <rect x={Number(x) - 5} y={10} width={10} height={82} rx={4} fill="#fff" {...L} />
            {[16, 30, 44, 58, 72].map((y) => (
              <path key={y} d={`M${Number(x) - 4} ${y + 8} L${Number(x) + 4} ${y}`} stroke={String(c)} strokeWidth={4} />
            ))}
            <rect x={Number(x) - 5} y={10} width={10} height={82} rx={4} fill="none" {...L} />
          </g>
        ))}
      </g>
    ),
  },
  'bar-towel': {
    label: '바 타월(리넨)',
    draw: (
      <g>
        <path d="M12 40 Q14 34 20 34 H82 Q88 34 88 40 L86 86 Q86 90 82 90 H18 Q12 90 12 86 Z" fill="#ffffff" {...L} />
        <path d="M12 52 Q50 58 88 52" fill="none" {...T} />
        <path d="M16 64 H84 M16 72 H84" stroke="#3fa7d6" strokeWidth={4} />
        <path d="M20 34 Q16 46 20 52" fill="none" {...T} />
      </g>
    ),
  },
}

export function ToolArt({ toolId, size = 80 }: { toolId: ToolId; size?: number }) {
  const art = TOOL_ART[toolId]
  if (!art) return null
  return (
    <ArtSvg kind="tool" id={toolId} label={art.label} viewBox="0 0 100 100" size={size}>
      {art.draw}
    </ArtSvg>
  )
}
