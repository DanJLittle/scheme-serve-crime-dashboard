export function getMonthsInRange(from: string, to: string) {
  const start = new Date(`${from}-01T00:00:00Z`)
  const end = new Date(`${to}-01T00:00:00Z`)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return []
  }

  const months: string[] = []
  const current = new Date(start)

  while (current <= end) {
    months.push(current.toISOString().slice(0, 7))
    current.setUTCMonth(current.getUTCMonth() + 1)
  }

  return months
}
