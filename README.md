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

## What it does

- Searches one or more postcodes over a month range.
- Resolves postcodes to coordinates using Get The Data.
- Fetches street crime data from the UK Police API.
- Shows total crimes, category counts, and outcome counts.
- Displays a paginated table with click-to-filter controls.
- Stores valid searches in the URL so they can be shared or reloaded.
- Reports invalid postcodes, unavailable months, loading, and partial request failures.

## Implementation overview

The form is controlled by React state. On submit, postcode input is normalised and deduplicated, then resolved to coordinates. The date range is expanded into `YYYY-MM` values because the Police API accepts one month per request. API responses are converted into typed internal records before the UI aggregates and displays them.

The main code is split between `src/components`, `src/api`, `src/types`, and `src/utils`. The API modules handle external response shapes; the utilities contain deterministic logic that can be unit tested; and React components handle interaction and display.

## Trade-offs

- **I chose submit-based searching instead of live searching.** This avoids requests on every keystroke, but results do not update until the user submits the form.
- **I chose a table instead of a map.** The table directly covers the required fields and filtering behaviour, but it gives less geographic context.
- **I chose client-side aggregation.** This kept the implementation small and easy to follow, but it would be less suitable for a very large dataset.
- **I chose direct browser API calls.** This demonstrates the frontend integration clearly, but a production application would probably add a backend proxy for caching, rate limiting, and more consistent error handling.
- **I limited Police requests to six at a time.** This reduces pressure on the external API, but a search covering many postcodes and months takes longer to complete.

### What I am not happy with

I did not add component-level tests for the form and table. The data-processing utilities have 14 unit tests, but with more time I would add tests for loading states, API errors, and clicking table filters. I also left the optional map, dark mode, and historic search features out to keep within the time limit suggested. I also would have liked to have added more filter/sort controls to the table itself.
