import { describe, expect, test } from 'vitest'
import { isExpired } from './MockExam'

describe('isExpired', () => {
  const start = 1_000_000
  test('시간이 남았으면 만료 아님', () => expect(isExpired(start, start + 59 * 60_000 + 59_999, 60)).toBe(false))
  test('정각부터 만료', () => expect(isExpired(start, start + 60 * 60_000, 60)).toBe(true))
  test('한참 지난 뒤에도 만료', () => expect(isExpired(start, start + 61 * 60_000, 60)).toBe(true))
})
