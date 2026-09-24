import { useEffect, useState } from 'react'
import { fetchCrimesForQueries } from './api/crimeApi'
import { lookupPostcodes } from './api/postcodeApi'
import { CrimeTable } from './components/CrimeTable'
import { CrimeBreakdown } from './components/CrimeBreakdown'
import { MetricCard } from './components/MetricCard'
import { SearchForm } from './components/SearchForm'
import type { CrimeRecord } from './types/crime'
import type { SearchCriteria } from './types/search'
import { getMostCommon, summariseCrimes } from './utils/aggregation'
import { parsePostcodes } from './utils/postcodes'
import { getMonthsInRange } from './utils/months'
import { buildSearchQuery, getCriteriaFromSearch } from './utils/searchParams'
import './App.css'

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7)
}

function formatLabel(value: string | null) {
  return value ? value.replace(/-/g, ' ') : '—'
}

function App() {
  const currentMonth = getCurrentMonth()
  const [criteria, setCriteria] = useState<SearchCriteria>(() =>
    getCriteriaFromSearch(window.location.search, currentMonth),
  )
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [resolvedPostcodes, setResolvedPostcodes] = useState(0)
  const [crimes, setCrimes] = useState<CrimeRecord[]>([])
  const crimeSummary = summariseCrimes(crimes)
  const mostCommonCategory = getMostCommon(crimeSummary.categoryCounts)
  const mostCommonOutcome = getMostCommon(crimeSummary.outcomeCounts)

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setCriteria((currentCriteria) => ({
      ...currentCriteria,
      [name]: value,
    }))
  }

  async function runSearch(searchCriteria: SearchCriteria, updateUrl: boolean) {
    const postcodes = parsePostcodes(searchCriteria.postcodes)

    if (postcodes.length === 0) {
      setErrorMessage('Enter at least one postcode to search.')
      return
    }

    const months = getMonthsInRange(searchCriteria.from, searchCriteria.to)

    if (months.length === 0) {
      setErrorMessage('Choose a valid date range with the start before the end.')
      return
    }

    setIsSearching(true)
    setErrorMessage('')

    if (updateUrl) {
      window.history.pushState({}, '', buildSearchQuery(searchCriteria))
    }

    try {
      const { locations, invalidPostcodes } = await lookupPostcodes(postcodes)

      if (locations.length === 0) {
        throw new Error('Could not find any of the entered postcodes.')
      }

      const queries = locations.flatMap((location) =>
        months.map((month) => ({ ...location, month })),
      )
      const crimeResults = await fetchCrimesForQueries(queries)
      const successfulResults = crimeResults.flatMap((result) =>
        result.status === 'fulfilled' ? result.value : [],
      )
      const failedCrimeRequests = crimeResults.filter(
        (result) => result.status === 'rejected',
      ).length

      setCrimes(successfulResults)
      setResolvedPostcodes(locations.length)
      setHasSearched(true)

      const warnings = []
      if (invalidPostcodes.length > 0) {
        warnings.push(`Could not find ${invalidPostcodes.join(', ')}.`)
      }
      if (failedCrimeRequests > 0) {
        warnings.push(`${failedCrimeRequests} crime request(s) failed.`)
      }
      if (warnings.length > 0) {
        setErrorMessage(`${warnings.join(' ')} Showing available results.`)
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'The postcode lookup failed.',
      )
      setHasSearched(false)
    } finally {
      setIsSearching(false)
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void runSearch(criteria, true)
  }

  useEffect(() => {
    const initialCriteria = getCriteriaFromSearch(window.location.search, currentMonth)

    if (parsePostcodes(initialCriteria.postcodes).length > 0) {
      const searchTimer = window.setTimeout(() => {
        void runSearch(initialCriteria, false)
      }, 0)

      return () => window.clearTimeout(searchTimer)
    }
  }, [currentMonth])

  return (
    <div className="app-shell">
      <main className="dashboard">
        <header className="topbar">
          <div>
            <h1>Crime data by postcode</h1>
          </div>
          <div className="data-source">Source <strong>data.police.uk</strong></div>
        </header>

        <section className="search-panel" aria-labelledby="search-heading">
          <div className="search-intro">
            <p className="section-label">01 / Define your search</p>
            <h2 id="search-heading">Find out what is happening nearby.</h2>
            <p>Compare one or more areas across a selected period.</p>
          </div>

          <SearchForm
            criteria={criteria}
            isSearching={isSearching}
            errorMessage={errorMessage}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </section>

        <section className="overview-section" id="overview" aria-labelledby="overview-heading">
          <div className="section-heading">
            <div>
              <p className="section-label">02 / Overview</p>
              <h2 id="overview-heading">At a glance</h2>
            </div>
            <p className="period-label">{hasSearched ? `${resolvedPostcodes} area${resolvedPostcodes === 1 ? '' : 's'} found` : 'No search yet'}</p>
          </div>

          <div className="metric-grid">
            <MetricCard
              label="Total crimes"
              value={hasSearched ? crimeSummary.total.toLocaleString() : '—'}
              detail={hasSearched ? 'Records returned' : 'Search to calculate'}
              primary
            />
            <MetricCard
              label="Most common category"
              value={formatLabel(mostCommonCategory)}
              detail={mostCommonCategory ? `${crimeSummary.categoryCounts[mostCommonCategory]} records` : 'Crime categories will appear here'}
            />
            <MetricCard
              label="Most common outcome status"
              value={formatLabel(mostCommonOutcome)}
              detail={mostCommonOutcome ? `${crimeSummary.outcomeCounts[mostCommonOutcome]} records` : 'Outcome data will appear here'}
            />
          </div>
          <CrimeBreakdown
            categoryCounts={crimeSummary.categoryCounts}
            outcomeCounts={crimeSummary.outcomeCounts}
          />
        </section>

        <section className="results-panel" id="results" aria-live="polite" aria-labelledby="results-heading">
          <div className="section-heading">
            <div>
              <p className="section-label">03 / Detailed results</p>
              <h2 id="results-heading">Full list of crimes</h2>
            </div>
            <p className="table-hint">Select a postcode, crime type or outcome to filter</p>
          </div>
          {hasSearched && crimes.length === 0 ? (
            <div className="empty-results no-data-results">
              <div className="empty-icon" aria-hidden="true">i</div>
              <h3>No crime records available for this period.</h3>
              <p>
                No records were returned for {criteria.from} to {criteria.to}.
                Recent months may not be published yet, so try an earlier date range.
              </p>
            </div>
          ) : hasSearched ? (
            <CrimeTable crimes={crimes} />
          ) : (
            <div className="empty-results">
              <div className="empty-icon" aria-hidden="true">+</div>
              <h3>Your results will live here.</h3>
              <p>Run a postcode search to see crime type, street, date and outcome.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
