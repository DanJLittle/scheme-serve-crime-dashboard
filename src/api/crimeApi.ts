import type { CrimeApiRecord, CrimeQuery, CrimeRecord } from '../types/crime'

const CRIME_API_URL = 'https://data.police.uk/api/crimes-street/all-crime'

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
