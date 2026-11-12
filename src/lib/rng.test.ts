import { expect, test } from 'vitest'
import { seededShuffle } from './rng'

const arr = Array.from({ length: 20 }, (_, i) => i)

test('같은 seed 는 같은 결과, 원본 불변', () => {
  expect(seededShuffle(arr, 'mock-1')).toEqual(seededShuffle(arr, 'mock-1'))
  expect(arr).toEqual(Array.from({ length: 20 }, (_, i) => i))
})

test('다른 seed 는 다른 순서, 원소는 보존', () => {
  const a = seededShuffle(arr, 'a')
  expect(a).not.toEqual(seededShuffle(arr, 'b'))
  expect([...a].sort((x, y) => x - y)).toEqual(arr)
})
