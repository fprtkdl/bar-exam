import { bitmapToPath, ICON_BITMAPS, type IconName } from './icons'

const PATHS = Object.fromEntries(Object.entries(ICON_BITMAPS).map(([k, v]) => [k, bitmapToPath(v)])) as Record<IconName, string>

type Props = {
  name: IconName
  /** px. 16 의 배수(16·32)가 가장 선명하고 12·24 도 읽힌다 */
  size?: number
  className?: string
  /** 주면 role="img" + aria-label, 없으면 장식(aria-hidden) */
  label?: string
}

/** 16×16 도트 아이콘. 색은 글자색(currentColor)을 따른다 */
export function Icon({ name, size = 16, className = '', label }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      shapeRendering="crispEdges"
      className={`shrink-0 ${className}`}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true, focusable: false })}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
