import Colors from "@/constants/Colors";
import { useHealthStore } from "@/src/store/healthStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useMemo } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CHART_WIDTH = width - 64;
const CHART_HEIGHT = 120;
const DAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

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

  // ── Mental Score ──────────────────────────────────────────────────────────
  const mentalScore = useMemo(() => {
    const scores: number[] = [];

    // Today's mood avg (weight 2)
    if (todaysLogs.length > 0) {
      const todayMoodAvg =
        todaysLogs.reduce((s, l) => s + l.mood_score, 0) / todaysLogs.length;
      scores.push(todayMoodAvg * 2, todayMoodAvg * 2);
    }

    // 7-day mood avg (weight 2)
    if (sevenDayLogs.length > 0) {
      const weekMoodAvg =
        sevenDayLogs.reduce((s, l) => s + l.mood_score, 0) / sevenDayLogs.length;
      scores.push(weekMoodAvg * 2, weekMoodAvg * 2);
    }

    // Stress inversion (weight 1) — low stress = high score
    if (sevenDayLogs.length > 0) {
      const weekStressAvg =
        sevenDayLogs.reduce((s, l) => s + l.stress_level, 0) / sevenDayLogs.length;
      scores.push((11 - weekStressAvg) * 2);
    }

    // PHQ-9 / GAD-7 (weight 1 each) — lower = better, mapped to 1–10
    if (lastAssessment) {
      const phqScore = Math.max(1, 10 - (lastAssessment.phq9_score / 27) * 9);
      const gadScore = Math.max(1, 10 - (lastAssessment.gad7_score / 21) * 9);
      scores.push(phqScore * 2, gadScore * 2);
    }

    if (scores.length === 0) return null;
    const raw = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(Math.min(10, Math.max(1, raw)) * 10) / 10;
  }, [todaysLogs, sevenDayLogs, lastAssessment]);

  // ── 7-day chart data ──────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const dateStr = d.toDateString();
      const dayLogs = sevenDayLogs.filter(
        (l) => new Date(l.saved_at).toDateString() === dateStr
      );
      const avg =
        dayLogs.length > 0
          ? dayLogs.reduce((s, l) => s + l.mood_score, 0) / dayLogs.length
          : null;
      const label = DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1];
      return { label, avg, isToday: dateStr === today.toDateString() };
    });
  }, [sevenDayLogs]);

  const scoreColor = mentalScore === null
    ? colors.gray
    : mentalScore >= 7 ? colors.green
    : mentalScore >= 4 ? colors.orange
    : "#E74C3C";

  const scoreLabel =
    mentalScore === null ? "Noch keine Daten"
    : mentalScore >= 7 ? "Gut"
    : mentalScore >= 4 ? "Mittel"
    : "Niedrig";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Übersicht</Text>
          <Text style={[styles.headerSub, { color: colors.gray }]}>
            {new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" })}
          </Text>
        </View>

        {/* Mental Score Card */}
        <View style={[styles.scoreCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.scoreCardTitle, { color: colors.gray }]}>Mental Score</Text>
          <View style={styles.scoreRow}>
            <Text style={[styles.scoreNumber, { color: scoreColor }]}>
              {mentalScore !== null ? mentalScore.toFixed(1) : "–"}
            </Text>
            <Text style={[styles.scoreMax, { color: colors.gray }]}>/10</Text>
          </View>
          <View style={[styles.scoreBadge, { backgroundColor: scoreColor + "22" }]}>
            <Text style={[styles.scoreBadgeText, { color: scoreColor }]}>{scoreLabel}</Text>
          </View>

          {/* Score bar */}
          <View style={[styles.scoreBarBg, { backgroundColor: colors.lightGray }]}>
            <View
              style={[
                styles.scoreBarFill,
                {
                  backgroundColor: scoreColor,
                  width: mentalScore !== null ? `${(mentalScore / 10) * 100}%` : "0%",
                },
              ]}
            />
          </View>

          <Text style={[styles.scoreHint, { color: colors.gray }]}>
            Basiert auf Stimmung, Stress & Fragebögen
          </Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard
            icon="flame"
            label="Streak"
            value={`${streak}d`}
            color={colors.orange}
            cardBg={colors.card}
            textColor={colors.text}
            subColor={colors.gray}
          />
          <StatCard
            icon="today"
            label="Heute"
            value={`${todaysLogs.length}/3`}
            color={colors.blue}
            cardBg={colors.card}
            textColor={colors.text}
            subColor={colors.gray}
          />
          <StatCard
            icon="analytics"
            label="Einträge"
            value={`${sevenDayLogs.length}`}
            color={colors.green}
            cardBg={colors.card}
            textColor={colors.text}
            subColor={colors.gray}
          />
        </View>

        {/* 7-day mood chart */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Stimmung — letzte 7 Tage</Text>
          <View style={styles.chart}>
            {chartData.map((d, i) => {
              const barH = d.avg !== null ? (d.avg / 10) * CHART_HEIGHT : 0;
              return (
                <View key={i} style={styles.chartCol}>
                  <View style={[styles.chartBarBg, { height: CHART_HEIGHT }]}>
                    {d.avg !== null && (
                      <View
                        style={[
                          styles.chartBarFill,
                          {
                            height: barH,
                            backgroundColor: d.isToday ? colors.blue : colors.blue + "88",
                          },
                        ]}
                      />
                    )}
                    {d.avg === null && (
                      <View style={[styles.chartEmpty, { borderColor: colors.lightGray }]} />
                    )}
                  </View>
                  {d.avg !== null && (
                    <Text style={[styles.chartVal, { color: colors.text }]}>
                      {d.avg.toFixed(1)}
                    </Text>
                  )}
                  <Text style={[styles.chartLabel, { color: d.isToday ? colors.blue : colors.gray }]}>
                    {d.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Today's check-in summary */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Heutige Check-Ins</Text>
          {todaysLogs.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.gray }]}>
              Noch keine Check-Ins heute. Geh zur "Heute"-Ansicht.
            </Text>
          ) : (
            todaysLogs.map((log) => (
              <View key={log.id} style={[styles.logRow, { borderBottomColor: colors.lightGray }]}>
                <View style={styles.logLeft}>
                  <Ionicons
                    name={
                      log.type === "morning" ? "sunny-outline"
                      : log.type === "midday" ? "cloud-outline"
                      : "moon-outline"
                    }
                    size={18}
                    color={colors.blue}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={[styles.logType, { color: colors.text }]}>
                      {log.type === "morning" ? "Morgen"
                       : log.type === "midday" ? "Mittag"
                       : "Abend"}
                    </Text>
                    <Text style={[styles.logMeta, { color: colors.gray }]}>
                      Gespeichert {formatTime(log.saved_at)}
                    </Text>
                  </View>
                </View>
                <View style={styles.logRight}>
                  <MiniPill label="😊" value={log.mood_score} color={colors.blue} />
                  <MiniPill label="😰" value={log.stress_level} color={colors.orange} />
                </View>
              </View>
            ))
          )}
        </View>

        {/* Latest assessment */}
        {lastAssessment && (
          <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Letzter Fragebogen</Text>
            <Text style={[styles.assessmentDate, { color: colors.gray }]}>
              {new Date(lastAssessment.timestamp).toLocaleDateString("de-DE", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </Text>
            <View style={styles.assessmentRow}>
              <AssessmentScore label="PHQ-9" value={lastAssessment.phq9_score} max={27} color={colors.blue} textColor={colors.text} subColor={colors.gray} />
              <AssessmentScore label="GAD-7" value={lastAssessment.gad7_score} max={21} color={colors.orange} textColor={colors.text} subColor={colors.gray} />
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color, cardBg, textColor, subColor }: {
  icon: any; label: string; value: string; color: string;
  cardBg: string; textColor: string; subColor: string;
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: cardBg }]}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: subColor }]}>{label}</Text>
    </View>
  );
}

function MiniPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.miniPill}>
      <Text style={{ fontSize: 12 }}>{label}</Text>
      <Text style={[styles.miniPillVal, { color }]}>{value}</Text>
    </View>
  );
}

function AssessmentScore({ label, value, max, color, textColor, subColor }: {
  label: string; value: number; max: number; color: string;
  textColor: string; subColor: string;
}) {
  return (
    <View style={styles.assessmentScore}>
      <Text style={[styles.assessmentLabel, { color: subColor }]}>{label}</Text>
      <Text style={[styles.assessmentValue, { color }]}>{value}</Text>
      <Text style={[styles.assessmentMax, { color: subColor }]}>/ {max}</Text>
    </View>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingVertical: 16 },
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 32, fontWeight: "700", marginBottom: 4 },
  headerSub: { fontSize: 14 },

  scoreCard: {
    borderRadius: 16, padding: 20, marginBottom: 16, alignItems: "center",
  },
  scoreCardTitle: { fontSize: 13, fontWeight: "600", marginBottom: 8, letterSpacing: 1 },
  scoreRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  scoreNumber: { fontSize: 64, fontWeight: "700", lineHeight: 72 },
  scoreMax: { fontSize: 20, fontWeight: "400" },
  scoreBadge: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 4, marginVertical: 12 },
  scoreBadgeText: { fontSize: 14, fontWeight: "600" },
  scoreBarBg: { width: "100%", height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 8 },
  scoreBarFill: { height: "100%", borderRadius: 4 },
  scoreHint: { fontSize: 11, textAlign: "center", marginTop: 4 },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 12, padding: 14, alignItems: "center", gap: 4 },
  statValue: { fontSize: 20, fontWeight: "700" },
  statLabel: { fontSize: 11 },

  sectionCard: { borderRadius: 16, padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: "600", marginBottom: 14 },
  emptyText: { fontSize: 13, textAlign: "center", paddingVertical: 12 },

  chart: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  chartCol: { alignItems: "center", flex: 1 },
  chartBarBg: { justifyContent: "flex-end", width: "60%", borderRadius: 4, overflow: "hidden" },
  chartBarFill: { borderRadius: 4 },
  chartEmpty: { flex: 1, borderWidth: 1, borderStyle: "dashed", borderRadius: 4 },
  chartVal: { fontSize: 9, marginTop: 3, fontWeight: "600" },
  chartLabel: { fontSize: 11, marginTop: 4, fontWeight: "500" },

  logRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  logLeft: { flexDirection: "row", alignItems: "center" },
  logType: { fontSize: 14, fontWeight: "600" },
  logMeta: { fontSize: 11, marginTop: 2 },
  logRight: { flexDirection: "row", gap: 12 },
  miniPill: { alignItems: "center" },
  miniPillVal: { fontSize: 15, fontWeight: "700" },

  assessmentDate: { fontSize: 12, marginBottom: 12 },
  assessmentRow: { flexDirection: "row", gap: 24 },
  assessmentScore: { alignItems: "center" },
  assessmentLabel: { fontSize: 11, fontWeight: "600", marginBottom: 2 },
  assessmentValue: { fontSize: 28, fontWeight: "700" },
  assessmentMax: { fontSize: 12 },
});