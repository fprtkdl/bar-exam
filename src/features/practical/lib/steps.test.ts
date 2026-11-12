import { describe, expect, it } from 'vitest'
import { recipeById } from '../../../data/practical'
import { buildSteps, fmtAmount } from './steps'

describe('buildSteps', () => {
  it('셰이크 + 칠링: 칠링 → 흔들기 → 칠링 얼음 버리기 → 따르기 → 장식', () => {
    const s = buildSteps(recipeById('brandy-alexander')!)
    expect(s[0]).toContain('칠링한다')
    expect(s[1]).toContain('셰이커')
    expect(s[2]).toContain('칠링 얼음을 버린다')
    expect(s[3]).toContain('따른다')
    expect(s.at(-1)).toContain('장식')
  })
  it('빌드 + 플로트', () => {
    expect(buildSteps(recipeById('old-fashioned')!)[1]).toContain('얼음을 채운 잔에')
    const f = buildSteps(recipeById('pousse-cafe')!)
    expect(f).toHaveLength(1)
    expect(f[0]).toContain('띄운다')
  })
  it('계량 표기', () => {
    expect(fmtAmount(1.5, 'oz')).toBe('1 1/2 oz')
    expect(fmtAmount(1 / 3, 'part')).toBe('1/3')
  })
})
