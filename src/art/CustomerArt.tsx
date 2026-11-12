import type { ReactNode } from 'react'
import { ArtSvg, INK, LINE, THIN } from './svg'

type Style = 'short' | 'bob' | 'bun' | 'long' | 'curly' | 'cap'
const VARIANTS: { skin: string; hair: string; shirt: string; style: Style }[] = [
  { skin: '#f6d2b8', hair: '#3b2a2a', shirt: '#7fb6e8', style: 'short' },
  { skin: '#e9b48f', hair: '#2a2f5a', shirt: '#f59fb0', style: 'bob' },
  { skin: '#c98e66', hair: '#5a3a2e', shirt: '#9bd3ae', style: 'bun' },
  { skin: '#f8dcc4', hair: '#e0a83a', shirt: '#c7b8f2', style: 'long' },
  { skin: '#8d5b3e', hair: '#1a1a1a', shirt: '#ffd36b', style: 'curly' },
  { skin: '#f1c6a6', hair: '#8a8fae', shirt: '#ff9e7a', style: 'cap' },
]

const BANGS = 'M28 44 Q28 20 50 20 Q72 20 72 44 Q64 32 50 33 Q36 32 28 44 Z'

function hair(style: Style, c: string): { back?: ReactNode; front: ReactNode } {
  switch (style) {
    case 'short':
      return { front: <path d={BANGS} fill={c} {...LINE} /> }
    case 'bob':
      return { back: <path d="M24 46 Q24 18 50 18 Q76 18 76 46 V70 H24 Z" fill={c} {...LINE} />, front: <path d="M28 44 Q30 22 50 22 Q70 22 72 44 H28 Z" fill={c} {...LINE} /> }
    case 'bun':
      return { front: <g><circle cx={50} cy={14} r={9} fill={c} {...LINE} /><path d={BANGS} fill={c} {...LINE} /></g> }
    case 'long':
      return { back: <path d="M24 46 Q24 18 50 18 Q76 18 76 46 L80 90 H20 Z" fill={c} {...LINE} />, front: <path d="M28 46 Q30 20 50 20 Q60 20 66 26 Q56 30 48 30 Q40 36 28 46 Z" fill={c} {...LINE} /> }
    case 'curly':
      return {
        front: (
          <g fill={c} {...LINE}>
            {[[30, 34], [38, 24], [50, 20], [62, 24], [70, 34]].map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r={10} />
            ))}
          </g>
        ),
      }
    case 'cap':
      return {
        front: (
          <g>
            <path d="M28 38 Q28 18 50 18 Q72 18 72 38 Z" fill="#5cbf72" {...LINE} />
            <path d="M60 38 H84 Q84 42 78 43 H60 Z" fill="#5cbf72" {...LINE} />
          </g>
        ),
      }
  }
}

/** 손님 상반신. variant 0~5, mood 로 표정 */
export function CustomerArt({ variant, mood = 'neutral', size = 120 }: { variant: number; mood?: 'neutral' | 'happy' | 'sad'; size?: number }) {
  const v = VARIANTS[((variant % 6) + 6) % 6]
  const h = hair(v.style, v.hair)
  const label = mood === 'happy' ? '만족한 손님' : mood === 'sad' ? '실망한 손님' : '손님'
  return (
    <ArtSvg id={`customer-${variant}`} label={label} viewBox="0 0 100 110" size={size}>
      {h.back}
      <path d="M14 110 Q16 80 50 78 Q84 80 86 110 Z" fill={v.shirt} {...LINE} />
      <path d="M42 70 V82 Q50 88 58 82 V70 Z" fill={v.skin} {...LINE} />
      <circle cx={50} cy={46} r={23} fill={v.skin} {...LINE} />
      {h.front}
      {mood === 'happy' ? (
        <path d="M38 48 Q41 44 44 48 M56 48 Q59 44 62 48" fill="none" {...THIN} strokeWidth={2.5} />
      ) : (
        <g fill={INK}>
          <circle cx={41} cy={48} r={2.6} />
          <circle cx={59} cy={48} r={2.6} />
        </g>
      )}
      {mood === 'sad' && <path d="M36 43 L44 39.5 M64 43 L56 39.5" {...THIN} strokeWidth={2.5} />}
      <circle cx={35} cy={56} r={3.5} fill="#ff9e9e" opacity={0.55} />
      <circle cx={65} cy={56} r={3.5} fill="#ff9e9e" opacity={0.55} />
      {mood === 'happy' && <path d="M43 57 Q50 65 57 57 Z" fill="#c2414b" {...THIN} />}
      {mood === 'neutral' && <path d="M45 59 H55" {...THIN} strokeWidth={2.5} />}
      {mood === 'sad' && <path d="M44 62 Q50 56 56 62" fill="none" {...THIN} strokeWidth={2.5} />}
    </ArtSvg>
  )
}
