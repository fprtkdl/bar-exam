import type { IceType } from '../types/practical'
import { ArtSvg, INK } from './svg'

const ICE = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: 'round' } as const

function Cube({ x, y, s, r }: { x: number; y: number; s: number; r: number }) {
  const h = s * 0.32
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <path d={`M0 0 L${h} ${-h} H${s + h} L${s} 0 Z`} fill="#ffffff" {...ICE} />
      <path d={`M${s} 0 L${s + h} ${-h} V${s - h} L${s} ${s} Z`} fill="#c8e6f7" {...ICE} />
      <rect x={0} y={0} width={s} height={s} rx={2} fill="#dff1fb" {...ICE} />
      <path d={`M5 12 V5 H12`} fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
    </g>
  )
}

const CRUSHED = [
  [20, 74, 0], [34, 70, 40], [48, 72, 15], [62, 70, 70], [76, 74, 25],
  [27, 62, 55], [41, 58, 10], [55, 60, 80], [69, 62, 35], [35, 48, 65], [50, 46, 20], [63, 50, 50], [48, 36, 5],
] as const

export function IceArt({ type, size = 80 }: { type: IceType; size?: number }) {
  return (
    <ArtSvg id={type} label={type === 'cube' ? '큐브드 아이스' : '크러시드 아이스'} viewBox="0 0 100 100" size={size}>
      {type === 'cube' ? (
        <g>
          <Cube x={14} y={52} s={30} r={-6} />
          <Cube x={52} y={56} s={28} r={8} />
          <Cube x={32} y={26} s={26} r={2} />
        </g>
      ) : (
        <g>
          <ellipse cx={50} cy={84} rx={38} ry={7} fill="#c8e6f7" opacity={0.6} />
          {CRUSHED.map(([x, y, r], i) => (
            <path key={i} transform={`translate(${x} ${y}) rotate(${r})`} d="M-8 0 L-4 -7 L6 -6 L8 3 L1 8 L-6 6 Z" fill={i % 3 ? '#eaf7ff' : '#ffffff'} {...ICE} strokeWidth={2} />
          ))}
        </g>
      )}
    </ArtSvg>
  )
}
