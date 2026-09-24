type CrimeBreakdownProps = {
  categoryCounts: Record<string, number>
  outcomeCounts: Record<string, number>
}

function formatLabel(value: string) {
  return value.replace(/-/g, ' ')
}

function BreakdownList({ counts }: { counts: Record<string, number> }) {
  const entries = Object.entries(counts).sort(([, first], [, second]) => second - first)

  if (entries.length === 0) {
    return <p className="breakdown-empty">Search to see the breakdown.</p>
  }

  return (
    <ul className="breakdown-list">
      {entries.map(([label, count]) => (
        <li key={label}>
          <span>{formatLabel(label)}</span>
          <strong>{count.toLocaleString()}</strong>
        </li>
      ))}
    </ul>
  )
}

export function CrimeBreakdown({ categoryCounts, outcomeCounts }: CrimeBreakdownProps) {
  return (
    <div className="breakdown-grid">
      <section className="breakdown-panel" aria-labelledby="category-breakdown-heading">
        <h3 id="category-breakdown-heading">Crimes by category</h3>
        <BreakdownList counts={categoryCounts} />
      </section>
      <section className="breakdown-panel" aria-labelledby="outcome-breakdown-heading">
        <h3 id="outcome-breakdown-heading">Outcomes by status</h3>
        <BreakdownList counts={outcomeCounts} />
      </section>
    </div>
  )
}
