/** 필기 데이터 계약. 데이터 파일: src/data/written/** (계약 변경은 컨트롤러만) */

/** id 규칙: unit `u1`, topic `u1-t1`, question `u1-t1-q01` */
export interface Topic {
  id: string
  unitId: string
  title: string
  /** 한 줄 요약 (목차 화면에 표시) */
  summary: string
}

export interface Unit {
  id: string
  order: number
  title: string
  description: string
  /** 모의고사 60문항 중 이 단원 문항 수. 전 단원 합 = 60 */
  examWeight: number
  topics: Topic[]
}

export type QuestionType =
  | 'recall' // 단순 암기: 정의·용어·수치·원산지
  | 'concept' // 개념 이해: 원리·과정·이유
  | 'compare' // 비교·구분: 옳은/옳지 않은 것, 연결이 틀린 것
  | 'calc' // 계산: 도수, 용량 환산, 원가
  | 'recipe' // 레시피·기법·글라스·가니쉬
  | 'english' // 영어 지문·회화·용어
  | 'practice' // 실무 상황 판단: 서비스·위생·영업장 관리

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  recall: '암기형',
  concept: '개념 이해형',
  compare: '비교·구분형',
  calc: '계산형',
  recipe: '레시피·기법형',
  english: '영어형',
  practice: '실무 판단형',
}

export type ChoiceIndex = 0 | 1 | 2 | 3

export interface Question {
  id: string
  unitId: string
  topicId: string
  type: QuestionType
  /** 1 쉬움 · 2 보통 · 3 어려움 */
  difficulty: 1 | 2 | 3
  stem: string
  /** 지문·보기 박스가 필요할 때만 (영어 대화문 등) */
  passage?: string
  choices: [string, string, string, string]
  answer: ChoiceIndex
  /** 정답 근거 + 헷갈리는 오답이 왜 틀렸는지 */
  explanation: string
}

/** 노트 본문. 텍스트 안 `**굵게**` 만 인라인 마크업 허용 */
export type NoteBlock =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'tip'; text: string } // 시험 포인트·암기 팁

export interface NoteSection {
  heading: string
  blocks: NoteBlock[]
}

export interface TopicNote {
  topicId: string
  sections: NoteSection[]
  /** 핵심 키워드 칩 */
  keywords: string[]
}

export interface ExamMeta {
  questionCount: number
  minutes: number
  /** 합격 점수 (100점 만점) */
  passScore: number
  /** 출제기준 적용 기간 */
  standardPeriod: string
  sources: string[]
}
