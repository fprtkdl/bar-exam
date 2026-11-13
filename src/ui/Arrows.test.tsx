import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'
import { Arrows } from './Arrows'

test('화살표 아이콘 옆에 숨김 → 문자가 남는다', () => {
  const text = renderToStaticMarkup(<Arrows text="커피 리큐르→베일리스" />).replace(/<svg.*?<\/svg>|<[^>]+>/g, '')
  expect(text).toBe('커피 리큐르→베일리스')
})
