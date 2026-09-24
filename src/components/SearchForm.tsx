import type { ChangeEvent, FormEvent } from 'react'
import type { SearchCriteria } from '../types/search'

type SearchFormProps = {
  criteria: SearchCriteria
  isSearching: boolean
  errorMessage: string
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function SearchForm({
  criteria,
  isSearching,
  errorMessage,
  onInputChange,
  onSubmit,
}: SearchFormProps) {
  return (
    <form className="search-form" onSubmit={onSubmit}>
      <label className="postcode-field">
        <span>Postcode(s)</span>
        <input
          name="postcodes"
          type="text"
          value={criteria.postcodes}
          onChange={onInputChange}
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
            onChange={onInputChange}
          />
        </label>
        <label>
          <span>To</span>
          <input
            name="to"
            type="month"
            value={criteria.to}
            onChange={onInputChange}
          />
        </label>
      </div>

      <button type="submit" disabled={isSearching}>
        {isSearching ? 'Finding areas...' : 'Search crimes'}{' '}
        <span aria-hidden="true">→</span>
      </button>
      {errorMessage && <p className="form-message error-message" role="alert">{errorMessage}</p>}
    </form>
  )
}
