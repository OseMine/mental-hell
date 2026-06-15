export function getScoreDetails(score: number | null, colors: any) {
  if (score === null) {
    return {
      color: colors.outline || '#888888',
      label: 'Noch keine Daten',
      badgeBg: `${colors.outline}22`,
    };
  }
  if (score >= 7) {
    return {
      color: colors.errorContainer ? colors.primary : '#2ECC71', // Nutzt primäres M3-Grün/Themefarbe
      label: 'Gut',
      badgeBg: colors.primaryContainer || '#2ECC7122',
    };
  }
  if (score >= 4) {
    return {
      color: colors.tertiary || '#E67E22',
      label: 'Mittel',
      badgeBg: `${colors.tertiary}22`,
    };
  }
  return {
    color: colors.error || '#E74C3C',
    label: 'Niedrig',
    badgeBg: colors.errorContainer || '#E74C3C22',
  };
}