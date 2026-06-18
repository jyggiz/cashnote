export function isExpiringSoon(dateStr: string, days = 7): boolean {
  const expiry = new Date(dateStr)
  const now = new Date()
  const msInDay = 1000 * 60 * 60 * 24
  return (expiry.getTime() - now.getTime()) / msInDay <= days
}

export function isExpired(dateStr: string): boolean {
  return new Date(dateStr) < new Date()
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
