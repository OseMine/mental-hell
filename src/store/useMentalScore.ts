import { useMemo } from 'react';
import type { DailyLog, WeeklyAssessment } from './healthStore';

function avg(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Daily formula (each component normalized to 0–10):
 *
 *   dailyScore = (
 *       (10 − Stress)       // inverted stress (1→9, 10→0)
 *     + Feeling             // raw mood (1–10)
 *     + (27 − PHQ9) / 2.7   // PHQ-9 0–27 → 10–0
 *     + (21 − GAD7) / 2.1   // GAD-7 0–21 → 10–0
 *   ) / 4
 *
 * Only available components are averaged (e.g. if no assessment exists,
 * the formula uses just (10−stress + feeling) / 2).
 */
function calcDailyScore(
  logs: DailyLog[],
  assessment: WeeklyAssessment | undefined,
): number | null {
  const components: number[] = [];

  if (logs.length > 0) {
    const feeling = avg(logs.map(l => l.mood_score));
    const stress = avg(logs.map(l => l.stress_level));
    components.push(feeling, 10 - stress);
  }

  if (assessment) {
    components.push((27 - assessment.phq9_score) / 2.7);
    components.push((21 - assessment.gad7_score) / 2.1);
  }

  if (components.length === 0) return null;
  return avg(components);
}

/**
 * Mental Score Formula:
 *
 *   LongTermScore = 0.7 × score(last24h) + 0.3 × score(last7Days avg)
 *
 * The 7-day average is the mean of each individual day's dailyScore.
 * Falls back to whichever component is available. Returns null if no data.
 */
export function calculateMentalScore(
  todaysLogs: DailyLog[],
  sevenDayLogs: DailyLog[],
  lastAssessment: WeeklyAssessment | undefined,
): number | null {
  const todayScore = calcDailyScore(todaysLogs, lastAssessment);

  const today = new Date();
  const dayScores: number[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toDateString();
    const dayLogs = sevenDayLogs.filter(
      l => new Date(l.saved_at).toDateString() === dateStr,
    );
    const score = calcDailyScore(dayLogs, lastAssessment);
    if (score !== null) dayScores.push(score);
  }

  const weekScore = dayScores.length > 0 ? avg(dayScores) : null;

  if (todayScore !== null && weekScore !== null) {
    return Math.round(clamp(0.7 * todayScore + 0.3 * weekScore, 1, 10) * 10) / 10;
  }

  if (todayScore !== null) {
    return Math.round(clamp(todayScore, 1, 10) * 10) / 10;
  }

  if (weekScore !== null) {
    return Math.round(clamp(weekScore, 1, 10) * 10) / 10;
  }

  return null;
}

export function useMentalScore(
  todaysLogs: DailyLog[],
  sevenDayLogs: DailyLog[],
  lastAssessment: WeeklyAssessment | undefined,
): number | null {
  return useMemo(
    () => calculateMentalScore(todaysLogs, sevenDayLogs, lastAssessment),
    [todaysLogs, sevenDayLogs, lastAssessment],
  );
}

export function useChartData(sevenDayLogs: DailyLog[]) {
  return useMemo(() => {
    const DAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    const today = new Date();

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toDateString();
      const dayLogs = sevenDayLogs.filter(
        (l) => new Date(l.saved_at).toDateString() === dateStr,
      );
      const avgVal = dayLogs.length > 0
        ? dayLogs.reduce((s, l) => s + l.mood_score, 0) / dayLogs.length
        : null;
      const label = DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1];
      return { label, avg: avgVal, isToday: dateStr === today.toDateString() };
    });
  }, [sevenDayLogs]);
}
