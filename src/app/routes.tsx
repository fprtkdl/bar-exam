import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const HomePage = lazy(() => import('../features/home/HomePage'))
const GamePage = lazy(() => import('../features/game/GamePage'))
const SettingsPage = lazy(() => import('../features/settings/SettingsPage'))
const ArtGalleryPage = lazy(() => import('../features/dev/ArtGalleryPage'))
const WrittenHubPage = lazy(() => import('../features/written/pages/WrittenHubPage'))
const UnitPage = lazy(() => import('../features/written/pages/UnitPage'))
const TopicPage = lazy(() => import('../features/written/pages/TopicPage'))
const UnitTestsPage = lazy(() => import('../features/written/pages/UnitTestsPage'))
const MockListPage = lazy(() => import('../features/written/pages/MockListPage'))
const QuizPage = lazy(() => import('../features/written/pages/QuizPage'))
const ResultPage = lazy(() => import('../features/written/pages/ResultPage'))
const WrongNotePage = lazy(() => import('../features/written/pages/WrongNotePage'))
const StatsPage = lazy(() => import('../features/written/pages/StatsPage'))
const PracticalHubPage = lazy(() => import('../features/practical/pages/PracticalHubPage'))
const GuidePage = lazy(() => import('../features/practical/pages/GuidePage'))
const RecipesPage = lazy(() => import('../features/practical/pages/RecipesPage'))
const RecipeDetailPage = lazy(() => import('../features/practical/pages/RecipeDetailPage'))

/** §2 라우트 표. T1 이후 수정 금지 */
export const routes: RouteObject[] = [
  { path: '/', Component: HomePage },
  { path: '/written', Component: WrittenHubPage },
  { path: '/written/unit/:unitId', Component: UnitPage },
  { path: '/written/topic/:topicId', Component: TopicPage },
  { path: '/written/tests', Component: UnitTestsPage },
  { path: '/written/mock', Component: MockListPage },
  { path: '/written/quiz/:kind/:refId', Component: QuizPage },
  { path: '/written/result/:attemptId', Component: ResultPage },
  { path: '/written/wrong', Component: WrongNotePage },
  { path: '/written/stats', Component: StatsPage },
  { path: '/practical', Component: PracticalHubPage },
  { path: '/practical/guide/:categoryId', Component: GuidePage },
  { path: '/practical/recipes', Component: RecipesPage },
  { path: '/practical/recipes/:recipeId', Component: RecipeDetailPage },
  { path: '/practical/game', Component: GamePage },
  { path: '/settings', Component: SettingsPage },
  { path: '/dev/art', Component: ArtGalleryPage },
]
