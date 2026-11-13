import { describe, expect, it } from 'vitest'
import { moveIndex, typeaheadIndex } from './selectLogic'

describe('moveIndex', () => {
  it('moves and clamps at ends', () => {
    expect(moveIndex('ArrowDown', 0, 3)).toBe(1)
    expect(moveIndex('ArrowDown', 2, 3)).toBe(2)
    expect(moveIndex('ArrowUp', 0, 3)).toBe(0)
    expect(moveIndex('ArrowUp', 2, 3)).toBe(1)
    expect(moveIndex('Home', 2, 3)).toBe(0)
    expect(moveIndex('End', 0, 3)).toBe(2)
    expect(moveIndex('PageDown', 1, 30)).toBe(6)
    expect(moveIndex('PageUp', 3, 30)).toBe(0)
  })
  it('ignores other keys and empty lists', () => {
    expect(moveIndex('a', 0, 3)).toBeNull()
    expect(moveIndex('ArrowDown', 0, 0)).toBeNull()
  })
})

describe('typeaheadIndex', () => {
  const labels = ['Apple', 'banana', 'Blueberry', 'cherry', 'bacon']
  it('finds next match after current for a single char, wrapping', () => {
    expect(typeaheadIndex(labels, 'b', 0)).toBe(1)
    expect(typeaheadIndex(labels, 'b', 1)).toBe(2)
    expect(typeaheadIndex(labels, 'b', 4)).toBe(1)
  })
  it('matches prefixes case-insensitively from current', () => {
    expect(typeaheadIndex(labels, 'bl', 1)).toBe(2)
    expect(typeaheadIndex(labels, 'ba', 1)).toBe(1)
    expect(typeaheadIndex(labels, 'A', 3)).toBe(0)
  })
  it('repeating the same char cycles', () => {
    expect(typeaheadIndex(labels, 'bb', 1)).toBe(2)
  })
  it('works with Korean', () => {
    expect(typeaheadIndex(['진', '럼', '보드카'], '보', 0)).toBe(2)
  })
  it('returns -1 when nothing matches', () => {
    expect(typeaheadIndex(labels, 'z', 0)).toBe(-1)
    expect(typeaheadIndex([], 'a', 0)).toBe(-1)
  })
})
