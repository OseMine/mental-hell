import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface CompletedPillProps {
  label: string;
  value: number;
  color: string;
}

export function CompletedPill({ label, value, color }: CompletedPillProps) {
  const theme = useTheme();

  return (
    <View style={[styles.pill, { backgroundColor: theme.colors.surfaceVariant }]}>
      <Text variant="labelSmall" style={{ color: theme.colors.outline, fontWeight: '700' }}>
        {label.toUpperCase()}
      </Text>
      <Text variant="titleMedium" style={[styles.value, { color }]}>
        {value}/10
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 80,
  },
  value: {
    fontWeight: '800',
    marginTop: 2,
  },
});