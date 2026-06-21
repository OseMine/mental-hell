export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

export function getSeverityColor(score: number, type: 'phq9' | 'gad7', colors: any): string {
  const limit = 10;
  const highLimit = 15;
  if (score < limit) return colors.primary;
  if (score < highLimit) return colors.tertiary;
  return colors.error;
}

export function getDateFormatted(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}
