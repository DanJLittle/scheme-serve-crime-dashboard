import { useEffect, useState } from 'react'
import type { CrimeRecord } from '../types/crime'

type CrimeFilters = {
  postcode: string | null
  category: string | null
  outcomeStatus: string | null
}

type CrimeTableProps = {
  crimes: CrimeRecord[]
}

const initialFilters: CrimeFilters = {
  postcode: null,
  category: null,
  outcomeStatus: null,
}

const OUTCOME_UNAVAILABLE_FILTER = '__outcome_unavailable__'
const PAGE_SIZE = 25

function formatLabel(value: string | null) {
  return value ? value.replace(/-/g, ' ') : 'Outcome unavailable'
}

export function CrimeTable({ crimes }: CrimeTableProps) {
  const [filters, setFilters] = useState<CrimeFilters>(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setShowBackToTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredCrimes = crimes.filter((crime) => {
    return (
      (!filters.postcode || crime.postcode === filters.postcode) &&
      (!filters.category || crime.category === filters.category) &&
      (!filters.outcomeStatus ||
        (filters.outcomeStatus === OUTCOME_UNAVAILABLE_FILTER
          ? crime.outcomeStatus === null
          : crime.outcomeStatus === filters.outcomeStatus))
    )
  })

  function updateFilter(filter: keyof CrimeFilters, value: string) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [filter]: currentFilters[filter] === value ? null : value,
    }))
    setCurrentPage(1)
  }

  function clearFilter(filter: keyof CrimeFilters) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [filter]: null,
    }))
    setCurrentPage(1)
  }

  const hasFilters = Object.values(filters).some(Boolean)
  const totalPages = Math.ceil(filteredCrimes.length / PAGE_SIZE)
  const safePage = Math.min(currentPage, Math.max(totalPages, 1))
  const visibleCrimes = filteredCrimes.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  )

  return (
    <div className="crime-table-wrapper">
      {hasFilters && (
        <div className="active-filters" aria-live="polite">
          <div className="filter-summary">
            <span>
              Showing {filteredCrimes.length.toLocaleString()} of {crimes.length.toLocaleString()} records
            </span>
            <div className="filter-chips">
              {filters.postcode && (
                <button className="filter-chip" type="button" onClick={() => clearFilter('postcode')}>
                  Postcode: {filters.postcode} <span aria-hidden="true">×</span>
                </button>
              )}
              {filters.category && (
                <button className="filter-chip" type="button" onClick={() => clearFilter('category')}>
                  Type: {formatLabel(filters.category)} <span aria-hidden="true">×</span>
                </button>
              )}
              {filters.outcomeStatus && (
                <button className="filter-chip" type="button" onClick={() => clearFilter('outcomeStatus')}>
                  Outcome: {formatLabel(filters.outcomeStatus === OUTCOME_UNAVAILABLE_FILTER ? null : filters.outcomeStatus)} <span aria-hidden="true">×</span>
                </button>
              )}
            </div>
          </div>
          <button
            className="clear-filters"
            type="button"
            onClick={() => {
              setFilters(initialFilters)
              setCurrentPage(1)
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="table-scroll-area">
        <table className="crime-table">
          <thead>
            <tr>
              <th scope="col">Postcode</th>
              <th scope="col">Date</th>
              <th scope="col">Street</th>
              <th scope="col">Crime type</th>
              <th scope="col">Outcome status</th>
            </tr>
          </thead>
          <tbody>
            {visibleCrimes.map((crime) => (
              <tr key={`${crime.id}-${crime.postcode}`}>
                <td>
                  <button
                    className={filters.postcode === crime.postcode ? 'table-filter selected' : 'table-filter'}
                    type="button"
                    aria-pressed={filters.postcode === crime.postcode}
                    onClick={() => updateFilter('postcode', crime.postcode)}
                  >
                    {crime.postcode}
                  </button>
                </td>
                <td>{crime.month}</td>
                <td>{crime.streetName}</td>
                <td>
                  <button
                    className={filters.category === crime.category ? 'table-filter selected' : 'table-filter'}
                    type="button"
                    aria-pressed={filters.category === crime.category}
                    onClick={() => updateFilter('category', crime.category)}
                  >
                    {formatLabel(crime.category)}
                  </button>
                </td>
                <td>
                  <button
                    className={filters.outcomeStatus === (crime.outcomeStatus ?? OUTCOME_UNAVAILABLE_FILTER) ? 'table-filter selected' : 'table-filter'}
                    type="button"
                    aria-pressed={filters.outcomeStatus === (crime.outcomeStatus ?? OUTCOME_UNAVAILABLE_FILTER)}
                    onClick={() => updateFilter('outcomeStatus', crime.outcomeStatus ?? OUTCOME_UNAVAILABLE_FILTER)}
                  >
                    {formatLabel(crime.outcomeStatus)}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCrimes.length === 0 && (
          <p className="table-empty-state">No crimes match the current filters.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="table-footer">
          <span>Page {safePage} of {totalPages}</span>
          <div className="pagination-controls">
            <button
              className="previous-page"
              type="button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              Previous
            </button>
            <button
              className="next-page"
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showBackToTop && (
        <button
          className="back-to-top"
          type="button"
          aria-label="Back to top"
          title="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span aria-hidden="true">↑</span>
        </button>
      )}
    </div>
  )
}
