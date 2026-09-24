import type { SearchCriteria } from '../types/search'

export function getCriteriaFromSearch(search: string, currentMonth: string): SearchCriteria {
  const params = new URLSearchParams(search)

  return {
    postcodes: params.get('postcodes') ?? '',
    from: params.get('from') ?? currentMonth,
    to: params.get('to') ?? currentMonth,
  }
}

export function buildSearchQuery(criteria: SearchCriteria) {
  const params = new URLSearchParams({
    postcodes: criteria.postcodes,
    from: criteria.from,
    to: criteria.to,
  })

  return `?${params.toString()}`
}
