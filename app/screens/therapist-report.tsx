import React, { useState, useMemo } from 'react';
import { StyleSheet, View, ScrollView, Alert, Platform } from 'react-native';
import { Text, useTheme, Button, SegmentedButtons, MD3Theme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Sharing from 'expo-sharing';
import { useHealthStore } from '@/src/store/healthStore';
import { Background } from '@/src/widgets/Background';
import { CustomCard } from '@/src/widgets/CustomCard';
import { useTranslation } from '@/src/i18n/useTranslation';
import { router } from 'expo-router';

type DateRange = '7' | '30' | '90' | 'all';

export default function TherapistReportScreen() {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();
  const { dailyLogs, weeklyAssessments } = useHealthStore();
  const [dateRange, setDateRange] = useState<DateRange>('30');
  const [reportGenerated, setReportGenerated] = useState(false);

  const filteredLogs = useMemo(() => {
    const cutoffs: Record<DateRange, number> = {
      '7': Date.now() - 7 * 86400000,
      '30': Date.now() - 30 * 86400000,
      '90': Date.now() - 90 * 86400000,
      'all': 0,
    };
    const cutoff = cutoffs[dateRange];
    return dailyLogs.filter((l) => l.saved_at >= cutoff);
  }, [dateRange, dailyLogs]);

  const filteredAssessments = useMemo(() => {
    const cutoffs: Record<DateRange, number> = {
      '7': Date.now() - 7 * 86400000,
      '30': Date.now() - 30 * 86400000,
      '90': Date.now() - 90 * 86400000,
      'all': 0,
    };
    const cutoff = cutoffs[dateRange];
    return weeklyAssessments.filter((a) => a.timestamp >= cutoff);
  }, [dateRange, weeklyAssessments]);

  const avgMood = useMemo(() => {
    if (filteredLogs.length === 0) return 0;
    return filteredLogs.reduce((s, l) => s + l.mood_score, 0) / filteredLogs.length;
  }, [filteredLogs]);

  const avgStress = useMemo(() => {
    if (filteredLogs.length === 0) return 0;
    return filteredLogs.reduce((s, l) => s + l.stress_level, 0) / filteredLogs.length;
  }, [filteredLogs]);

  const avgPhq9 = useMemo(() => {
    if (filteredAssessments.length === 0) return null;
    return filteredAssessments.reduce((s, a) => s + a.phq9_score, 0) / filteredAssessments.length;
  }, [filteredAssessments]);

  const avgGad7 = useMemo(() => {
    if (filteredAssessments.length === 0) return null;
    return filteredAssessments.reduce((s, a) => s + a.gad7_score, 0) / filteredAssessments.length;
  }, [filteredAssessments]);

  const generateReport = () => {
    if (filteredLogs.length === 0 && filteredAssessments.length === 0) {
      Alert.alert('', t('therapist.noData'));
      return;
    }
    setReportGenerated(true);
  };

  const shareReport = async () => {
    const reportText = buildReportText();
    if (Platform.OS === 'web') {
      const blob = new Blob([reportText], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `therapist-report-${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      Alert.alert(t('common.success'), t('therapist.reportReady'));
    } else {
      try {
        const { File, Directory, Paths } = await import('expo-file-system');
        const targetDir = new Directory(Paths.document, 'exports');
        targetDir.create({ intermediates: true, idempotent: true });
        const targetFile = new File(targetDir, `therapist-report-${Date.now()}.md`);
        targetFile.write(reportText);
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(targetFile.uri, { mimeType: 'text/markdown', dialogTitle: 'Share Therapist Report' });
        }
      } catch {
        Alert.alert(t('common.error'), t('settings.exportFailedMsg'));
      }
    }
  };

  const buildReportText = () => {
    const rangeLabel = dateRange === '7' ? t('therapist.lastWeek') : dateRange === '30' ? t('therapist.lastMonth') : dateRange === '90' ? t('therapist.lastQuarter') : t('therapist.all');
    return [
      `# Mental Health Report — ${new Date().toLocaleDateString()}`,
      `**Period:** ${rangeLabel}`,
      '',
      `## Summary`,
      `- **Daily check-ins:** ${filteredLogs.length}`,
      `- **Questionnaires completed:** ${filteredAssessments.length}`,
      `- **Average mood (1-10):** ${avgMood.toFixed(1)}`,
      `- **Average stress (1-10):** ${avgStress.toFixed(1)}`,
      avgPhq9 !== null ? `- **Average PHQ-9 score:** ${avgPhq9.toFixed(1)}` : '',
      avgGad7 !== null ? `- **Average GAD-7 score:** ${avgGad7.toFixed(1)}` : '',
      '',
      `## Mood Entries`,
      ...filteredLogs.slice(0, 50).map((l) =>
        `| ${new Date(l.saved_at).toLocaleDateString()} | ${l.type} | Mood: ${l.mood_score}/10 | Stress: ${l.stress_level}/10 | Notes: ${l.notes || '-'} |`
      ),
      '',
      `## Assessment Results`,
      ...filteredAssessments.map((a) =>
        `| ${new Date(a.timestamp).toLocaleDateString()} | PHQ-9: ${a.phq9_score}/27 | GAD-7: ${a.gad7_score}/21 | Wellbeing: ${a.total_wellbeing_score.toFixed(1)}/10 |`
      ),
      '',
      '---',
      '*This report was auto-generated by Mental Hell app. It is not a medical diagnosis.*',
    ].filter(Boolean).join('\n');
  };

  return (
    <Background scrollable={true}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
            {t('therapist.title')}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
            {t('therapist.subtitle')}
          </Text>
        </View>

        <Animated.View entering={FadeInDown.duration(400).springify().damping(22).stiffness(180)}>
          <CustomCard glass>
            <Text variant="labelLarge" style={[styles.fieldLabel, { color: theme.colors.onSurface }]}>
              {t('therapist.dateRange')}
            </Text>
            <SegmentedButtons
              value={dateRange}
              onValueChange={(v) => { setDateRange(v as DateRange); setReportGenerated(false); }}
              buttons={[
                { value: '7', label: t('therapist.lastWeek') },
                { value: '30', label: t('therapist.lastMonth') },
                { value: '90', label: t('therapist.lastQuarter') },
                { value: 'all', label: t('therapist.all') },
              ]}
              style={{ marginBottom: 16 }}
            />

            <Button
              mode="contained"
              icon="analytics"
              onPress={generateReport}
              style={styles.generateBtn}
            >
              {t('therapist.generateReport')}
            </Button>
          </CustomCard>
        </Animated.View>

        {reportGenerated && (
          <>
            <Animated.View entering={FadeInDown.duration(400).delay(80).springify().damping(22).stiffness(180)}>
              <CustomCard glass>
                <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  {t('therapist.moodAverage')}
                </Text>
                <View style={styles.statRow}>
                  <View style={[styles.statBox, { backgroundColor: theme.colors.primaryContainer }]}>
                    <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: '800' }}>
                      {avgMood.toFixed(1)}
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.primary }}>/10</Text>
                  </View>
                  <View style={[styles.statBox, { backgroundColor: theme.colors.tertiaryContainer }]}>
                    <Text variant="headlineMedium" style={{ color: theme.colors.tertiary, fontWeight: '800' }}>
                      {avgStress.toFixed(1)}
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.tertiary }}>/10</Text>
                  </View>
                </View>
              </CustomCard>
            </Animated.View>

            <Animated.View entering={FadeInDown.duration(400).delay(160).springify().damping(22).stiffness(180)}>
              <CustomCard glass>
                <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  {t('therapist.assessmentCount')}
                </Text>
                <View style={styles.statRow}>
                  <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Text variant="headlineMedium" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
                      {filteredLogs.length}
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.outline }}>Check-ins</Text>
                  </View>
                  <View style={[styles.statBox, { backgroundColor: theme.colors.surfaceVariant }]}>
                    <Text variant="headlineMedium" style={{ color: theme.colors.onSurface, fontWeight: '800' }}>
                      {filteredAssessments.length}
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.outline }}>Assessments</Text>
                  </View>
                </View>
              </CustomCard>
            </Animated.View>

            {avgPhq9 !== null && (
              <Animated.View entering={FadeInDown.duration(400).delay(240).springify().damping(22).stiffness(180)}>
                <CustomCard glass>
                  <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    {t('therapist.phq9Trend')}
                  </Text>
                  <View style={styles.scoreRow}>
                    <View style={[styles.scoreBadge, { backgroundColor: theme.colors.errorContainer }]}>
                      <Text variant="headlineSmall" style={{ color: theme.colors.error, fontWeight: '700' }}>
                        {avgPhq9.toFixed(1)}
                      </Text>
                    </View>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline, flex: 1 }}>
                      / 27 · {t('therapist.lastMonth')}
                    </Text>
                  </View>
                </CustomCard>
              </Animated.View>
            )}

            {avgGad7 !== null && (
              <Animated.View entering={FadeInDown.duration(400).delay(320).springify().damping(22).stiffness(180)}>
                <CustomCard glass>
                  <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    {t('therapist.gad7Trend')}
                  </Text>
                  <View style={styles.scoreRow}>
                    <View style={[styles.scoreBadge, { backgroundColor: theme.colors.primaryContainer }]}>
                      <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                        {avgGad7.toFixed(1)}
                      </Text>
                    </View>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline, flex: 1 }}>
                      / 21 · {t('therapist.lastMonth')}
                    </Text>
                  </View>
                </CustomCard>
              </Animated.View>
            )}

            <Animated.View entering={FadeInDown.duration(400).delay(400).springify().damping(22).stiffness(180)}>
              <CustomCard style={[styles.disclaimerCard, { backgroundColor: theme.colors.errorContainer + '40' }]}>
                <Text variant="bodySmall" style={{ color: theme.colors.error, textAlign: 'center' }}>
                  {t('therapist.disclaimer')}
                </Text>
              </CustomCard>
            </Animated.View>

            <Button
              mode="contained"
              icon="share"
              onPress={shareReport}
              style={styles.shareBtn}
            >
              {t('therapist.shareReport')}
            </Button>
          </>
        )}

        <Button mode="text" onPress={() => router.back()} style={{ marginBottom: 24 }}>
          {t('common.back')}
        </Button>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 16 },
  headerTitle: { fontWeight: '800', letterSpacing: -0.5, marginBottom: 2 },
  fieldLabel: { fontWeight: '600', marginBottom: 12 },
  generateBtn: { borderRadius: 100, paddingVertical: 2 },
  sectionTitle: { fontWeight: '700', marginBottom: 14 },
  statRow: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center', gap: 4 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scoreBadge: { borderRadius: 100, paddingHorizontal: 20, paddingVertical: 8 },
  disclaimerCard: { borderRadius: 12, padding: 16 },
  shareBtn: { marginTop: 20, borderRadius: 100, marginBottom: 8 },
});