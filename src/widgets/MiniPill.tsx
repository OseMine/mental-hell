import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface MiniPillProps {
  emoji: string;
  value: number;
  color: string;
}

export function MiniPill({ emoji, value, color }: MiniPillProps) {
  return (
    <View style={styles.miniPill}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text variant="titleMedium" style={[styles.value, { color }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  miniPill: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 14,
  },
  value: {
    fontWeight: '700',
  },
});