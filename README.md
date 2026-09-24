# SchemeServe Crime Dashboard

A React and TypeScript dashboard for searching UK crime data by postcode and date range.

## Running locally

Requirements:

- Node.js 24 or later
- npm

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

Useful commands:

```bash
npm run lint
npm test
npm run build
```

## Current status

Implemented:

- React and TypeScript project setup with Vite
- Responsive dashboard UI
- Controlled postcode and month inputs
- Current month as the default date range
- Comma-separated postcode parsing, normalisation, and deduplication
- Get The Data postcode lookup
- Latitude and longitude conversion for valid postcodes
- Loading and error feedback
- Partial postcode failure handling: valid postcodes continue when another is invalid
- Police API requests for each resolved postcode and selected month
- Total crime count from returned records

Not implemented yet:

- Crime aggregation and summary metrics
- Crime results table and filtering
- URL query-string synchronisation
- Historic searches, persistence, dark mode, and map view

## Architecture

The current request flow is:

```text
Form input
  -> App.tsx submit handler
  -> parsePostcodes()
  -> lookupPostcodes()
  -> Get The Data API
  -> typed PostcodeLocation values
  -> Police API requests for each postcode/month
  -> typed CrimeRecord values
  -> React state
  -> loading, error, or success UI
```

Important files:

- `src/App.tsx`: page composition, form state, submission, loading, and error state.
- `src/api/postcodeApi.ts`: external postcode API requests and response normalisation.
- `src/types/postcode.ts`: TypeScript models for API data used by the app.
- `src/utils/postcodes.ts`: pure postcode parsing and deduplication logic.
- `src/App.css`: dashboard component styling.
- `src/index.css`: global colour, typography, and layout tokens.

The API module deliberately hides the external response shape from the UI. The postcode API returns `status: "match"` and latitude/longitude as strings, so the API layer checks the status and converts coordinates to numbers before returning them to React.

## Key technical decisions

### Submit-based requests

The app requests data when the form is submitted rather than on every keystroke. This avoids excessive API calls and makes the user's intent explicit. It also means the current implementation does not need a React effect for searching.

### Partial failure handling

Multiple postcode lookups use `Promise.allSettled` rather than `Promise.all`. A single invalid postcode should not discard valid postcodes from the same search. The UI reports invalid entries while continuing with successful locations.

### Separation of concerns

React owns user interaction and display state. API modules own network requests and response conversion. Utility functions own deterministic input processing. This keeps each part easier to test and explain.

### Table before map

The planned primary crime display is a filterable table rather than a map. A table directly satisfies the required postcode, date, street, crime type, and outcome fields, while a map would add more implementation and accessibility complexity within the time limit.

### Visual design

The UI uses a restrained teal accent, deep green contrast panel, cool off-white surfaces, and a small warm background tint. The intention is to feel like a calm analytical tool rather than an alarm-heavy crime product. Summary cards provide hierarchy, but the design avoids inventing crime numbers before the Police API is connected.

## Trade-offs

- **Submit-based search instead of live search:** this reduces unnecessary requests and is easier to reason about, but users do not see results update while typing.
- **Table before map:** the table is faster to build and better for the required filtering workflow, but it gives less geographic context.
- **Client-side aggregation:** aggregating the returned records in the browser keeps the app simple and transparent, but it would be less suitable for very large result sets.
- **Partial failure handling:** keeping valid postcode results makes the app more resilient, but the user must review an error message when part of a search is incomplete.
- **Direct browser API calls:** this keeps the project small and demonstrates frontend API integration, but a production system might use a backend proxy for caching, security, rate limiting, and consistent API access.
- **One request per postcode/month:** this matches the Police API contract and keeps the date range explicit, but a long date range or many postcodes can produce many requests.

### What I am not happy with yet

The current submission fetches real crime records and displays their total, but does not yet render the detailed records in the required filterable table. That is the next milestone.

## Next implementation milestone

1. Add a typed Police API response model.
2. Fetch crime records for each resolved coordinate and selected month.
3. Support every month in the selected date range without unnecessary requests.
4. Store normalised crime records in React state.
5. Calculate total crimes, category counts, and outcome counts.
6. Render the records in a filterable table.
