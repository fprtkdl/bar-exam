import { Icon } from './Icon'

/** 데이터 문장 속 화살표 문자(→)를 Icon arrow-right 로 바꿔 출력한다 */
export function Arrows({ text }: { text: string }) {
  return (
    <>
      {text.split('→').flatMap((t, j) => (j ? [<Icon key={`a${j}`} name="arrow-right" size={12} className="mx-0.5 inline align-[-1px]" />, t] : [t]))}
    </>
  )
}
