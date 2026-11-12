import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test } from 'vitest'
import { garnishes, glasses, ingredients, recipeById, recipes } from '../data/practical'
import { TOOL_IDS, type BottleShape } from '../types/practical'
import { BOTTLE_LABEL, BOTTLE_SHAPES } from './BottleArt'
import { CocktailArt, recipeFill } from './CocktailArt'
import { GARNISH_DEFS } from './GarnishArt'
import { GLASS_DEFS, GlassArt } from './GlassArt'
import { blend, mixColor, toRgb } from './mixColor'
import { artOverrides } from './overrides'
import { TOOL_ART } from './ToolArt'

describe('mixColor', () => {
  test('감산 혼합(기하평균): 노랑+청록 → 초록, 검정은 강하게 어둡힘', () => {
    const [r, g, b] = toRgb(mixColor([{ color: '#ffff00', amount: 1 }, { color: '#00ffff', amount: 1 }]))
    expect(g).toBe(255)
    expect(r).toBeLessThan(20)
    expect(b).toBeLessThan(20)
    expect(mixColor([{ color: '#ffffff', amount: 3 }, { color: '#000000', amount: 1 }])).toBe('#3f3f3f')
    expect(mixColor([{ color: '#abc', amount: 2 }])).toBe('#aabbcc')
  })
  test('blend 는 산술평균', () => {
    expect(blend([{ color: '#ff0000', amount: 1 }, { color: '#0000ff', amount: 1 }])).toBe('#800080')
  })
  test('양 0 은 무시, 전부 0 이면 첫 색', () => {
    expect(mixColor([{ color: '#123456', amount: 0 }, { color: '#00ff00', amount: 2 }])).toBe('#00ff00')
    expect(mixColor([{ color: '#123456', amount: 0 }])).toBe('#123456')
  })
})

describe('id 마다 그림 정의 존재', () => {
  test('잔·가니쉬·도구·병', () => {
    for (const g of glasses) expect(GLASS_DEFS[g.id], g.id).toBeDefined()
    for (const g of garnishes) expect(GARNISH_DEFS[g.id], g.id).toBeDefined()
    for (const id of TOOL_IDS) expect(TOOL_ART[id], id).toBeDefined()
    for (const i of ingredients) expect(BOTTLE_LABEL[i.id], i.id).toBeDefined()
    const shapes: BottleShape[] = ['spirit', 'liqueur', 'wine', 'juice', 'soda', 'bitters', 'syrup', 'carton', 'jar']
    for (const s of shapes) expect(BOTTLE_SHAPES[s], s).toBeDefined()
  })
})

describe('recipeFill', () => {
  test('float 은 층, 시럽 float 은 바닥(데킬라 선라이즈·푸스 카페)', () => {
    const sunrise = recipeFill(recipeById('tequila-sunrise')!)
    expect(sunrise.layers).toHaveLength(2)
    expect(sunrise.layers[0].color).toBe('#c0102c')
    const pousse = recipeFill(recipeById('pousse-cafe')!)
    expect(pousse.layers.map((l) => l.color)).toEqual(['#c0102c', '#1f9e4a', '#9c4f1c'])
    expect(recipeFill(recipeById('manhattan')!).layers).toHaveLength(1)
  })
  test('40 레시피 전부 렌더, 층 비율 양수', () => {
    for (const r of recipes) {
      const f = recipeFill(r)
      expect(f.layers.length, r.id).toBeGreaterThan(0)
      for (const l of f.layers) expect(l.ratio, r.id).toBeGreaterThan(0)
      expect(renderToStaticMarkup(<CocktailArt recipeId={r.id} />), r.id).toContain('role="img"')
    }
  })
})

describe('GlassArt', () => {
  test('level 경계·빈 layers 에서도 깨지지 않음 (NaN 없음)', () => {
    for (const level of [-1, 0, 0.5, 1, 2])
      for (const layers of [[], [{ color: '#ff0000', ratio: 1 }]]) {
        const html = renderToStaticMarkup(<GlassArt glassId="cocktail" fill={{ layers, level }} ice="crushed" garnishIds={['nutmeg', 'cherry']} rim="salt" frosted />)
        expect(html).not.toContain('NaN')
      }
  })
  test('override 가 있으면 빈 잔은 img, 채운 잔은 SVG 유지', () => {
    artOverrides['glass/highball'] = '/x.png'
    try {
      expect(renderToStaticMarkup(<GlassArt glassId="highball" />)).toContain('<img')
      expect(renderToStaticMarkup(<GlassArt glassId="highball" fill={{ layers: [{ color: '#fff', ratio: 1 }], level: 0.5 }} />)).toContain('<svg')
    } finally {
      delete artOverrides['glass/highball']
    }
  })
})
