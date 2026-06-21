import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme, Button, MD3Theme } from 'react-native-paper';
import { useHealthStore } from '@/src/store/healthStore';
import { MoodChart } from '@/src/components/MoodChart';
import { CustomCard } from '@/src/widgets/CustomCard';
import { InfoBox } from '@/src/widgets/InfoBox';
import { getPHQ9Severity, getGAD7Severity } from '@/src/utils/questionnaire';
import { getSeverityColor } from '@/src/utils/formatters';
import { useTranslation } from '@/src/i18n/useTranslation';

interface QuestionnaireMenuProps {
  onStart: () => void;
}

export function QuestionnaireMenu({ onStart }: QuestionnaireMenuProps) {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();
  const { getLastSevenDaysLogs, getLastWeeklyAssessment } = useHealthStore();

  const lastSevenDaysLogs = getLastSevenDaysLogs();
  const lastAssessment = getLastWeeklyAssessment();

  return (
    <View>
      <View style={styles.header}>
        <Text variant="headlineLarge" style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
          {t('analytics.header')}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
          {t('analytics.subtitle')}
        </Text>
      </View>

      <CustomCard glass style={styles.chartCard}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          {t('analytics.moodChart')}
        </Text>
        <View style={styles.chartWrapper}>
          <MoodChart logs={lastSevenDaysLogs} width={340} height={220} />
        </View>
      </CustomCard>

      {lastAssessment && (
        <CustomCard glass style={styles.assessmentCard}>
          <Text variant="titleSmall" style={{ color: theme.colors.outline, fontWeight: '700', marginBottom: 12 }}>
            {t('analytics.lastAssessment')}
          </Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreItem}>
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>{t('analytics.phq9')}</Text>
              <Text variant="headlineSmall" style={[styles.scoreValue, { color: getSeverityColor(lastAssessment.phq9_score, 'phq9', theme.colors) }]}>
                {lastAssessment.phq9_score} <Text variant="labelSmall" style={{ color: theme.colors.outline }}>/27</Text>
              </Text>
              <Text variant="bodySmall" style={[styles.scoreSeverity, { color: theme.colors.outline }]}>
                {t(`questionnaire.${getPHQ9Severity(lastAssessment.phq9_score)}`)}
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

            <View style={styles.scoreItem}>
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>{t('analytics.gad7')}</Text>
              <Text variant="headlineSmall" style={[styles.scoreValue, { color: getSeverityColor(lastAssessment.gad7_score, 'gad7', theme.colors) }]}>
                {lastAssessment.gad7_score} <Text variant="labelSmall" style={{ color: theme.colors.outline }}>/21</Text>
              </Text>
              <Text variant="bodySmall" style={[styles.scoreSeverity, { color: theme.colors.outline }]}>
                {t(`questionnaire.${getGAD7Severity(lastAssessment.gad7_score)}`)}
              </Text>
            </View>
          </View>
        </CustomCard>
      )}

      <Button
        mode="contained"
        icon="clipboard-text"
        onPress={onStart}
        style={styles.actionButton}
        contentStyle={styles.actionButtonContent}
      >
        {t('analytics.startCheckIn')}
      </Button>

      <InfoBox text={t('analytics.info')} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  headerTitle: { fontWeight: '800', letterSpacing: -0.5, marginBottom: 2 },
  chartCard: { padding: 14, marginBottom: 16 },
  sectionTitle: { fontWeight: '700', marginBottom: 12 },
  chartWrapper: { alignItems: 'center', justifyContent: 'center', marginVertical: 4 },
  assessmentCard: { padding: 16, marginBottom: 20 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scoreItem: { flex: 1, alignItems: 'center' },
  divider: { width: 1, height: 50, opacity: 0.3 },
  scoreValue: { fontWeight: '800', marginTop: 4, marginBottom: 2 },
  scoreSeverity: { fontWeight: '600', textAlign: 'center' },
  actionButton: { marginTop: 4, marginBottom: 16, borderRadius: 100 },
  actionButtonContent: { paddingVertical: 6 },
});
