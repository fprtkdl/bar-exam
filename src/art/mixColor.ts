type Part = { color: string; amount: number }

/**
 * 투명한 액체 섞기: 채널별 양 가중 기하평균(빛 흡수가 곱해지는 감산 혼합 근사).
 * 노랑+파랑 → 초록처럼 실제 음료에 가깝다. 양 합이 0 이하면 첫 색.
 */
export function mixColor(parts: Part[]): string {
  return combine(parts, (cs, ws) => Math.exp(cs.reduce((s, c, i) => s + ws[i] * Math.log(c + 1), 0)) - 1)
}

/** 불투명한 것(우유·크림)·하이라이트용: 채널별 양 가중 산술평균 */
export function blend(parts: Part[]): string {
  return combine(parts, (cs, ws) => cs.reduce((s, c, i) => s + ws[i] * c, 0))
}

function combine(parts: Part[], f: (channel: number[], weights: number[]) => number): string {
  const valid = parts.filter((p) => p.amount > 0)
  if (valid.length === 0) return parts[0]?.color ?? '#eef4f7'
  const total = valid.reduce((s, p) => s + p.amount, 0)
  const ws = valid.map((p) => p.amount / total)
  const rgbs = valid.map((p) => toRgb(p.color))
  return '#' + [0, 1, 2].map((ch) => clamp(f(rgbs.map((c) => c[ch]), ws)).toString(16).padStart(2, '0')).join('')
}

const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))

export function toRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '')
  if (h.length === 3) h = [...h].map((c) => c + c).join('')
  const n = parseInt(h.slice(0, 6), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** 색을 흰색(amt>0) 또는 검정(amt<0) 쪽으로 이동 */
export function shade(hex: string, amt: number): string {
  const a = Math.min(1, Math.abs(amt))
  return blend([
    { color: hex, amount: 1 - a },
    { color: amt > 0 ? '#ffffff' : '#000000', amount: a },
  ])
}

/** 밝은 색이면 true (상대 휘도 근사) */
export function isLight(hex: string): boolean {
  const [r, g, b] = toRgb(hex)
  return 0.299 * r + 0.587 * g + 0.114 * b > 190
}
