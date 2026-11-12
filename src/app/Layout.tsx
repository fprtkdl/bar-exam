import { Suspense, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { practicalMeta } from '../data/practical'
import { verifiedPeriod } from '../data/written/examMeta'

const NAV = [
  { to: '/', label: '홈', match: (p: string) => p === '/' },
  { to: '/written', label: '필기', match: (p: string) => p.startsWith('/written') },
  { to: '/practical', label: '실기', match: (p: string) => p.startsWith('/practical') && !p.startsWith('/practical/game') },
  { to: '/practical/game', label: '게임', match: (p: string) => p.startsWith('/practical/game') },
  { to: '/settings', label: '설정', match: (p: string) => p.startsWith('/settings') },
]

export function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  const links = (cls: (on: boolean) => string) =>
    NAV.map((n) => {
      const on = n.match(pathname)
      return (
        <Link key={n.to} to={n.to} aria-current={on ? 'page' : undefined} className={cls(on)}>
          {n.label}
        </Link>
      )
    })

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:bg-butter focus:p-2">
        본문으로 건너뛰기
      </a>
      <header className="border-b-2 border-ink bg-paper">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <Link to="/" className="flex items-baseline gap-2 font-pixel">
            <span className="rounded-[3px] border-2 border-ink bg-butter px-1.5 text-lg leading-tight shadow-pixel-sm">공부바</span>
            <span className="text-sm text-ink-soft">조주기능사</span>
          </Link>
          <nav aria-label="주 메뉴" className="hidden gap-1 sm:flex">
            {links(
              (on) =>
                `rounded-pixel border-2 px-3 py-1 font-pixel text-sm ${on ? 'border-ink bg-butter' : 'border-transparent hover:border-ink'}`,
            )}
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Suspense fallback={<p className="font-pixel text-ink-soft">불러오는 중…</p>}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="border-t-2 border-ink bg-paper-deep pb-20 sm:pb-0">
        <div className="mx-auto max-w-5xl px-4 py-4 text-xs text-ink-soft">
          <p>
            비공식 학습용 사이트 · 필기 출제기준 {verifiedPeriod} · 실기 표준 레시피 {practicalMeta.standardYear}년 기준
          </p>
          <p>문제는 출제기준 범위의 사실에 기반한 창작 문제이며 Q-net 기출문제가 아닙니다. 학습 기록은 이 브라우저에만 저장됩니다.</p>
        </div>
      </footer>

      <nav aria-label="주 메뉴" className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-5 border-t-2 border-ink bg-paper sm:hidden">
        {links(
          (on) =>
            `flex h-14 items-center justify-center border-r-2 border-ink font-pixel text-sm last:border-r-0 ${on ? 'bg-butter' : ''}`,
        )}
      </nav>
    </div>
  )
}
