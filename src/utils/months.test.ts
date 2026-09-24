import { describe, expect, it } from 'vitest'
import { getMonthsInRange } from './months'

describe('getMonthsInRange', () => {
  it('returns one month when the range starts and ends in the same month', () => {
    expect(getMonthsInRange('2025-01', '2025-01')).toEqual(['2025-01'])
  })

  it('returns every month in an inclusive range', () => {
    expect(getMonthsInRange('2025-01', '2025-03')).toEqual([
      '2025-01',
      '2025-02',
      '2025-03',
    ])
  })

  it('handles ranges that cross a year boundary', () => {
    expect(getMonthsInRange('2024-12', '2025-02')).toEqual([
      '2024-12',
      '2025-01',
      '2025-02',
    ])
  })

  it('returns an empty array for an invalid or reversed range', () => {
    expect(getMonthsInRange('2025-03', '2025-01')).toEqual([])
    expect(getMonthsInRange('invalid', '2025-01')).toEqual([])
  })
})
