import { describe, expect, it } from 'vitest'
import { recipeById } from '../../../data/practical'
import { buildSteps, fmtAmount } from './steps'

describe('buildSteps', () => {
  it('셰이크 + 칠링: 칠링 → 흔들기 → 칠링 얼음 버리기 → 따르기 → 장식', () => {
    const s = buildSteps(recipeById('brandy-alexander')!)
    expect(s[0]).toContain('칠링한다')
    expect(s[1]).toContain('셰이커')
    expect(s[1]).toBe('셰이커에 큐브드 아이스와 브랜디, 크렘 드 카카오(브라운), 우유를 넣고 흔든다')
    expect(s[2]).toContain('칠링 얼음과 녹은 물을 버린다')
    expect(s[3]).toContain('따른다')
    expect(s.at(-1)).toContain('장식')
  })
  it('빌드 + 플로트', () => {
    // 설탕을 먼저 녹이고 얼음 → 위스키 (게임 채점 순서와 같음)
    expect(buildSteps(recipeById('old-fashioned')!).slice(0, 3)).toEqual([
      '올드 패션드 글라스에 설탕(가루), 앙고스투라 비터스, 소다수를 넣어 녹인다',
      '잔에 큐브드 아이스를 채운다',
      '잔에 버번 위스키를 넣는다',
    ])
    // 칠링 + 빌드만 있어도 칠링 얼음을 버린다
    expect(buildSteps(recipeById('kir')!)).toContain('칠링 얼음과 녹은 물을 버린다')
    const f = buildSteps(recipeById('pousse-cafe')!)
    expect(f).toHaveLength(1)
    expect(f[0]).toContain('띄운다')
  })
  it('계량 표기', () => {
    expect(fmtAmount(1.5, 'oz')).toBe('1 1/2 oz')
    expect(fmtAmount(1 / 3, 'part')).toBe('1/3')
  })
})
