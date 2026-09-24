import { describe, expect, it } from 'vitest'
import type { SearchCriteria } from '../types/search'
import { buildSearchQuery, getCriteriaFromSearch } from './searchParams'

describe('search params', () => {
  it('reads search criteria from the URL', () => {
    expect(
      getCriteriaFromSearch(
        '?postcodes=M1%201AE%2CSW1A%201AA&from=2025-01&to=2025-03',
        '2026-09',
      ),
    ).toEqual({
      postcodes: 'M1 1AE,SW1A 1AA',
      from: '2025-01',
      to: '2025-03',
    })
  })

  it('uses the current month when dates are absent', () => {
    expect(getCriteriaFromSearch('?postcodes=M1%201AE', '2026-09')).toEqual({
      postcodes: 'M1 1AE',
      from: '2026-09',
      to: '2026-09',
    })
  })

  it('serialises criteria for a shareable URL', () => {
    const criteria: SearchCriteria = {
      postcodes: 'M1 1AE, SW1A 1AA',
      from: '2025-01',
      to: '2025-03',
    }

    expect(buildSearchQuery(criteria)).toBe(
      '?postcodes=M1+1AE%2C+SW1A+1AA&from=2025-01&to=2025-03',
    )
  })
})
