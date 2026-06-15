import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ResultCardProps {
  title: string;
  severity: string;
  score: number;
  maxScore: number;
  description: string;
  iconName: any;
  scoreColor: string;
}

export function ResultCard({
  title,
  severity,
  score,
  maxScore,
  description,
  iconName,
  scoreColor,
}: ResultCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
      <View style={styles.headerRow}>
        <View style={[styles.iconWrapper, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Ionicons name={iconName} size={24} color={scoreColor} />
        </View>
        <View style={styles.headerText}>
          <Text variant="titleMedium" style={{ fontWeight: '700' }}>
            {title}
          </Text>
          <Text variant="labelMedium" style={{ color: scoreColor, fontWeight: '700', marginTop: 1 }}>
            {severity}
          </Text>
        </View>
      </View>

      <View style={styles.scoreSection}>
        <Text variant="headlineSmall" style={[styles.scoreText, { color: scoreColor }]}>
          {score} <Text variant="titleSmall" style={{ color: theme.colors.outline }}>/ {maxScore} Punkte</Text>
        </Text>
      </View>

      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 20 }}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  scoreSection: {
    marginBottom: 12,
  },
  scoreText: {
    fontWeight: '800',
  },
});