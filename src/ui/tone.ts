export type Tone = 'paper' | 'peach' | 'mint' | 'lavender' | 'butter' | 'sky' | 'good' | 'bad'

/** 톤 → 배경 클래스. Tailwind 가 스캔하도록 전체 클래스명을 그대로 적는다 */
export const TONE_BG: Record<Tone, string> = {
  paper: 'bg-paper',
  peach: 'bg-peach',
  mint: 'bg-mint',
  lavender: 'bg-lavender',
  butter: 'bg-butter',
  sky: 'bg-sky',
  good: 'bg-good-soft',
  bad: 'bg-bad-soft',
}
