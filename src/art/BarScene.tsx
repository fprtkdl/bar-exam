import type { ReactNode } from 'react'
import { INK, useSvgId } from './svg'

/** 선반 한 칸(폭 220) 위 병 실루엣: [x, 폭, 높이, 색] */
const SHELF_BOTTLES: [number, number, number, string][][] = [
  [[14, 16, 46, '#b8681f'], [36, 14, 54, '#3f7d5a'], [56, 20, 38, '#c8102e'], [84, 14, 50, '#e6f3fb'], [104, 18, 42, '#5a0f2e'], [130, 14, 56, '#d0821f'], [152, 20, 36, '#1d7fd6'], [180, 16, 48, '#e6c77a']],
  [[8, 18, 40, '#9c4f1c'], [32, 14, 52, '#e6f3fb'], [52, 16, 44, '#5cc83b'], [78, 20, 36, '#7a2a16'], [106, 14, 54, '#c98a2e'], [128, 18, 40, '#f2d64b'], [156, 14, 50, '#b0182c'], [178, 20, 42, '#cdb08a']],
]
const SHELF_Y = [86, 168]
const TILE_W = 220

function Bottle({ x, w, h, color, base }: { x: number; w: number; h: number; color: string; base: number }) {
  const neck = w * 0.36
  const top = base - h
  const shoulder = top + h * 0.38
  const d = `M${x + w / 2 - neck / 2} ${top} H${x + w / 2 + neck / 2} V${shoulder - 6} Q${x + w} ${shoulder - 2} ${x + w} ${shoulder + 6} V${base} H${x} V${shoulder + 6} Q${x} ${shoulder - 2} ${x + w / 2 - neck / 2} ${shoulder - 6} Z`
  return (
    <g>
      <path d={d} fill={color} opacity={0.55} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      <path d={`M${x + 3.5} ${shoulder + 8} V${base - 6}`} stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.35} />
    </g>
  )
}

/**
 * 게임 배경. 백바(선반·병·조명)는 고정 크기 타일을 가로 반복하므로 폭이 늘어도 찌그러지지 않는다.
 * children 은 카운터 상판 위에 가운데 정렬로 선다.
 */
export function BarScene({ children }: { children?: ReactNode }) {
  const uid = useSvgId()
  return (
    <div className="relative w-full overflow-hidden bg-bar-night">
      <svg className="absolute inset-x-0 top-0 h-[230px] w-full" aria-hidden="true">
        <defs>
          <pattern id={`${uid}-shelf`} width={TILE_W} height={230} patternUnits="userSpaceOnUse">
            {SHELF_BOTTLES.map((row, r) =>
              row.map(([x, w, h, c], i) => <Bottle key={`${r}-${i}`} x={x} w={w} h={h} color={c} base={SHELF_Y[r]} />),
            )}
            {SHELF_Y.map((y) => (
              <g key={y}>
                <rect x={-1} y={y} width={TILE_W + 2} height={9} fill="var(--color-bar-wood)" stroke={INK} strokeWidth={2} />
                <rect x={-1} y={y} width={TILE_W + 2} height={2.5} fill="var(--color-bar-glow)" opacity={0.5} />
              </g>
            ))}
          </pattern>
          <pattern id={`${uid}-lamp`} width={440} height={230} patternUnits="userSpaceOnUse">
            <path d="M220 0 V22" stroke={INK} strokeWidth={2} />
            <path d="M206 34 Q206 22 220 22 Q234 22 234 34 Z" fill="var(--color-bar-wood)" stroke={INK} strokeWidth={2} />
            <ellipse cx={220} cy={35} rx={8} ry={3} fill="var(--color-bar-glow)" />
            <path d="M206 35 L150 230 H290 L234 35 Z" fill={`url(#${uid}-beam)`} />
          </pattern>
          <linearGradient id={`${uid}-beam`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-bar-glow)" stopOpacity={0.32} />
            <stop offset="1" stopColor="var(--color-bar-glow)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id={`${uid}-fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.55" stopColor="var(--color-bar-night)" stopOpacity={0} />
            <stop offset="1" stopColor="var(--color-bar-night)" stopOpacity={0.85} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="var(--color-bar-wall)" />
        <rect y={14} width="100%" height="100%" fill={`url(#${uid}-shelf)`} />
        <rect width="100%" height="100%" fill={`url(#${uid}-lamp)`} />
        <rect width="100%" height="100%" fill={`url(#${uid}-fade)`} />
      </svg>

      <div className="relative z-10 flex min-h-[300px] flex-wrap items-end justify-center gap-4 px-4 pt-[150px]">{children}</div>

      <svg className="relative block h-16 w-full" aria-hidden="true">
        <defs>
          <pattern id={`${uid}-plank`} width={64} height={64} patternUnits="userSpaceOnUse">
            <rect width={64} height={64} fill="var(--color-bar-wood)" />
            <path d="M0 0 V64" stroke={INK} strokeWidth={2} opacity={0.5} />
            <path d="M10 20 Q30 26 50 20" stroke="var(--color-bar-glow)" strokeWidth={1.2} fill="none" opacity={0.18} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${uid}-plank)`} />
        <rect y={0} width="100%" height={14} fill="var(--color-bar-wood)" stroke={INK} strokeWidth={2} />
        <rect y={1} width="100%" height={3} fill="var(--color-bar-glow)" opacity={0.45} />
        <rect y={14} width="100%" height={6} fill={INK} opacity={0.45} />
      </svg>
    </div>
  )
}
