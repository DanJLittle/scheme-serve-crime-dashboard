type MetricCardProps = {
  label: string
  value: string
  detail: string
  primary?: boolean
}

export function MetricCard({ label, value, detail, primary = false }: MetricCardProps) {
  return (
    <article className={primary ? 'metric-card metric-card-primary' : 'metric-card'}>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </article>
  )
}
