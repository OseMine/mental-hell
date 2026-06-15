import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Text, useTheme, Button, MD3Theme } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useHealthStore } from '@/src/store/healthStore';
import { Background } from '@/src/widgets/Background';
import { CustomCard } from '@/src/widgets/CustomCard';
import { CompletedPill } from '@/src/widgets/CompletedPill';
import { InfoBox } from '@/src/widgets/InfoBox';

type CheckInType = 'morning' | 'midday' | 'evening';

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
  { type: 'morning', label: 'Morgen-Check',  icon: 'sunny-outline',  scheduled_time: '08:00' },
  { type: 'midday',  label: 'Mittags-Check', icon: 'cloud-outline',  scheduled_time: '13:00' },
  { type: 'evening', label: 'Abend-Check',   icon: 'moon-outline',   scheduled_time: '20:00' },
];

export default function TodayScreen() {
  const theme = useTheme() as MD3Theme;
  const { addDailyLog, getDailyLogsByType } = useHealthStore();

  const [expandedCheckIn, setExpandedCheckIn] = useState<CheckInType | null>(null);
  const [checkInData, setCheckInData] = useState<Record<CheckInType, CheckInState>>({
    morning: { mood_score: 5, stress_level: 5, notes: '', opened_at: null },
    midday:  { mood_score: 5, stress_level: 5, notes: '', opened_at: null },
    evening: { mood_score: 5, stress_level: 5, notes: '', opened_at: null },
  });

  const handleExpand = (type: CheckInType) => {
    const isOpening = expandedCheckIn !== type;
    setExpandedCheckIn(isOpening ? type : null);
    
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
      morning: 'Morgen',
      midday: 'Mittags',
      evening: 'Abend',
    };
    Alert.alert('Gespeichert ✓', `${labels[type]}-Check wurde erfolgreich verbucht.`);
    setExpandedCheckIn(null);
  };

  return (
    <Background scrollable={true}>
      
      {/* Header Bereich */}
      <View style={styles.header}>
        <Text variant="headlineLarge" style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
          Heute
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
          {new Date().toLocaleDateString('de-DE', {
            weekday: 'long', day: 'numeric', month: 'long',
          })}
        </Text>
      </View>

      {/* Die drei Check-In Karten */}
      {CHECK_IN_META.map((meta) => {
        const completed = getDailyLogsByType(meta.type);
        const isExpanded = expandedCheckIn === meta.type;
        const data = checkInData[meta.type];

        return (
          <CustomCard key={meta.type} style={styles.cardContainer}>
            
            {/* Header-Zeile der Karte */}
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => !completed && handleExpand(meta.type)}
              activeOpacity={completed ? 1 : 0.6}
            >
              <View style={styles.cardHeaderLeft}>
                <Ionicons name={meta.icon} size={24} color={theme.colors.primary} style={styles.icon} />
                <View>
                  <Text variant="titleMedium" style={{ fontWeight: '700' }}>{meta.label}</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    Geplant: {meta.scheduled_time} Uhr
                  </Text>
                </View>
              </View>

              {/* Status-Badge rechts */}
              {completed ? (
                <View style={styles.statusRow}>
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                  <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                    Erledigt
                  </Text>
                </View>
              ) : (
                <View style={styles.statusRow}>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={theme.colors.outline}
                  />
                  <Text variant="labelMedium" style={{ color: theme.colors.outline, fontWeight: '600' }}>
                    Offen
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Ausgefüllte Kurz-Zusammenfassung (wenn erledigt) */}
            {completed && (
              <View style={[styles.completedRow, { borderTopColor: theme.colors.outlineVariant }]}>
                <CompletedPill label="Stimmung" value={completed.mood_score} color={theme.colors.primary} />
                <CompletedPill label="Stress" value={completed.stress_level} color={theme.colors.tertiary} />
                <View style={styles.completedMeta}>
                  <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
                    Start: {formatTime(completed.opened_at)}
                  </Text>
                  <Text variant="labelSmall" style={{ color: theme.colors.outline, marginTop: 2 }}>
                    Ende: {formatTime(completed.saved_at)}
                  </Text>
                </View>
              </View>
            )}

            {/* Expando-Formular (wenn offen und ausgeklappt) */}
            {isExpanded && !completed && (
              <View style={[styles.form, { borderTopColor: theme.colors.outlineVariant }]}>
                {data.opened_at && (
                  <Text variant="bodySmall" style={{ color: theme.colors.outline, marginBottom: 12 }}>
                    Geöffnet um {formatTime(data.opened_at)} Uhr
                  </Text>
                )}

                {/* Regler 1: Wohlbefinden */}
                <SliderRow
                  label="Wie ist dein Wohlbefinden gerade?"
                  value={data.mood_score}
                  color={theme.colors.primary}
                  trackColor={theme.colors.surfaceVariant}
                  onChange={(v) =>
                    setCheckInData((p) => ({ ...p, [meta.type]: { ...p[meta.type], mood_score: v } }))
                  }
                  hint={getMoodDescription(data.mood_score)}
                />

                {/* Regler 2: Stress */}
                <SliderRow
                  label="Wie hoch ist dein Stress-Level?"
                  value={data.stress_level}
                  color={theme.colors.tertiary}
                  trackColor={theme.colors.surfaceVariant}
                  onChange={(v) =>
                    setCheckInData((p) => ({ ...p, [meta.type]: { ...p[meta.type], stress_level: v } }))
                  }
                />

                {/* Optionales Textfeld für Notizen */}
                <Text variant="labelLarge" style={styles.fieldLabel}>
                  Notizen (optional)
                </Text>
                <TextInput
                  style={[styles.notesInput, {
                    backgroundColor: theme.colors.surfaceContainerLow,
                    color: theme.colors.onSurface,
                    borderColor: theme.colors.outlineVariant,
                  }]}
                  placeholder="Gibt es etwas, das deine Stimmung beeinflusst hat?"
                  placeholderTextColor={theme.colors.outline}
                  multiline
                  numberOfLines={3}
                  value={data.notes}
                  onChangeText={(t) =>
                    setCheckInData((p) => ({ ...p, [meta.type]: { ...p[meta.type], notes: t } }))
                  }
                />

                {/* M3 Absende-Button */}
                <Button 
                  mode="contained" 
                  icon="check" 
                  onPress={() => handleSave(meta.type)}
                  style={styles.saveBtn}
                >
                  Eintrag speichern
                </Button>
              </View>
            )}
          </CustomCard>
        );
      })}

      <InfoBox text="Drei regelmäßige Check-Ins am Tag geben dir das präziseste Bild über deine emotionale Kurve und helfen dem Mental Score, exakte Auswertungen zu treffen." />
      
    </Background>
  );
}

// ── Sub-Komponente für Slider-Zeilen ──────────────────────────────────────────

interface SliderRowProps {
  label: string;
  value: number;
  color: string;
  trackColor: string;
  onChange: (v: number) => void;
  hint?: string;
}

function SliderRow({ label, value, color, trackColor, onChange, hint }: SliderRowProps) {
  return (
    <View style={styles.sliderSection}>
      <Text variant="labelLarge" style={{ fontWeight: '600' }}>{label}</Text>
      <View style={styles.sliderRow}>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={value}
          onValueChange={onChange}
          minimumTrackTintColor={color}
          maximumTrackTintColor={trackColor}
          thumbTintColor={color}
        />
        <Text variant="titleMedium" style={[styles.sliderVal, { color }]}>
          {Math.round(value)}/10
        </Text>
      </View>
      {hint && (
        <Text variant="bodySmall" style={styles.sliderHint}>
          {hint}
        </Text>
      )}
    </View>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function getMoodDescription(score: number): string {
  const s = Math.round(score);
  if (s <= 2) return '😞 Sehr schlecht (Antriebslos / Bedrückt)';
  if (s <= 4) return '😕 Schlecht (Unruhig / Gestresst)';
  if (s <= 6) return '😐 Neutral (Ausgeglichen / Okay)';
  if (s <= 8) return '🙂 Gut (Zufrieden / Produktiv)';
  return '😄 Sehr gut (Energiegeladen / Glücklich)';
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  headerTitle: { fontWeight: '800', letterSpacing: -0.5 },
  cardContainer: { padding: 0, overflow: 'hidden' },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { marginRight: 14 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    gap: 10,
  },
  completedMeta: { marginLeft: 'auto' },
  form: { paddingHorizontal: 16, paddingVertical: 18, borderTopWidth: 1 },
  sliderSection: { marginBottom: 18 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 },
  slider: { flex: 1, height: 40, marginLeft: -10 },
  sliderVal: { fontWeight: '800', minWidth: 45, textAlign: 'right' },
  sliderHint: { marginTop: 2, fontWeight: '500', opacity: 0.8 },
  fieldLabel: { fontWeight: '600', marginBottom: 8, marginTop: 4 },
  notesInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  saveBtn: {
    marginTop: 18,
    borderRadius: 100,
    paddingVertical: 2,
  },
});