import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface AssessmentScoreProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

export function AssessmentScore({ label, value, max, color }: AssessmentScoreProps) {
  const theme = useTheme();

  return (
    <View style={styles.assessmentScore}>
      <Text variant="labelMedium" style={{ color: theme.colors.outline, fontWeight: '600' }}>
        {label}
      </Text>
      <View style={styles.row}>
        <Text variant="headlineMedium" style={[styles.value, { color }]}>
          {value}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
          /{max}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  assessmentScore: {
    alignItems: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  value: {
    fontWeight: '800',
  },
});