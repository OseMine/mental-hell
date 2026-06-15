import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, useTheme, MD3Theme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useHealthStore } from '@/src/store/healthStore';
import { Background } from '@/src/widgets/Background';
import { CustomCard } from '@/src/widgets/CustomCard';
import { StatCard } from '@/src/widgets/StatCard';
import { MiniPill } from '@/src/widgets/MiniPill';
import { AssessmentScore } from '@/src/widgets/AssessmentScore';
import { getScoreDetails } from '@/src/theme/scoreTheme';

const { width } = Dimensions.get('window');
const CHART_HEIGHT = 100;
const DAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export default function HomeScreen() {
  const theme = useTheme() as MD3Theme;
  
  const {
    getTodaysLogs,
    getLastSevenDaysLogs,
    getLastWeeklyAssessment,
    getStreak,
  } = useHealthStore();

  const todaysLogs = getTodaysLogs();
  const sevenDayLogs = getLastSevenDaysLogs();
  const lastAssessment = getLastWeeklyAssessment();
  const streak = getStreak();

  // ── Mental Score Logik ────────────────────────────────────────────────────
  const mentalScore = useMemo(() => {
    const scores: number[] = [];
    if (todaysLogs.length > 0) {
      const todayMoodAvg = todaysLogs.reduce((s, l) => s + l.mood_score, 0) / todaysLogs.length;
      scores.push(todayMoodAvg * 2, todayMoodAvg * 2);
    }
    if (sevenDayLogs.length > 0) {
      const weekMoodAvg = sevenDayLogs.reduce((s, l) => s + l.mood_score, 0) / sevenDayLogs.length;
      scores.push(weekMoodAvg * 2, weekMoodAvg * 2);
    }
    if (sevenDayLogs.length > 0) {
      const weekStressAvg = sevenDayLogs.reduce((s, l) => s + l.stress_level, 0) / sevenDayLogs.length;
      scores.push((11 - weekStressAvg) * 2);
    }
    if (lastAssessment) {
      const phqScore = Math.max(1, 10 - (lastAssessment.phq9_score / 27) * 9);
      const gadScore = Math.max(1, 10 - (lastAssessment.gad7_score / 21) * 9);
      scores.push(phqScore * 2, gadScore * 2);
    }
    if (scores.length === 0) return null;
    const raw = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(Math.min(10, Math.max(1, raw)) * 10) / 10;
  }, [todaysLogs, sevenDayLogs, lastAssessment]);

  // ── Diagramm Daten ────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toDateString();
      const dayLogs = sevenDayLogs.filter(
        (l) => new Date(l.saved_at).toDateString() === dateStr
      );
      const avg = dayLogs.length > 0
          ? dayLogs.reduce((s, l) => s + l.mood_score, 0) / dayLogs.length
          : null;
      const label = DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1];
      return { label, avg, isToday: dateStr === today.toDateString() };
    });
  }, [sevenDayLogs]);

  const scoreMeta = getScoreDetails(mentalScore, theme.colors);

  return (
    <Background scrollable={true}>
      
      {/* Header Bereich */}
      <View style={styles.header}>
        <Text variant="headlineLarge" style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
          Übersicht
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
      </View>

      {/* Mental Score Hauptkarte */}
      <CustomCard style={styles.scoreCard}>
        <Text variant="labelLarge" style={[styles.scoreCardTitle, { color: theme.colors.outline }]}>
          MENTAL SCORE
        </Text>
        <View style={styles.scoreRow}>
          <Text variant="displayLarge" style={[styles.scoreNumber, { color: scoreMeta.color }]}>
            {mentalScore !== null ? mentalScore.toFixed(1) : '–'}
          </Text>
          <Text variant="titleLarge" style={{ color: theme.colors.outline }}>/10</Text>
        </View>
        
        <View style={[styles.scoreBadge, { backgroundColor: scoreMeta.badgeBg }]}>
          <Text variant="labelMedium" style={{ color: scoreMeta.color, fontWeight: '700' }}>
            {scoreMeta.label}
          </Text>
        </View>

        {/* M3 Fortschrittsbalken */}
        <View style={[styles.scoreBarBg, { backgroundColor: theme.colors.surfaceVariant }]}>
          <View
            style={[
              styles.scoreBarFill,
              {
                backgroundColor: scoreMeta.color,
                width: mentalScore !== null ? `${(mentalScore / 10) * 100}%` : '0%',
              },
            ]}
          />
        </View>
        <Text variant="bodySmall" style={{ color: theme.colors.outline, marginTop: 4 }}>
          Basiert auf Stimmung, Stress & Fragebögen
        </Text>
      </CustomCard>

      {/* Grid-Reihe für Kurz-Statistiken */}
      <View style={styles.statsRow}>
        <StatCard icon="flame" label="Streak" value={`${streak}d`} iconColor={theme.colors.error} />
        <StatCard icon="today" label="Heute" value={`${todaysLogs.length}/3`} iconColor={theme.colors.primary} />
        <StatCard icon="analytics" label="Einträge" value={`${sevenDayLogs.length}`} iconColor={theme.colors.secondary} />
      </View>

      {/* 7-Tage-Stimmungs-Chart */}
      <CustomCard>
        <Text variant="titleMedium" style={styles.sectionTitle}>Stimmung — letzte 7 Tage</Text>
        <View style={styles.chart}>
          {chartData.map((d, i) => {
            const barH = d.avg !== null ? (d.avg / 10) * CHART_HEIGHT : 0;
            return (
              <View key={i} style={styles.chartCol}>
                <View style={[styles.chartBarBg, { height: CHART_HEIGHT, backgroundColor: theme.colors.surfaceVariant }]}>
                  {d.avg !== null ? (
                    <View
                      style={[
                        styles.chartBarFill,
                        {
                          height: barH,
                          backgroundColor: d.isToday ? theme.colors.primary : theme.colors.primary + '66',
                        },
                      ]}
                    />
                  ) : (
                    <View style={[styles.chartEmpty, { borderColor: theme.colors.outlineVariant }]} />
                  )}
                </View>
                {d.avg !== null && (
                  <Text variant="labelSmall" style={styles.chartVal}>{d.avg.toFixed(1)}</Text>
                )}
                <Text 
                  variant="labelSmall" 
                  style={[styles.chartLabel, { color: d.isToday ? theme.colors.primary : theme.colors.outline }]}
                >
                  {d.label}
                </Text>
              </View>
            );
          })}
        </View>
      </CustomCard>

      {/* Heutige Check-Ins Zusammenfassung */}
      <CustomCard>
        <Text variant="titleMedium" style={styles.sectionTitle}>Heutige Check-Ins</Text>
        {todaysLogs.length === 0 ? (
          <Text variant="bodyMedium" style={[styles.emptyText, { color: theme.colors.outline }]}>
            Noch keine Check-Ins heute. Geh zur "Heute"-Ansicht.
          </Text>
        ) : (
          todaysLogs.map((log) => (
            <View key={log.id} style={[styles.logRow, { borderBottomColor: theme.colors.outlineVariant }]}>
              <View style={styles.logLeft}>
                <Ionicons
                  name={
                    log.type === 'morning' ? 'sunny-outline'
                    : log.type === 'midday' ? 'cloud-outline'
                    : 'moon-outline'
                  }
                  size={20}
                  color={theme.colors.primary}
                />
                <View style={{ marginLeft: 12 }}>
                  <Text variant="bodyMedium" style={{ fontWeight: '600' }}>
                    {log.type === 'morning' ? 'Morgen' : log.type === 'midday' ? 'Mittag' : 'Abend'}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    Gespeichert {new Date(log.saved_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
              <View style={styles.logRight}>
                <MiniPill emoji="😊" value={log.mood_score} color={theme.colors.primary} />
                <MiniPill emoji="😰" value={log.stress_level} color={theme.colors.tertiary} />
              </View>
            </View>
          ))
        )}
      </CustomCard>

      {/* Letzter Fragebogen (PHQ-9 / GAD-7) */}
      {lastAssessment && (
        <CustomCard>
          <Text variant="titleMedium" style={styles.sectionTitle}>Letzter Fragebogen</Text>
          <Text variant="bodySmall" style={{ color: theme.colors.outline, marginBottom: 12 }}>
            {new Date(lastAssessment.timestamp).toLocaleDateString('de-DE', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </Text>
          <View style={styles.assessmentRow}>
            <AssessmentScore label="PHQ-9" value={lastAssessment.phq9_score} max={27} color={theme.colors.primary} />
            <AssessmentScore label="GAD-7" value={lastAssessment.gad7_score} max={21} color={theme.colors.tertiary} />
          </View>
        </CustomCard>
      )}

    </Background>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  headerTitle: { fontWeight: '800', letterSpacing: -0.5 },
  scoreCard: { alignItems: 'center', paddingVertical: 24 },
  scoreCardTitle: { fontWeight: '700', letterSpacing: 1 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  scoreNumber: { fontWeight: '800', lineHeight: 68 },
  scoreBadge: { borderRadius: 100, paddingHorizontal: 16, paddingVertical: 4, marginVertical: 12 },
  scoreBarBg: { width: '100%', height: 8, borderRadius: 100, overflow: 'hidden', marginBottom: 8 },
  scoreBarFill: { height: '100%', borderRadius: 100 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  sectionTitle: { fontWeight: '700', marginBottom: 12 },
  emptyText: { textAlign: 'center', paddingVertical: 16 },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 8 },
  chartCol: { alignItems: 'center', flex: 1 },
  chartBarBg: { justifyContent: 'flex-end', width: '50%', borderRadius: 8, overflow: 'hidden' },
  chartBarFill: { borderRadius: 8 },
  chartEmpty: { flex: 1, borderWidth: 1, borderStyle: 'dashed', borderRadius: 8 },
  chartVal: { marginTop: 4, fontWeight: '700' },
  chartLabel: { marginTop: 4, fontWeight: '600' },
  logRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1,
  },
  logLeft: { flexDirection: 'row', alignItems: 'center' },
  logRight: { flexDirection: 'row', gap: 16 },
  assessmentRow: { flexDirection: 'row', width: '100%' },
});