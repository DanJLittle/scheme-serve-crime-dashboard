import type { CrimeRecord } from '../types/crime'

export type CrimeSummary = {
  total: number
  categoryCounts: Record<string, number>
  outcomeCounts: Record<string, number>
}

function incrementCount(counts: Record<string, number>, key: string) {
  counts[key] = (counts[key] ?? 0) + 1
}

export function summariseCrimes(crimes: CrimeRecord[]): CrimeSummary {
  return crimes.reduce<CrimeSummary>(
    (summary, crime) => {
      summary.total += 1
      incrementCount(summary.categoryCounts, crime.category)
      incrementCount(
        summary.outcomeCounts,
        crime.outcomeStatus ?? 'Outcome unavailable',
      )
      return summary
    },
    { total: 0, categoryCounts: {}, outcomeCounts: {} },
  )
}

export function getMostCommon(counts: Record<string, number>) {
  return Object.entries(counts).sort(([, firstCount], [, secondCount]) =>
    secondCount - firstCount,
  )[0]?.[0] ?? null
}
