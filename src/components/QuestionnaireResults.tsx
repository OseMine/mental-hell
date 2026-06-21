import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text, useTheme, Button, MD3Theme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ResultCard } from '@/src/widgets/ResultCard';
import { InfoBox } from '@/src/widgets/InfoBox';
import { getPHQ9Severity, getGAD7Severity } from '@/src/utils/questionnaire';
import { getSeverityColor } from '@/src/utils/formatters';
import { useTranslation } from '@/src/i18n/useTranslation';

interface QuestionnaireResultsProps {
  phq9Score: number;
  gad7Score: number;
  onBack: () => void;
}

export function QuestionnaireResults({ phq9Score, gad7Score, onBack }: QuestionnaireResultsProps) {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();

  const backToMenu = () => {
    onBack();
  };

  return (
    <View>
      <TouchableOpacity style={styles.backButtonInline} onPress={backToMenu}>
        <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
        <Text variant="labelLarge" style={{ color: theme.colors.primary, fontWeight: '700' }}>
          {t('analytics.backToOverview')}
        </Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ fontWeight: '800' }}>
          {t('analytics.results')}
        </Text>
      </View>

      <ResultCard
        title={t('analytics.phq9Result')}
        severity={t(`questionnaire.${getPHQ9Severity(phq9Score)}`)}
        score={phq9Score}
        maxScore={27}
        description={t(`phq9Descriptions.${getPHQ9Severity(phq9Score)}`)}
        iconName="sad-outline"
        scoreColor={getSeverityColor(phq9Score, 'phq9', theme.colors)}
      />

      <ResultCard
        title={t('analytics.gad7Result')}
        severity={t(`questionnaire.${getGAD7Severity(gad7Score)}`)}
        score={gad7Score}
        maxScore={21}
        description={t(`gad7Descriptions.${getGAD7Severity(gad7Score)}`)}
        iconName="alert-circle-outline"
        scoreColor={getSeverityColor(gad7Score, 'gad7', theme.colors)}
      />

      <InfoBox text={t('analytics.disclaimer')} />

      <Button
        mode="contained-tonal"
        onPress={backToMenu}
        style={styles.finishButton}
      >
        {t('analytics.closeResults')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  backButtonInline: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  header: { marginBottom: 20 },
  finishButton: { borderRadius: 100, paddingVertical: 2, marginBottom: 24 },
});
