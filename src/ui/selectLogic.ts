/** Select 키보드 이동. 이동 키가 아니면 null. 끝에서 멈춘다(순환 없음, WAI-ARIA select-only combobox 와 같음) */
export function moveIndex(key: string, current: number, count: number, page = 5): number | null {
  if (count === 0) return null
  const last = count - 1
  switch (key) {
    case 'ArrowDown':
      return Math.min(last, current + 1)
    case 'ArrowUp':
      return Math.max(0, current - 1)
    case 'Home':
      return 0
    case 'End':
      return last
    case 'PageDown':
      return Math.min(last, current + page)
    case 'PageUp':
      return Math.max(0, current - page)
    default:
      return null
  }
}

/**
 * 글자 입력 이동: query 로 시작하는 다음 항목. 한 글자면 current 다음부터 찾아 같은 글자 반복 입력 시 순환,
 * 여러 글자면 current 부터 찾는다. 없으면 -1.
 */
export function typeaheadIndex(labels: string[], query: string, current: number): number {
  const q = query.toLocaleLowerCase()
  if (!q || labels.length === 0) return -1
  const sameChar = [...q].every((ch) => ch === q[0])
  const start = q.length === 1 || sameChar ? current + 1 : current
  const needle = sameChar ? q[0] : q
  for (let i = 0; i < labels.length; i++) {
    const idx = (start + i + labels.length) % labels.length
    if (labels[idx].toLocaleLowerCase().startsWith(needle)) return idx
  }
  return -1
}
