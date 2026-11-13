/** 라우트 로딩: 도트 3개가 차례로 깜빡인다 */
export function PageLoading() {
  return (
    <div role="status" className="flex items-center gap-2 py-16 font-pixel text-sm text-ink-soft justify-center">
      <span className="flex gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className="pixel-blink size-2 bg-ink" style={{ animationDelay: `${i * 160}ms` }} />
        ))}
      </span>
      불러오는 중
    </div>
  )
}
