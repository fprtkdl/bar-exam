import { expect, it } from 'vitest'
import { bitmapToPath, ICON_BITMAPS } from './icons'

it('every icon is a 16×16 bitmap of # and .', () => {
  expect(Object.keys(ICON_BITMAPS)).toHaveLength(24)
  for (const [name, rows] of Object.entries(ICON_BITMAPS)) {
    expect(rows.length, name).toBeLessThanOrEqual(16)
    for (const row of rows) expect(row, name).toMatch(/^[#.]{16}$/)
    expect(bitmapToPath(rows), name).not.toBe('')
  }
})

it('bitmapToPath merges horizontal runs', () => {
  expect(bitmapToPath(['.##.#'])).toBe('M1 0h2v1h-2zM4 0h1v1h-1z')
})
