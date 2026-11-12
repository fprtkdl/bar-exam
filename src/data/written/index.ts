/** 필기 데이터 진입점. questions/*.ts, notes/*.ts 의 default export(배열)를 자동 수집 */
import type { Question, TopicNote } from '../../types/written'

export { units } from './syllabus'
export { examMeta } from './examMeta'

type Mod<T> = { default: T[] }
const questionMods = import.meta.glob<Mod<Question>>('./questions/*.ts', { eager: true })
const noteMods = import.meta.glob<Mod<TopicNote>>('./notes/*.ts', { eager: true })

export const questions: Question[] = Object.values(questionMods).flatMap((m) => m.default)
export const notes: TopicNote[] = Object.values(noteMods).flatMap((m) => m.default)
export const questionById: Record<string, Question> = Object.fromEntries(questions.map((q) => [q.id, q]))
