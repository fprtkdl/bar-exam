import { Icon } from './Icon'

/** 데이터 문장 속 화살표 문자(→)를 Icon arrow-right 로 바꿔 출력한다. 스크린리더·복사용으로 숨김 문자 → 를 곁들인다 */
export function Arrows({ text }: { text: string }) {
  return (
    <>
      {text.split('→').flatMap((t, j) => (j ? [<span key={`a${j}`}><Icon name="arrow-right" size={12} className="mx-0.5 inline align-[-1px]" /><span className="sr-only">→</span></span>, t] : [t]))}
    </>
  )
}
