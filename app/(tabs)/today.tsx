import Colors from "@/constants/Colors";
import { useHealthStore } from "@/src/store/healthStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CheckInType = "morning" | "midday" | "evening";

interface CheckInState {
  mood_score: number;
  stress_level: number;
  notes: string;
  opened_at: number | null;
}

const CHECK_IN_META: Array<{
  type: CheckInType;
  label: string;
  icon: any;
  scheduled_time: string;
}> = [
  { type: "morning", label: "Morgen-Check",  icon: "sunny-outline",  scheduled_time: "08:00" },
  { type: "midday",  label: "Mittags-Check", icon: "cloud-outline",  scheduled_time: "13:00" },
  { type: "evening", label: "Abend-Check",   icon: "moon-outline",   scheduled_time: "20:00" },
];

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { addDailyLog, getDailyLogsByType } = useHealthStore();

  const [expandedCheckIn, setExpandedCheckIn] = useState<CheckInType | null>(null);
  const [checkInData, setCheckInData] = useState<Record<CheckInType, CheckInState>>({
    morning: { mood_score: 5, stress_level: 5, notes: "", opened_at: null },
    midday:  { mood_score: 5, stress_level: 5, notes: "", opened_at: null },
    evening: { mood_score: 5, stress_level: 5, notes: "", opened_at: null },
  });

  const handleExpand = (type: CheckInType) => {
    const isOpening = expandedCheckIn !== type;
    setExpandedCheckIn(isOpening ? type : null);
    // Record opened_at only the first time
    if (isOpening && checkInData[type].opened_at === null) {
      setCheckInData((prev) => ({
        ...prev,
        [type]: { ...prev[type], opened_at: Date.now() },
      }));
    }
  };

  const handleSave = (type: CheckInType) => {
    const data = checkInData[type];
    const meta = CHECK_IN_META.find((m) => m.type === type)!;

    addDailyLog({
      type,
      mood_score: data.mood_score,
      stress_level: data.stress_level,
      notes: data.notes,
      scheduled_time: meta.scheduled_time,
      opened_at: data.opened_at ?? Date.now(),
      saved_at: Date.now(),
    });

    const labels: Record<CheckInType, string> = {
      morning: "Morgen",
      midday: "Mittags",
      evening: "Abend",
    };
    Alert.alert("Gespeichert ✓", `${labels[type]}-Check wurde gespeichert.`);
    setExpandedCheckIn(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Heute</Text>
          <Text style={[styles.headerSub, { color: colors.gray }]}>
            {new Date().toLocaleDateString("de-DE", {
              weekday: "long", day: "numeric", month: "long",
            })}
          </Text>
        </View>

        {CHECK_IN_META.map((meta) => {
          const completed = getDailyLogsByType(meta.type);
          const isExpanded = expandedCheckIn === meta.type;
          const data = checkInData[meta.type];

          return (
            <View key={meta.type} style={styles.card}>
              {/* Header row */}
              <TouchableOpacity
                style={[
                  styles.cardHeader,
                  { backgroundColor: colors.card },
                  isExpanded && styles.cardHeaderExpanded,
                ]}
                onPress={() => !completed && handleExpand(meta.type)}
                activeOpacity={completed ? 1 : 0.7}
              >
                <View style={styles.cardHeaderLeft}>
                  <Ionicons name={meta.icon} size={24} color={colors.blue} style={styles.icon} />
                  <View>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{meta.label}</Text>
                    <Text style={[styles.cardSub, { color: colors.gray }]}>
                      Geplant: {meta.scheduled_time} Uhr
                    </Text>
                  </View>
                </View>

                {completed ? (
                  <View style={styles.row}>
                    <Ionicons name="checkmark-circle" size={22} color={colors.green} />
                    <Text style={[styles.badge, { color: colors.green }]}>Erledigt</Text>
                  </View>
                ) : (
                  <View style={styles.row}>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={colors.gray}
                    />
                    <Text style={[styles.badge, { color: colors.gray }]}>Offen</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Completed summary */}
              {completed && (
                <View style={[styles.completedRow, { backgroundColor: colors.card, borderTopColor: colors.lightGray }]}>
                  <CompletedPill label="Stimmung" value={completed.mood_score} color={colors.blue} />
                  <CompletedPill label="Stress" value={completed.stress_level} color={colors.orange} />
                  <View style={styles.completedMeta}>
                    <Text style={[styles.metaText, { color: colors.gray }]}>
                      Geöffnet {formatTime(completed.opened_at)}
                    </Text>
                    <Text style={[styles.metaText, { color: colors.gray }]}>
                      Gespeichert {formatTime(completed.saved_at)}
                    </Text>
                  </View>
                </View>
              )}

              {/* Form */}
              {isExpanded && !completed && (
                <View style={[styles.form, { backgroundColor: colors.card, borderTopColor: colors.lightGray }]}>
                  {data.opened_at && (
                    <Text style={[styles.openedAt, { color: colors.gray }]}>
                      Geöffnet um {formatTime(data.opened_at)}
                    </Text>
                  )}

                  <SliderRow
                    label="Wohlbefinden"
                    value={data.mood_score}
                    color={colors.blue}
                    lightGray={colors.lightGray}
                    onChange={(v) =>
                      setCheckInData((p) => ({ ...p, [meta.type]: { ...p[meta.type], mood_score: v } }))
                    }
                    hint={getMoodDescription(data.mood_score)}
                    textColor={colors.text}
                  />

                  <SliderRow
                    label="Stress-Level"
                    value={data.stress_level}
                    color={colors.orange}
                    lightGray={colors.lightGray}
                    onChange={(v) =>
                      setCheckInData((p) => ({ ...p, [meta.type]: { ...p[meta.type], stress_level: v } }))
                    }
                    textColor={colors.text}
                  />

                  <Text style={[styles.label, { color: colors.text }]}>Notizen (optional)</Text>
                  <TextInput
                    style={[styles.notesInput, {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.lightGray,
                    }]}
                    placeholder="Wie geht es dir heute?"
                    placeholderTextColor={colors.gray}
                    multiline
                    numberOfLines={3}
                    value={data.notes}
                    onChangeText={(t) =>
                      setCheckInData((p) => ({ ...p, [meta.type]: { ...p[meta.type], notes: t } }))
                    }
                  />

                  <TouchableOpacity
                    style={[styles.saveBtn, { backgroundColor: colors.blue }]}
                    onPress={() => handleSave(meta.type)}
                  >
                    <Ionicons name="checkmark" size={20} color="#fff" />
                    <Text style={styles.saveBtnText}>Eintrag speichern</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        <View style={[styles.infoBox, { backgroundColor: colorScheme === "dark" ? "#1a2a3a" : "#EBF3FF" }]}>
          <Ionicons name="information-circle" size={20} color={colors.blue} />
          <Text style={[styles.infoText, { color: colors.text }]}>
            Drei tägliche Check-Ins helfen dir, deine Stimmung und dein Stresslevel zu verfolgen.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function SliderRow({
  label, value, color, lightGray, onChange, hint, textColor,
}: {
  label: string; value: number; color: string; lightGray: string;
  onChange: (v: number) => void; hint?: string; textColor: string;
}) {
  return (
    <View style={styles.sliderSection}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <View style={styles.sliderRow}>
        <Slider
          style={styles.slider}
          minimumValue={1} maximumValue={10} step={1}
          value={value}
          onValueChange={onChange}
          minimumTrackTintColor={color}
          maximumTrackTintColor={lightGray}
          thumbTintColor={color}
        />
        <Text style={[styles.sliderVal, { color }]}>{Math.round(value)}/10</Text>
      </View>
      {hint && <Text style={[styles.hint, { color: textColor }]}>{hint}</Text>}
    </View>
  );
}

function CompletedPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.pill}>
      <Text style={[styles.pillLabel, { color }]}>{label}</Text>
      <Text style={[styles.pillValue, { color }]}>{value}/10</Text>
    </View>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

function getMoodDescription(score: number): string {
  const s = Math.round(score);
  if (s <= 2) return "😞 Sehr schlecht";
  if (s <= 4) return "😕 Schlecht";
  if (s <= 6) return "😐 Neutral";
  if (s <= 8) return "🙂 Gut";
  return "😄 Sehr gut";
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingVertical: 16 },
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 32, fontWeight: "700", marginBottom: 4 },
  headerSub: { fontSize: 14 },
  card: { marginBottom: 12, borderRadius: 12, overflow: "hidden" },
  cardHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingHorizontal: 16, paddingVertical: 14,
  },
  cardHeaderExpanded: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  icon: { marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  cardSub: { fontSize: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  badge: { fontSize: 12, fontWeight: "600" },
  completedRow: {
    flexDirection: "row", alignItems: "center", flexWrap: "wrap",
    paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, gap: 12,
  },
  pill: { alignItems: "center" },
  pillLabel: { fontSize: 11, fontWeight: "600", marginBottom: 2 },
  pillValue: { fontSize: 16, fontWeight: "700" },
  completedMeta: { marginLeft: "auto" },
  metaText: { fontSize: 11, textAlign: "right" },
  form: { paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1 },
  openedAt: { fontSize: 11, marginBottom: 12 },
  sliderSection: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 10 },
  sliderRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  slider: { flex: 1, height: 40 },
  sliderVal: { fontSize: 14, fontWeight: "600", minWidth: 40 },
  hint: { fontSize: 12, marginTop: 6 },
  notesInput: {
    borderWidth: 1, borderRadius: 8, paddingHorizontal: 12,
    paddingVertical: 10, fontSize: 14, minHeight: 80, marginBottom: 4,
  },
  saveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 12, borderRadius: 8, marginTop: 12, gap: 8,
  },
  saveBtnText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  infoBox: {
    flexDirection: "row", borderRadius: 10, padding: 12,
    marginTop: 8, gap: 12, marginBottom: 20,
  },
  infoText: { flex: 1, fontSize: 12, lineHeight: 16 },
});