import { describe, expect, it } from 'vitest'
import { getMostCommon, summariseCrimes } from './aggregation'
import type { CrimeRecord } from '../types/crime'

const crimes: CrimeRecord[] = [
  {
    id: 1,
    postcode: 'M1 1AE',
    category: 'burglary',
    month: '2025-01',
    streetName: 'High Street',
    outcomeStatus: 'Under investigation',
  },
  {
    id: 2,
    postcode: 'M1 1AE',
    category: 'burglary',
    month: '2025-01',
    streetName: 'Market Street',
    outcomeStatus: null,
  },
  {
    id: 3,
    postcode: 'SW1A 1AA',
    category: 'shoplifting',
    month: '2025-02',
    streetName: 'The Mall',
    outcomeStatus: 'Under investigation',
  },
]

describe('summariseCrimes', () => {
  it('counts total crimes and groups them by category', () => {
    const summary = summariseCrimes(crimes)

    expect(summary.total).toBe(3)
    expect(summary.categoryCounts).toEqual({
      burglary: 2,
      shoplifting: 1,
    })
  })

  it('groups missing outcomes under a readable fallback label', () => {
    const summary = summariseCrimes(crimes)

    expect(summary.outcomeCounts).toEqual({
      'Under investigation': 2,
      'Outcome unavailable': 1,
    })
  })

  it('returns empty counts for no crimes', () => {
    expect(summariseCrimes([])).toEqual({
      total: 0,
      categoryCounts: {},
      outcomeCounts: {},
    })
  })

  it('returns the key with the highest count', () => {
    expect(getMostCommon({ burglary: 2, shoplifting: 1 })).toBe('burglary')
    expect(getMostCommon({})).toBeNull()
  })
})
