import { useId, type ReactNode } from 'react'
import { artOverrides, type ArtKind } from './overrides'

/** 일러스트 공용 잉크 색·선 굵기 (§4: 굵은 잉크 외곽선, 둥근 캡) */
export const INK = '#1d2348'
export const LINE = { stroke: INK, strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
export const THIN = { ...LINE, strokeWidth: 2 } as const

/** clipPath 등 url(#id) 에 안전한 고유 id */
export function useSvgId() {
  return 'a' + useId().replace(/[^a-zA-Z0-9_-]/g, '')
}

type Props = {
  /** 없으면 override 를 보지 않는다 */
  kind?: ArtKind
  id: string
  label: string
  viewBox: string
  /** 높이 px. 폭은 viewBox 비율대로 */
  size: number
  children: ReactNode
}

export function OverrideImg({ src, label, width, height }: { src: string; label: string; width: number; height: number }) {
  return <img src={src} alt={label} width={width} height={height} style={{ imageRendering: 'pixelated', objectFit: 'contain' }} />
}

/** viewBox 기반 SVG 래퍼. overrides 에 이미지가 있으면 픽셀 이미지로 교체 */
export function ArtSvg({ kind, id, label, viewBox, size, children }: Props) {
  const [, , w, h] = viewBox.split(' ').map(Number)
  const width = (size * w) / h
  const src = kind && artOverrides[`${kind}/${id}`]
  if (src) return <OverrideImg src={src} label={label} width={width} height={size} />
  return (
    <svg role="img" aria-label={label} viewBox={viewBox} width={width} height={size} style={{ overflow: 'visible' }}>
      {children}
    </svg>
  )
}
