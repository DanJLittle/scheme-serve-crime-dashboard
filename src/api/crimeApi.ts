import type { CrimeApiRecord, CrimeQuery, CrimeRecord } from '../types/crime'

const CRIME_API_URL = 'https://data.police.uk/api/crimes-street/all-crime'
const MAX_CONCURRENT_REQUESTS = 6

export async function fetchCrimesForQuery(query: CrimeQuery): Promise<CrimeRecord[]> {
  const params = new URLSearchParams({
    lat: String(query.latitude),
    lng: String(query.longitude),
    date: query.month,
  })
  const response = await fetch(`${CRIME_API_URL}?${params}`)

  if (response.status === 404) {
    return []
  }

  if (!response.ok) {
    throw new Error(`Crime lookup failed with status ${response.status}`)
  }

  const records = (await response.json()) as CrimeApiRecord[]

  return records.map((record) => ({
    id: record.id,
    postcode: query.postcode,
    category: record.category,
    month: record.month,
    streetName: record.location.street.name,
    outcomeStatus: record.outcome_status?.category ?? null,
  }))
}

export async function fetchCrimesForQueries(queries: CrimeQuery[]) {
  const results: PromiseSettledResult<CrimeRecord[]>[] = []

  for (let index = 0; index < queries.length; index += MAX_CONCURRENT_REQUESTS) {
    const batch = queries.slice(index, index + MAX_CONCURRENT_REQUESTS)
    const batchResults = await Promise.allSettled(
      batch.map((query) => fetchCrimesForQuery(query)),
    )
    results.push(...batchResults)
  }

  return results
}
