import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme, ProgressBar, MD3Theme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { SlideInRight, SlideOutLeft, FadeInDown, Easing } from 'react-native-reanimated';
import { CustomCard } from '@/src/widgets/CustomCard';
import { useTranslation } from '@/src/i18n/useTranslation';

interface QuestionnaireFormProps {
  step: 'phq9' | 'gad7';
  currentQuestion: number;
  onAnswer: (value: number) => void;
  onBack: () => void;
}

export function QuestionnaireForm({ step, currentQuestion, onAnswer, onBack }: QuestionnaireFormProps) {
  const theme = useTheme() as MD3Theme;
  const { t } = useTranslation();
  const isPhq9 = step === 'phq9';
  const questions: string[] = (isPhq9 ? t('questionnaire.phq9Questions') : t('questionnaire.gad7Questions')) as unknown as string[];
  const question = questions[currentQuestion];
  const progressValue = (currentQuestion + 1) / questions.length;

  const OPTION_LABEL_KEYS = ['notAtAll', 'severalDays', 'moreThanHalf', 'nearlyEveryDay'] as const;
  const optionValues = [0, 1, 2, 3];

  return (
    <View>
      <View style={styles.questionnaireHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backArrow}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text variant="titleMedium" style={[styles.questionnaireTitle, { color: theme.colors.onBackground }]}>
          {isPhq9 ? t('analytics.phq9Title') : t('analytics.gad7Title')}
        </Text>
      </View>

      <ProgressBar progress={progressValue} color={theme.colors.primary} style={styles.progressBar} />

      <Text variant="labelMedium" style={{ color: theme.colors.outline, marginBottom: 16 }}>
        {t('analytics.questionLabel', { current: currentQuestion + 1, total: questions.length })}
      </Text>

      <Animated.View
        key={`${step}-${currentQuestion}`}
        entering={SlideInRight.duration(400).springify().damping(24).stiffness(200)}
        exiting={SlideOutLeft.duration(200).easing(Easing.out(Easing.cubic))}
      >
        <CustomCard style={styles.questionContainer}>
          <Text variant="titleMedium" style={[styles.questionText, { color: theme.colors.onSurface }]}>
            {question}
          </Text>
        </CustomCard>
      </Animated.View>

      <View style={styles.optionsContainer}>
        {optionValues.map((value, index) => (
          <Animated.View
            key={value}
            entering={FadeInDown.duration(400).delay(80 + index * 50).springify().damping(22).stiffness(180)}
          >
            <TouchableOpacity
              style={[
                styles.optionButton,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant },
              ]}
              activeOpacity={0.7}
              onPress={() => onAnswer(value)}
            >
              <View style={styles.optionContent}>
                <View style={[styles.optionDot, { backgroundColor: theme.colors.primary }]} />
                <View style={styles.optionTextContainer}>
                  <Text variant="bodyMedium" style={{ fontWeight: '600', color: theme.colors.onSurface }}>
                    {t(`questionnaire.${OPTION_LABEL_KEYS[index]}`)}
                  </Text>
                  <Text variant="labelSmall" style={{ color: theme.colors.outline, marginTop: 1 }}>
                    {value === 1 ? t('analytics.scoreLabel', { value }) : t('analytics.scoreLabelPlural', { value })}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.outline} />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  questionnaireHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 8 },
  backArrow: { paddingVertical: 4, paddingRight: 8 },
  questionnaireTitle: { fontWeight: '700', flex: 1 },
  progressBar: { height: 8, borderRadius: 4, marginBottom: 8 },
  questionContainer: { padding: 20, marginBottom: 16 },
  questionText: { fontWeight: '700', lineHeight: 24, textAlign: 'center' },
  optionsContainer: { gap: 10, marginBottom: 24 },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionContent: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 14 },
  optionDot: { width: 10, height: 10, borderRadius: 5 },
  optionTextContainer: { flex: 1 },
});
