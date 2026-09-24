import { useState } from 'react'
import './App.css'

type SearchCriteria = {
  postcodes: string
  from: string
  to: string
}

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7)
}

function App() {
  const currentMonth = getCurrentMonth()
  const [criteria, setCriteria] = useState<SearchCriteria>({
    postcodes: '',
    from: currentMonth,
    to: currentMonth,
  })
  const [hasSearched, setHasSearched] = useState(false)

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setCriteria((currentCriteria) => ({
      ...currentCriteria,
      [name]: value,
    }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setHasSearched(true)
  }

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

          <form className="search-form" onSubmit={handleSubmit}>
            <label className="postcode-field">
              <span>Postcode(s)</span>
              <input
                name="postcodes"
                type="text"
                value={criteria.postcodes}
                onChange={handleInputChange}
                placeholder="M1 1AE, SW1A 1AA"
              />
              <small>Separate multiple postcodes with commas.</small>
            </label>

            <div className="date-fields">
              <label>
                <span>From</span>
                <input
                  name="from"
                  type="month"
                  value={criteria.from}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                <span>To</span>
                <input
                  name="to"
                  type="month"
                  value={criteria.to}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            <button type="submit">Search crimes <span aria-hidden="true">→</span></button>
          </form>
        </section>

        <section className="overview-section" id="overview" aria-labelledby="overview-heading">
          <div className="section-heading">
            <div>
              <p className="section-label">02 / Overview</p>
              <h2 id="overview-heading">At a glance</h2>
            </div>
            <p className="period-label">{hasSearched ? `${criteria.from} — ${criteria.to}` : 'No search yet'}</p>
          </div>

          <div className="metric-grid">
            <article className="metric-card metric-card-primary">
              <p>Total crimes</p>
              <strong>—</strong>
              <span>{hasSearched ? 'Awaiting results' : 'Search to calculate'}</span>
            </article>
            <article className="metric-card">
              <p>Most common category</p>
              <strong>—</strong>
              <span>Crime categories will appear here</span>
            </article>
            <article className="metric-card">
              <p>Outcome status</p>
              <strong>—</strong>
              <span>Outcome data will appear here</span>
            </article>
          </div>
        </section>

        <section className="results-panel" id="results" aria-live="polite" aria-labelledby="results-heading">
          <div className="section-heading">
            <div>
              <p className="section-label">03 / Detailed results</p>
              <h2 id="results-heading">Recent crimes</h2>
            </div>
            <button className="filter-button" type="button">Filter <span aria-hidden="true">⌄</span></button>
          </div>
          <div className="empty-results">
            <div className="empty-icon" aria-hidden="true">+</div>
            <h3>{hasSearched ? 'Your results are on their way.' : 'Your results will live here.'}</h3>
            <p>{hasSearched ? `Searching ${criteria.postcodes || 'the selected areas'} between ${criteria.from} and ${criteria.to}.` : 'Run a postcode search to see crime type, street, date and outcome.'}</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
