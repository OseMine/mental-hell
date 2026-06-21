export function getScoreDetails(score: number | null, colors: any) {
  if (score === null) {
    return {
      color: colors.outline,
      label: 'Noch keine Daten',
      badgeBg: colors.surfaceVariant,
    };
  }
  if (score >= 7) {
    return {
      color: colors.primary,
      label: 'Gut',
      badgeBg: colors.primaryContainer,
    };
  }
  if (score >= 4) {
    return {
      color: colors.tertiary,
      label: 'Mittel',
      badgeBg: colors.tertiaryContainer,
    };
  }
  return {
    color: colors.error,
    label: 'Niedrig',
    badgeBg: colors.errorContainer,
  };
}